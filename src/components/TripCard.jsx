import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { useNavigation } from "@react-navigation/native";

const TripCard = ({ tripName, tripImage, onPress }) => {
  // const navigation = useNavigation();
  const [cardWidth, setCardWidth] = useState(0);

  // Calculate the height dynamically based on the card's width
  const imageHeight = cardWidth * 0.66; // Adjust the ratio as per your design

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
    >
      <Image
        source={
          tripImage ? { uri: tripImage } : require("../assets/placeholder.png")
        }
        style={[styles.image, { height: imageHeight, width: cardWidth }]}
      />
      <Text style={styles.name}>{tripName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    // padding: 16,
    paddingBottom: 8,
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
    // width: 150,
    // height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
    // paddingHorizontal: 20
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#24565C",
    textAlign: "center",
  },
});

export default TripCard;
