import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header title="Trippy - Home" />
      <View style={styles.content}>
        <Text style={styles.text}>Welcome to the Home Screen!</Text>
      </View>
      <Footer text="© 2024 Trippy Holiday Planner" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    color: "#24565C",
    fontWeight: "bold",
  },
});
