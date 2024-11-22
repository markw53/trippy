import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Image, ScrollView } from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";
import { fetchUserDetails } from "../api";

export default function UserScreen() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchUserDetails(6)
      .then((response) => {
        console.log("API Response:", response.data);

        const data = response.data.user;

        setUserName(data.name || "");
        setProfilePic(data.avatar_url || "");
        setEmail(data.email || "");

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    );
  }

  const handleSubmit = () => { }

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.text}>Welcome to your Profile!</Text>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: profilePic || "https://reactnative.dev/img/tiny_logo.png",
              }}
            />
            <Text style={styles.userNameheading}>{userName || "The Goat Coder"}</Text>
          </View>
          <View>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUserName}
              value={userName}
            />
          </View>
          <View>
            <Text style={styles.label}>Profile Picture:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setProfilePic}
              value={profilePic}
              numberOfLines={1}
              multiline={false}
              textAlignVertical="center"
              autoCapitalize="none"

            />
          </View>
          <View>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
            />
          </View>
          <View style={styles.saveChangesbtn}>
            <Button title="Save Changes" />
          </View>
          <View style={styles.cancelbtn}>
            <Button title="Cancel" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  text: {
    fontSize: 24,
    color: "#24565C",
    fontWeight: "bold"
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: "#333"
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    fontSize: 16
  },
  imageContainer: {
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  userNameheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10
  },
  saveChangesbtn: {
    padding: 10
  },
  cancelbtn: {
    padding: 10
  },
  loadingText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#fffff",
  },
});
