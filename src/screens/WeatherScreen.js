import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";

export default function WeatherScreen() {
  return (
    <View style={styles.container}>
      <Header title="Trippy - Weather" />
      <View style={styles.content}>
        <Text style={styles.text}>Weather Forecast Coming Soon!</Text>
      </View>
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
