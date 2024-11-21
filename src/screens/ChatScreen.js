import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import io from "socket.io-client";
import Header from "../components/Header";
import axios from "axios";


const socket = io("https://backend-for-trippy.onrender.com");

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userId = 1;
  const user_id = 2;
  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = { text: message, timestamp: new Date().toISOString() };
      socket.emit("message", chatMessage); 
      setMessages((prevMessages) => [...prevMessages, chatMessage]); 
      setMessage(""); 
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Chat" />
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.message}>
          <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{item.user_name}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
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
  messagesContainer: {
    padding: 10,
  },
  message: {
    backgroundColor: "#E8F5F2",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#24565C",
  },
  timestamp: {
    fontSize: 12,
    color: "#7D8A8B",
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#CCD6D5",
    backgroundColor: "#F7F7F7",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCD6D5",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#24565C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
