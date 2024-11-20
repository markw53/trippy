import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";
import TripCard from "../components/TripCard";

export default function HomeScreen({ navigation }) {
  const trips = [
    {
      id: "1",
      name: "Paris",
      imgUrl:
        "https://media.disneylandparis.com/d4th/en-usd/images/VDP10_2025apr03_world_paris-vedettes-de-paris-Couloir3-VDP10_16-9_tcm1861-251625.jpg",
    },
    {
      id: "2",
      name: "Hungary",
      imgUrl:
        "https://malaysianharmony.com.my/wp-content/uploads/2022/02/Hungary.jpg",
    },
    {
      id: "3",
      name: "Barcelona",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYkIEdnS0Ouk8ajir-ZQk3NrTHhpa_X9StZw&s",
    },
    {
      id: "4",
      name: "Greece",
      imgUrl:
        "https://static.independent.co.uk/s3fs-public/thumbnails/image/2021/06/02/20/istock-833264986.jpg",
    },
  ];

  const renderTrip = ({ item }) => (
    <TripCard
      tripId={item.id}
      tripName={item.name}
      tripImage={item.imgUrl}
      onPress={() =>
        navigation.navigate("Trip", { tripId: item.id, tripName: item.name })
      }
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <View style={styles.content}>
        <Text style={styles.text}>My trips</Text>
      </View>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id.toString()}
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
  button: {
    marginTop: 50,
    marginBottom: 100,
    paddingHorizontal: 80,
    marginHorizontal: "auto",
  },
});
