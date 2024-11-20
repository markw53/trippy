import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import RoundedButton from "./src/components/Button";
import Footer from "./src/components/Footer";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => console.log("Logged in successfully"))
      .catch((err) => setError(err.message));
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => console.log("Account created successfully"))
      .catch((err) => setError(err.message));
  };

  const handleGuestLogin = () => {
    const guestEmail = "guest@example.com";
    const guestPassword = "trippy";

    signInWithEmailAndPassword(auth, guestEmail, guestPassword)
      .then(() => console.log("Guest logged in successfully"))
      .catch((err) => setError(err.message));
  };

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.appName}>Trippy</Text>
        <Text style={styles.tagline}>Addicted to Travelling</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <RoundedButton
          title="Log In"
          onPress={handleLogin}
          style={styles.loginButton}
          textStyle={styles.buttonText}
        />

        <RoundedButton
          title="Sign Up"
          onPress={handleSignUp}
          style={styles.signupButton}
          textStyle={styles.buttonText}
        />

        <TouchableOpacity onPress={handleGuestLogin} style={styles.guestLink}>
          <Text style={styles.guestText}>Sign in as Guest</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer text="© 2024 Trippy Holiday Planner" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 50,
    fontFamily: "Gabriola", 
    fontWeight: "bold",
    color: "#24565C", 
    textAlign: "center",
    marginVertical: 20,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "Gabriola", 
    color: "#24565C", 
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginVertical: 30,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#24565C",
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
  },
  signupButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFF",
  },
  guestLink: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  guestText: {
    color: "#24565C",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
