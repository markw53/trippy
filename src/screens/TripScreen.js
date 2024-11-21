import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import Button from "../components/Button";
import Header from "../components/Header";
import Card from "../components/Card";

const TripScreen = ({ route }) => {
  const { tripId, tripName, tripStart, tripEnd } = route.params;
  const [isItinerary, setIsItinerary] = useState(true);
  const [isPossibility, setIsPossibility] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  const handleItinerary = () => {
    setIsPossibility(false);
    setIsEvent(false);
    setIsItinerary(true);
  };

  const handlePossibility = () => {
    setIsItinerary(false);
    setIsEvent(false);
    setIsPossibility(true);
  };

  const handleEvent = () => {
    setIsEvent(true);
  };

  const handlePostItinerary = () => {
    console.log("Itinerary Item Posted!");
    setTitle("");
    setTime("");
    setIsEvent(false);
  };

  const handlePostPossibility = () => {
    console.log("Possibility Item Posted!");
    setTitle("");
    setDescription("");
    setTime("");
    setIsEvent(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <View style={styles.section}>
        <Text style={styles.title}>{tripName}</Text>
        <Text>
          {tripStart} --- {tripEnd}
        </Text>
        <View style={styles.image}>
          <Text>17C</Text>
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/f1/83/cc/f183ccd0f8be3477c28d4104dc836a97.jpg",
              width: 50,
              height: 50,
              alignItems: "right",
            }}
          />
        </View>
      </View>
      <View style={styles.tabs}>
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
      </View>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.section}>
          {isItinerary && !isEvent && (
            <Text style={styles.date}>{tripStart}</Text>
          )}
          {isItinerary && !isEvent && (
            <Card
              title="Landing"
              time="15:00"
              style={{ marginHorizontal: 30 }}
            />
          )}
          {isPossibility && !isEvent && (
            <Text style={styles.date}>{tripStart}</Text>
          )}
          {isPossibility && !isEvent && (
            <Card
              title="Nightclub"
              time="19:30"
              content="Going to party!"
              style={{ marginHorizontal: 30 }}
            />
          )}
        </View>
        <View>
          {isEvent && (
            <TextInput
              placeholder="Title"
              value={title}
              onChange={setTitle}
              style={styles.input}
              placeholderTextColor="#888"
            />
          )}
          {isEvent && (
            <TextInput
              placeholder="Time"
              value={time}
              onChange={setTime}
              style={styles.input}
              placeholderTextColor="#888"
            />
          )}
          {isEvent && isPossibility && (
            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder="Description"
              value={description}
              onChange={setDescription}
              style={styles.input}
              placeholderTextColor="#888"
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.section}>
        {!isEvent && (
          <Button
            title={"Add Event"}
            onPress={handleEvent}
            style={styles.button}
          />
        )}
        {isEvent && isItinerary && (
          <Button
            title="Post"
            onPress={handlePostItinerary}
            style={styles.button}
          />
        )}
        {isEvent && isPossibility && (
          <Button
            title="Post"
            onPress={handlePostPossibility}
            style={styles.button}
          />
        )}
      </View>
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
    marginTop: 40,
    marginBottom: 24,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    paddingHorizontal: 40,
    marginHorizontal: "auto",
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  image: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  tabs: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  footer: {
    margin: 0,
  },
});

export default TripScreen;
