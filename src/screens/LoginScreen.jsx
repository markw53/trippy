import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import RoundedButton from "../components/Button";
import Footer from "../components/Footer";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogIn, setIsLogIn] = useState(false)
  const [isGuestLogIn, setIsGuestLogIn] = useState(false)

  const { user } = useAuth();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    setIsLogIn(true)
      .then(() => {
        console.log("Logged in successfully");
        if (user) {
          console.log("Logged-in user details:", user);
        }
        setIsLogIn(false)
      })
      .catch((err) => {
       setIsLogIn(false)
       setError(err.message)
      })

  };

  const handleGuestLogin = () => {
    const guestEmail = "guest@example.com";
    const guestPassword = "trippy";

    signInWithEmailAndPassword(auth, guestEmail, guestPassword) 
    setIsGuestLogIn(true)
      .then(() => {
        setIsGuestLogIn(false)
        console.log("Guest logged in successfully")
  })
      .catch((err) => {
        setIsGuestLogIn(false)
        setError(err.message)}
      )
  };

  const handleForgetPassword = () => {
    if (!email) {
      Alert.alert(
        "Forgot Password",
        "Please enter your email address to reset your password."
      );
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Password Reset",
          "A password reset email has been sent to your email address."
        );
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.appName}>Trippy</Text>
        <Text style={styles.tagline}>Addiction to Travelling</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
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
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity onPress={handleForgetPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <RoundedButton
          title={isLogIn ? "Logging in..." : "Log In"}
          onPress={handleLogin}
          style={styles.loginButton}
          textStyle={styles.buttonText}
        />

        <View style={styles.linkRowContainer}>
          <TouchableOpacity onPress={handleGuestLogin} style={styles.guestLink}>
            <Text style={styles.guestText}>{isGuestLogIn ?" Signing In..." : "Sign in as Guest"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            style={styles.signupLink}
          >
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
  forgotPasswordText: {
    marginTop: 10,
    fontSize: 14,
    color: "#4A90E2",
    textDecorationLine: "underline",
    textAlign: "right"
  },
  appName: {
    fontSize: 50,
    fontFamily: "DancingScript-Regular",
    fontWeight: "bold",
    color: "#24565C",
    textAlign: "center",
    marginVertical: 20
  },
  tagline: {
    fontSize: 16,
    fontFamily: "DancingScript-Regular",
    color: "#24565C",
    textAlign: "center",
    marginBottom: 30
  },
  inputContainer: {
    marginVertical: 30
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
  loginButton: {
    backgroundColor: "#24565C",
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10
  },
  signupButton: {
    backgroundColor: "#4A90E2",
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingHorizontal: 10
  },
  linkRowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10
  },
  guestLink: {
    marginRight: 20
  },
  signupLink: {
    alignItems: "flex-end"
  },
  guestText: {
    color: "#24565C",
    fontSize: 14,
    textDecorationLine: "underline"
  },
  signupText: {
    color: "#4A90E2",
    fontSize: 14,
    textDecorationLine: "underline"
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center"
  }
});
