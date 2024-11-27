import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  activityVote,
  deleteActivity,
  getActivity,
  moveToItinerary,
  moveToPossibility,
} from "../api";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import LoadingIndicator from "../components/LoadingIndicator";

const ActivityScreen = ({ route }) => {
  const navigation = useNavigation();
  const { activityId, tripId, isRefresh } = route.params;
  const [activityName, setActivityName] = useState("");
  const [time, setTime] = useState("");
  const [votes, setVotes] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [inItinerary, setInItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Refresh"
          onPress={() => {
            // Trigger the refresh logic here, if needed
            // Example: trigger a state update in the parent component
          }}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.getItem("votedActivities")
      .then((votedActivities) => {
        if (votedActivities) {
          const votedSet = JSON.parse(votedActivities);
          setHasVoted(votedSet.includes(activityId));
        }
      })
      .catch((err) => {
        console.log("Error reading voting status:", err);
      });
  }, [activityId]);

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
  }, [tripId, activityId, isRefresh]);

  const handleVote = () => {
    if (hasVoted) {
      setVotes((currVotes) => currVotes - 1);

      activityVote(tripId, activityId, votes - 1)
        .then(() => {
          AsyncStorage.getItem("votedActivities")
            .then((votedActivities) => {
              const votedSet = votedActivities
                ? JSON.parse(votedActivities)
                : [];
              const updatedSet = votedSet.filter((id) => id !== activityId);
              return AsyncStorage.setItem(
                "votedActivities",
                JSON.stringify(updatedSet)
              );
            })
            .then(() => {
              setHasVoted(false);
              setIsRefresh(!isRefresh);
            })
            .catch((err) => {
              console.log("Error updating vote storage:", err);
            });
        })
        .catch((err) => {
          console.log("Error with removing vote:", err);
          setVotes((currVotes) => currVotes + 1);
        });
    } else {
      setVotes((currVotes) => currVotes + 1);

      activityVote(tripId, activityId, votes + 1)
        .then(() => {
          AsyncStorage.getItem("votedActivities")
            .then((votedActivities) => {
              const votedSet = votedActivities
                ? JSON.parse(votedActivities)
                : [];
              votedSet.push(activityId);
              return AsyncStorage.setItem(
                "votedActivities",
                JSON.stringify(votedSet)
              );
            })
            .then(() => {
              setHasVoted(true);
              setIsRefresh(!isRefresh);
            })
            .catch((err) => {
              console.log("Error updating vote storage:", err);
            });
        })
        .catch((err) => {
          console.log("Error with voting:", err);
          setVotes((currVotes) => currVotes - 1);
        });
    }
  };

  const handlePrompt = () => {
    setIsDelete(true);
  };

  const handleDelete = () => {
    deleteActivity(tripId, activityId)
      .then(() => {
        setIsRefresh(!isRefresh);
        navigation.goBack();
      })
      .catch((err) => {
        console.log("Error deleting activity:", err);
      });
  };

  const handleMoveToItin = () => {
    moveToItinerary(tripId, activityId)
      .then(() => {
        setIsRefresh(!isRefresh);
        navigation.goBack();
      })
      .catch((err) => {
        console.log("Error with moving to itinerary:", err);
      });
  };

  const handleMoveToPossib = () => {
    moveToPossibility(tripId, activityId)
      .then(() => {
        setIsRefresh(!isRefresh);
        navigation.goBack();
      })
      .catch((err) => {
        console.log("Error with moving to possibility:", err);
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

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <BackButton
        title="Back"
        onPress={() => navigation.goBack()}
        style={[styles.button, styles.back]}
      />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Card
          title={activityName}
          time={time}
          votes={votes}
          content={description}
          image={image}
          date={readableDate}
        />
      )}
      <Button
        title={hasVoted ? "Remove Vote" : "Vote"}
        onPress={handleVote}
        style={styles.button}
        disabled={hasVoted}
      />
      {!isDelete && (
        <Button title="Delete" onPress={handlePrompt} style={styles.button} />
      )}
      {isDelete && (
        <Button
          title="Are you sure?"
          onPress={handleDelete}
          style={styles.button}
        />
      )}
      {!inItinerary && (
        <Button
          title="Add to Itinerary"
          onPress={handleMoveToItin}
          style={styles.button}
        />
      )}
      {inItinerary && (
        <Button
          title="Return to Possibility"
          onPress={handleMoveToPossib}
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
    marginLeft: 0,
    marginBottom: 10,
    marginTop: 15,
  },
});

export default ActivityScreen;
