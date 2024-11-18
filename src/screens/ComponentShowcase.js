import React from "react";
import Button from "../components/Button";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import Card from "../components/Card";
import Footer from "../components/Footer";

const ComponentShowcase = () => {
  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header title="Trippy" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Button Component */}
        <View style={styles.section}>
          <Text style={styles.title}>Button Component</Text>
          <Button
            title="Primary Button"
            onPress={() => console.log("Button pressed")}
            style={{ paddingHorizontal: 40, marginHorizontal: "auto" }}
          />
        </View>

        {/* Card Component */}
        <View style={styles.section}>
          <Text style={styles.title}>Card Components</Text>
          <Card
            title="Card 1 Title"
            content="This is the content of card 1."
            style={{ marginHorizontal: 30 }}
          />
          <Card
            title="Card 2 Title"
            content="This is the content of card 2."
            style={{ marginHorizontal: 30 }}
          />
          <Card
            title="Card 3 Title"
            content="This is the content of card 3."
            style={{ marginHorizontal: 30 }}
          />
        </View>
      </ScrollView>
      {/* Footer Component */}
      <Text style={styles.title}>Footer Component</Text>
      <Footer text="Icons display here" style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    padding: 0,
    flexGrow: 1,
  },
  section: {
    marginTop: 70,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  footer: {
    margin: 0,
  },
});

export default ComponentShowcase;
