import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TripCard = ({ tripName, tripImage, onPress }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image
        source={
          tripImage ? { uri: tripImage } : require("../assets/placeholder.png")
        }
        style={styles.image}
      />
      <Text style={styles.name}>{tripName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#24565C",
    textAlign: "center",
  },
});

export default TripCard;
