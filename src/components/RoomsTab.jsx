import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

export default function RoomsTab({ setActiveRoom }) {
  const [rooms, setRooms] = useState([]);
  const userId = 1;
  const user_id = 2;
  useEffect(() => {
    axios
      .get(`https://backend-for-trippy.onrender.com/api/users/${user_id}/trips`) 
      .then((response) => {
        setRooms(response.data.trips); 
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rooms</Text>
      <FlatList
        data={rooms}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.roomButton}
            onPress={() => setActiveRoom(item.room_id)} 
          >
            <Text style={styles.roomName}>{item.room_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F0F0F0",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  roomButton: {
    padding: 10,
    backgroundColor: "#E8E8E8",
    marginVertical: 5,
    borderRadius: 5,
  },
  roomName: {
    fontSize: 16,
  },
});
