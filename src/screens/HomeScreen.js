import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";
import TripCard from "../components/TripCard";
import { fetchTripById, fetchTrips, fetchUserTrips } from "../api";

export default function HomeScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const userId = 3;

  useEffect(() => {
    fetchUserTrips(userId)
      .then((response) => {
        const tripsIds = response.data.trips.map((trip) => trip.trip_id);

        const tripDetailPromises = tripsIds.map((id) =>
          fetchTripById(id)
        );
        return Promise.all(tripDetailPromises);
      })
      .then((detailedTrips) => {
        const tripData = detailedTrips.map((response) => response.data.trip)
        setTrips(tripData);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [userId]);

  const renderTrip = ({ item }) => (
    <TripCard
      tripId={item.trip_id}
      tripName={item.trip_name}
      tripImage={item.trip_img_url}
      onPress={() =>
        navigation.navigate("Trip", { tripId: item.id, tripName: item.name })
      }
    />
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading trips...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{isError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <View style={styles.content}>
        <Text style={styles.text}>My trips</Text>
      </View>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.trip_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.cardsContainer}
        scrollEnabled={false}
      />
      <View>
        <Button title="Add trip" style={styles.button} />
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
  cardsContainer: {
    padding: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontSize: 16,
    color: "red",
  },
  button: {
    marginTop: 50,
    marginBottom: 100,
    paddingHorizontal: 80,
    marginHorizontal: "auto",
  },
});
