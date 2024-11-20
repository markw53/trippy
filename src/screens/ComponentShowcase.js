import React from "react";
import Button from "../components/Button";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import Card from "../components/Card";
import Footer from "../components/Footer";
import TripCard from "../components/TripCard";
import { FlatList } from "react-native";

const ComponentShowcase = () => {
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
      tripName={item.name}
      tripImage={item.imgUrl}
      onPress={() => console.log(`TripCard pressed: ${item.name}`)}
    />
  );

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

        {/* TripCard Component */}
        <View>
          <Text style={styles.title}>TripCard Component</Text>

          <FlatList
            data={trips}
            renderItem={renderTrip}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.cardsContainer}
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
  footer: {
    margin: 0,
  },
});

export default ComponentShowcase;
