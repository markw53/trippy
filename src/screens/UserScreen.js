import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";
import { fetchUserDetails, patchUserDetails } from "../api";
import { useAuth } from "../../AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";

export default function UserScreen() {
  const { user, loading: authLoading } = useAuth();
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [email, setEmail] = useState("");
  const [originalUserName, setOriginalUserName] = useState("");
  const [originalProfilePic, setOriginalProfilePic] = useState("");
  const [loading, setLoading] = useState(true);
  

  const userId = 7;

  const isFormValid = userName.trim() !== "" && profilePic.trim() !== "";

  const handleSubmit = () => {
    const updateUser = {
      user_id: user.userId,
      name: userName,
      avatar_url: profilePic,
    };

    patchUserDetails(updateUser)
      .then((response) => {
        const updatedUser = response.data.user;

        setOriginalUserName(updatedUser.name || userName);
        setOriginalProfilePic(updatedUser.avatar_url || profilePic);

        alert("User details updated successfully!");
      })
      .catch((err) => {
        alert("Failed to update user details. Please try again.");
        console.error("Error in patching user details:", err);
      });
  };

  const handleCancel = () => {
    setUserName(originalUserName);
    setProfilePic(originalProfilePic);
  };

  useEffect(() => {
    fetchUserDetails(user.userId)
      .then((response) => {
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
  }, [authLoading, user]);

  if (loading || authLoading) {
    return (
      <LoadingIndicator />
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
              style={styles.image}
              source={{
                uri: originalProfilePic || "https://reactnative.dev/img/tiny_logo.png",
              }}
              onError={(e) => {
                console.error("Image failed to load:", e.nativeEvent.error);
                if (!originalProfilePic) {
                  setProfilePic("https://reactnative.dev/img/tiny_logo.png");
                }
              }}
            />
            <Text style={styles.userNameheading}>{ originalUserName}</Text>
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
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isFormValid}
              style={[
                styles.button,
                !isFormValid && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
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
  button: {
    backgroundColor: "#24565C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
