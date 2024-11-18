import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import RoundedButton from "./src/components/Button";
import Header from "./src/components/Header";
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

  const handleGuestLogin = () => {
    const guestEmail = "guest@example.com";
    const guestPassword = "trippy";
    signInWithEmailAndPassword(auth, guestEmail, guestPassword)
      .then(() => console.log("Guest logged in successfully"))
      .catch((err) => setError(err.message));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Trippy" />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        {/* Buttons */}
        <RoundedButton
          title="Log In"
          onPress={handleLogin}
          style={styles.loginButton}
          textStyle={styles.buttonText}
        />

        {/* Guest Login */}
        <TouchableOpacity onPress={handleGuestLogin} style={styles.guestLink}>
          <Text style={styles.guestText}>Sign in as Guest</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <Footer text="© 2024 Trippy Holiday Planner" style={styles.footer} />
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
    marginVertical: 20,
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
  footer: {
    marginTop: 20,
    alignSelf: "stretch", // Ensures the footer spans the full width
  },
});