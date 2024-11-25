import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { useAuth } from "../../AuthContext";

export default function HomeScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user?.userId && isLoading) {
      setIsLoading(true);
      fetchUserTrips(user.userId)
        .then((response) => {
          const tripsIds = response.data.trips.map((trip) => trip.trip_id);

          const tripDetailPromises = tripsIds.map((id) => fetchTripById(id));
          return Promise.all(tripDetailPromises);
        })
        .then((detailedTrips) => {
          const tripData = detailedTrips.map((response) => response.data.trip);
          setTrips(tripData);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsError("Failed to fetch trips.");
          setIsLoading(false);
        });
    } else if (!isLoading && !user?.userId) {
      setIsError("User not authenticated.");
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (
        navigation.getState()?.routes?.some((route) => route.params?.newTrip)
      ) {
        const newTrip = navigation
          .getState()
          .routes.find((route) => route.params?.newTrip).params.newTrip;

        setTrips((prevTrips) => [newTrip, ...prevTrips]);

        navigation.setParams({ newTrip: null });
      }
    }, [navigation])
  );

  const handleCreateTrip = () => {
    navigation.navigate("TripCreationScreen");
  };

  const renderTrip = ({ item }) => (
    <TripCard
      tripId={item.trip_id}
      tripName={item.trip_name}
      tripImage={item.trip_img_url}
      onPress={() =>
        navigation.navigate("Trip", {
          tripId: item.trip_id,
          tripName: item.trip_name,
          navigation: navigation,
        })
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
        <Button
          title="Add trip"
          style={styles.button}
          onPress={handleCreateTrip}
        />
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
