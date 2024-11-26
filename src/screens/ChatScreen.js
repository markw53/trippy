import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { io } from "socket.io-client";
import {
  fetchUserTrips,
  fetchRoomMessages,
  postMessage,
  fetchUserName,
} from "../api";
import { useAuth } from "../../AuthContext";
import Header from "../components/Header";

export default function ChatScreen() {
  const { user, loading: authLoading } = useAuth(); 
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const newSocket = io("https://backend-for-trippy.onrender.com");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;

    setLoading(true);
    fetchUserTrips(user.userId)
      .then((res) => {
        const userRooms = res.data.trips.map((trip) => ({
          trip_id: trip.trip_id,
          trip_name: trip.trip_name,
        })); 
        setRooms(userRooms);
        setSelectedRoom(userRooms[0] || null); 
      })
      .catch((err) => console.error("Error fetching user trips:", err))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  
  useEffect(() => {
    if (selectedRoom) {
      setLoading(true);
      fetchRoomMessages(selectedRoom.trip_id)
        .then((res) => setMessages(res.data.messages))
        .catch((err) => console.error("Error fetching messages:", err))
        .finally(() => setLoading(false));
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (socket && selectedRoom) {
      socket.emit("joinRoom", selectedRoom.trip_id);

      socket.on("newMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, selectedRoom]);

  const handleSendMessage = () => {
    if (currentMessage.trim() && selectedRoom && user) {
      setPosting(true)
      fetchUserName(user.userId) 
        .then((userName) => {
          const messageData = {
            user_id: user.userId, 
            room_id: selectedRoom.trip_id,
            content: currentMessage.trim(),
          };

      socket.emit("sendMessage", messageData);

      
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          timestamp: new Date().toISOString(),
          user_name: userName,
        },
      ]);
      setCurrentMessage("");

      postMessage(selectedRoom.trip_id, messageData)
      .then(() => {
        setPosting(false)
      })
      .catch((err) =>
        console.error("Error posting message:", err)
      );
    }
  )}}

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.message,
        item.user_id === user?.userId && styles.ownMessage, 
        
      ]}
    >
      <Text style={styles.user}>{item.user_name}</Text>
      <Text>{item.content}</Text>
    </View>
  );
  

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.roomButton,
        item.trip_id === selectedRoom?.trip_id && styles.selectedRoomButton,
      ]}
      onPress={() => setSelectedRoom(item)}
    >
      <Text
      style={[
        item.trip_id === selectedRoom?.trip_id && styles.selectedRoomText, 
      ]}
    >
      {item.trip_name}
      </Text>
    </TouchableOpacity>
  );

  if (authLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Please log in to access the chat.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Chat" />
      <View style={styles.roomsContainer}>
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.trip_id.toString()}
          horizontal
        />
      </View>
      <View style={styles.messagesContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={currentMessage}
          onChangeText={setCurrentMessage}
          editable={!posting}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={posting} 
          style={[styles.sendButton, posting && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>
            {posting ? "Posting..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  roomsContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  roomButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginRight: 5,
  },
  selectedRoomButton: {
    backgroundColor: "#24565C",
  },
  selectedRoomText: { 
    color: "#fff",
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  ownMessage: {
    backgroundColor: "#cce5ff",
    alignSelf: "flex-end",
  },
  user: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#24565C",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
});
