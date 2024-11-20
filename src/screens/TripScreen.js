import React from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";
import Button from "../components/Button";
import Header from "../components/Header";
import Card from "../components/Card";

const handleItinerary = () => {
  console.log("pressed itinerary");
};

const handlePossibility = () => {
  console.log("pressed possibility");
};

const TripScreen = ({ route }) => {
  const { tripId, tripName } = route.params
  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <View style={styles.section}>
        <Text style={styles.title}>Location</Text>
        <Text>Start_Date --- End_Date</Text>
        <View style={styles.image}>
          <Text>17C</Text>
          <Image
            source={{
              uri:
                "https://i.pinimg.com/736x/f1/83/cc/f183ccd0f8be3477c28d4104dc836a97.jpg",
              width: 50,
              height: 50,
              alignItems: "right"
            }}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.tabs}>
          <Text>
            <Button
              title="Itinerary"
              onPress={handleItinerary}
              style={styles.button}
            />
            <Button
              title="Possibility"
              onPress={handlePossibility}
              style={styles.button}
            />
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.date}>Start_Date</Text>
          <Card title="Landing" time="15:00" style={{ marginHorizontal: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7"
  },
  scrollContainer: {
    padding: 0,
    flexGrow: 1
  },
  section: {
    marginTop: 40,
    marginBottom: 24
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8
  },
  button: {
    paddingHorizontal: 40,
    marginHorizontal: "auto"
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center"
  },
  image: {
    alignSelf: "flex-end",
    marginRight: 20
  },
  tabs: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  footer: {
    margin: 0
  }
});

export default TripScreen;
