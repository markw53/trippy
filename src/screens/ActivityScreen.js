import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import {
  activityVote,
  deleteActivity,
  getActivity,
  moveToItinerary,
} from "../api";
import Card from "../components/Card";
import Button from "../components/Button";

const ActivityScreen = ({ route }) => {
  const { activityId, tripId, navigation } = route.params;
  const [activityName, setActivityName] = useState("");
  const [time, setTime] = useState("");
  const [votes, setVotes] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [inItinerary, setInItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getActivity(tripId, activityId).then((response) => {
      const activityData = response.data.activity;
      setActivityName(activityData.activity_name);
      setTime(activityData.time);
      setVotes(activityData.votes);
      setDescription(activityData.description);
      setImage(activityData.activity_img_url);
      setDate(activityData.date);
      setInItinerary(activityData.in_itinerary);
      setIsLoading(false);
    });
  }, [tripId, activityId]);

  const handleVote = () => {
    setVotes((currVotes) => currVotes + 1);
    activityVote(tripId, activityId, votes).catch((err) => {
      console.log("Error with voting", err);
      setVotes((currVotes) => currVotes - 1);
    });
  };

  const handleDelete = () => {
    deleteActivity(tripId, activityId)
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => {
        console.log("Error deleting activity:", err);
      });
  };

  const handleMove = () => {
    moveToItinerary(tripId, activityId)
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => {
        console.log("Error with moving to itinerary:", err);
      });
  };

  const isoDate = date;

  const dateObj = new Date(isoDate);

  const readableDate = dateObj.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <Button
        title="<"
        onPress={() => navigation.goBack()}
        style={[styles.button, styles.back]}
      />
      <Card
        title={activityName}
        time={time}
        votes={votes}
        content={description}
        image={image}
        date={readableDate}
      />
      <Button title="Vote" onPress={handleVote} style={styles.button} />
      <Button title="Delete" onPress={handleDelete} style={styles.button} />
      {!inItinerary && (
        <Button
          title="Add to Itinerary"
          onPress={handleMove}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  cardsContainer: {
    padding: 16,
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
  button: {
    marginTop: 10,
    paddingHorizontal: 40,
    marginHorizontal: "auto",
  },
  back: {
    alignSelf: "flex-start",
    marginLeft: 10,
  },
});

export default ActivityScreen;
