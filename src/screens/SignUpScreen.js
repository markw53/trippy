import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import RoundedButton from "../components/Button";
import Footer from "../components/Footer";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

export default function SignUpScreen({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = () => {
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { uid, email } = userCredential.user;

      
      axios
        .post("https://backend-for-trippy.onrender.com/api/users", {
          email: email,
          name: `${firstname} ${lastname}`,
          avatar_url:
            "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
        })
        .then(() => {
          console.log("User added to the database");
          navigation.navigate("Login"); 
        })
        .catch((err) => {
          console.error("Failed to add user to the database:", err);
          setError("Failed to complete signup. Please try again.");
        });
    })
    .catch((err) => {
      setError(err.message);
      console.error("Firebase signup error:", err);
    });
};
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.appName}>Trippy</Text>
        <Text style={styles.tagline}>Addiction to Travelling</Text>

        <View style={styles.inputContainer}>
          <View style={styles.row}>
            <TextInput
              placeholder="First Name"
              value={firstname}
              onChangeText={setFirstname}
              style={[styles.input, styles.halfInput]}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Last Name"
              value={lastname}
              onChangeText={setLastname}
              style={[styles.input, styles.halfInput, styles.lastInput]}
              placeholderTextColor="#888"
            />
          </View>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />

          {error
            ? <Text style={styles.error}>
                {error}
              </Text>
            : null}
        </View>

        <RoundedButton
          title="Sign Up"
          onPress={handleSignUp}
          style={styles.signupButton}
          textStyle={styles.buttonText}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.signinButton}
        >
          <Text style={styles.signinText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer text="© 2024 Trippy Holiday Planner" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7"
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  appName: {
    fontSize: 60,
    fontFamily: "DancingScript-Bold",
    fontWeight: "bold",
    color: "#24565C",
    textAlign: "center",
    marginVertical: 20
  },
  tagline: {
    fontSize: 24,
    fontFamily: "DancingScript-Bold",
    color: "#24565C",
    textAlign: "center",
    marginBottom: 30
  },
  inputContainer: {
    marginVertical: 30
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
    fontSize: 16
  },
  halfInput: {
    width: "48%"
  },
  lastInput: {
    marginLeft: "4%"
  },
  signupButton: {
    backgroundColor: "#24565C",
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFF"
  },
  signinButton: {
    marginTop: 10,
    alignSelf: "center"
  },
  signinText: {
    color: "#24565C",
    fontSize: 14,
    textDecorationLine: "underline"
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center"
  }
});
