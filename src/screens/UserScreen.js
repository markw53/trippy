import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import Image Picker
import Header from "../components/Header";
import Button from "../components/Button"
import { fetchUserDetails, patchUserDetails } from "../api";
import axios from "axios";
// import { apiBase } from "../api";
export const apiBase = "https://backend-for-trippy.onrender.com/api";



export default function UserScreen() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [email, setEmail] = useState("");
  const [originalUserName, setOriginalUserName] = useState("");
  const [originalProfilePic, setOriginalProfilePic] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = 7;

  useEffect(() => {
    fetchUserDetails(userId)
      .then((response) => {
        console.log("Line 20: API Response:", response.data);

        const data = response.data.user;

        setUserName(data.name || "");
        setProfilePic(data.avatar_url || "");
        setEmail(data.email || "");

        setOriginalUserName(data.name || "");
        setOriginalProfilePic(data.avatar_url || "");

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = () => {
    const updateUser = {
      user_id: userId,
      name: userName,
      avatar_url: profilePic, // Ensure this matches the backend's expected format
    };

    console.log("Updating user with data:", updateUser); // Debugging payload

    patchUserDetails(updateUser)
      .then((response) => {
        alert("User details updated successfully!");
        console.log("Response from server:", response.data);
      })
      .catch((err) => {
        if (err.response) {
          console.error("Server responded with an error:", err.response.data);
          alert(`Error: ${err.response.data.message || "Bad Request"}`);
        } else {
          console.error("Error updating user details:", err.message);
        }
      });
  };


  const handleCancel = () => {
    setUserName(originalUserName);
    setProfilePic(originalProfilePic);
  };

  // Function to pick image from gallery
  const handleImagePicker = () => {
    // Request permission for media library access
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          alert("Permission to access gallery is required!");
          throw new Error("Permission not granted");
        }

        // Launch the image picker
        return ImagePicker.launchImageLibraryAsync({
          mediaType: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      })
      .then((result) => {
        if (result.cancelled) {
          throw new Error("Image selection cancelled");
        }

        const formData = new FormData();
        formData.append("file", {
          uri: result.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        });

        // Upload image to the server
        return axios.post(`${apiBase}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      })
      .then((response) => {
        setProfilePic(response.data.url); // Update profile picture URL
        alert("Image uploaded successfully!");
      })
      .catch((error) => {
        if (error.message === "Permission not granted" || error.message === "Image selection cancelled") {
          console.warn(error.message);
        } else {
          console.error("Image upload failed:", error);
          alert("Failed to upload image. Please try again.");
        }
      });
  };




  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.text}>Welcome to your Profile!</Text>
          <View style={styles.imageContainer}>
            <Image
              key={profilePic}
              style={styles.image}
              source={{
                uri: profilePic || "https://reactnative.dev/img/tiny_logo.png",
              }}
              onError={() => setProfilePic("https://reactnative.dev/img/tiny_logo.png")}
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
          {/* Profile Picture Picker */}
          <View>
            <Text style={styles.label}>Profile Picture:</Text>
            <Button title="Upload Photo" onPress={handleImagePicker} />
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
            <Button title="Save Changes" onPress={handleSubmit} />
          </View>
          <View style={styles.cancelbtn}>
            <Button title="Cancel" onPress={handleCancel} />
          </View>
        </ScrollView>
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
    padding: 20,
  },
  text: {
    marginBottom: 30,
    fontSize: 24,
    color: "#24565C",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userNameheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  saveChangesbtn: {
    padding: 10,
  },
  cancelbtn: {
    padding: 10,
  },
  loadingText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
});
