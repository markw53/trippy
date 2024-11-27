import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  fetchTripById,
  patchTripDetails,
  fetchTripMembers,
  getUserIdByEmail,
  postTripMembers,
  deleteTripById,
} from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";
import BackButton from "../components/BackButton";
import LoadingIndicator from "../components/LoadingIndicator";

export default function AddMembersScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tripId } = route.params;

  // State Variables
  const [tripName, setTripName] = useState("");
  const [tripPic, setTripPic] = useState("");
  const [tripDescription, setTripDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [originalTripName, setOriginalTripName] = useState("");
  const [originalTripPic, setOriginalTripPic] = useState("");
  const [originalTripDescription, setOriginalTripDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  // Validity Check for Trip Form
  const isFormValid = tripName.trim() !== "" && tripPic.trim() !== "";

  // Fetch Trip Details and Members
  useEffect(() => {
    fetchTripById(tripId)
      .then((response) => {
        const data = response.data.trip;
        setTripName(data.trip_name || "");
        setTripPic(data.trip_img_url || "");
        setTripDescription(data.description || "");
        setOriginalTripName(data.trip_name || "");
        setOriginalTripPic(data.trip_img_url || "");
        setOriginalTripDescription(data.description || "");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trip details:", error);
        setIsError(true);
        setIsLoading(false);
      });

    fetchTripMembers(tripId)
      .then((response) => {
        const data = response.data.members;
        setMembers(data);
      })
      .catch((error) => {
        console.error("Error fetching member details:", error);
        setIsError(true);
        setIsLoading(false);
      });
  }, [tripId]);

  // Render Members in List
  const renderMembers = ({ item }) => <Card title={item.name} />;

  // Validate Email
  const isValidEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  // Handle Adding Member
  const addMember = () => {
    if (!isValidEmail(userEmail)) {
      alert("Please enter a valid email.");
      return;
    }

    getUserIdByEmail(userEmail)
      .then((response) => {
        const userId = response.data.userId.user_id;
        const newMember = {
          user_id: userId,
        };
        postTripMembers(tripId, newMember)
          .then(() => {
            alert("Member added successfully!");
            setUserEmail(""); // Clear email input after adding member
          })
          .catch((err) => {
            console.log("Error adding member:", err);
            alert("Failed to add member.");
          });
      })
      .catch((err) => {
        console.log("Error fetching user ID:", err);
        alert("Invalid email address.");
      });
  };

  // Handle Trip Deletion
  const handlePrompt = () => {
    setIsDelete(true);
  };

  const handleDelete = () => {
    deleteTripById(tripId)
      .then(() => {
        alert("Trip deleted successfully!");
        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log("Error deleting trip:", err);
      });
  };

  // Loading State
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Handle Saving Changes (Trip Details)
  const handleSubmit = () => {
    const updatedTripDetails = {
      trip_name: tripName,
      trip_img_url: tripPic,
      description: tripDescription,
    };

    patchTripDetails(tripId, updatedTripDetails)
      .then(() => {
        alert("Trip details updated successfully!");
        navigation.goBack();
      })
      .catch((err) => {
        console.log("Error updating trip details:", err);
        alert("Failed to update trip details.");
      });
  };

  // Handle Cancel
  const handleCancel = () => {
    setTripName(originalTripName);
    setTripPic(originalTripPic);
    setTripDescription(originalTripDescription);
  };

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#24565C", fontSize: 16 }}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Trip Settings</Text>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: originalTripPic || "https://reactnative.dev/img/tiny_logo.png",
            }}
            onError={(e) => {
              console.error("Image failed to load:", e.nativeEvent.error);
              if (!originalTripPic) {
                setTripPic("https://reactnative.dev/img/tiny_logo.png");
              }
            }}
          />
          <Text style={styles.tripNameheading}>{originalTripName}</Text>
        </View>

        <View>
          <Text style={styles.label}>Trip Name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTripName}
            value={tripName}
            numberOfLines={1}
            multiline={false}
            textAlignVertical="center"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text style={styles.label}>Trip Picture:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTripPic}
            value={tripPic}
            numberOfLines={1}
            multiline={false}
            textAlignVertical="center"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text style={styles.label}>Trip Description:</Text>
          <TextInput
            style={[styles.input, styles.tripDescription]}
            onChangeText={setTripDescription}
            value={tripDescription}
            numberOfLines={5}
            scrollEnabled={true}
            multiline={true}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.textCurrentMembers}>Current Members</Text>
        <FlatList
          data={members || []}
          renderItem={({ item }) => {
            const id = item.id ? item.id.toString() : '';

            return (
              <View>
                <Text>{id}</Text>
                <Text>{item.name}</Text>
              </View>
          );
        }}
          keyExtractor={(item) => item.id ? item.id.toString() : ''}
          
        />

        <Text style={styles.textAddMembers}>Add Member</Text>
        <Text style={styles.label}>Member's Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUserEmail}
          value={userEmail}
          numberOfLines={1}
          multiline={false}
          textAlignVertical="center"
          autoCapitalize="none"
        />
        <View style={styles.addMemberbtn}>
          <Button title="Add Member" onPress={addMember} />
        </View>

        <View style={styles.confirmationbtnsContainer}>
          <View style={styles.saveChangesbtn}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isFormValid}
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cancelbtn}>
            <Button title="Cancel" onPress={handleCancel} />
          </View>

          <View style={styles.deletebtn}>
            {!isDelete && <Button title="Delete" onPress={handlePrompt} />}
            {isDelete && (
              <Button
                title="Are you sure?"
                onPress={handleDelete}
                style={styles.deletebtnColour}
              />
            )}
          </View>
        </View>
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
    textAlign: "center",
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
    width: "100%",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  tripNameheading: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  tripDescription: {
    height: 120,
  },
  textCurrentMembers: {
    fontSize: 18,
    marginVertical: 10,
    color: "#333",
  },
  cardsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  textAddMembers: {
    fontSize: 16,
    marginVertical: 10,
    color: "#333",
  },
  addMemberbtn: {
    marginBottom: 20,
  },
  confirmationbtnsContainer: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  saveChangesbtn: {
    marginBottom: 10,
  },
  cancelbtn: {
    marginBottom: 10,
  },
  deletebtn: {
    marginBottom: 10,
  },
  deletebtnColour: {
    backgroundColor: "#ff4f4f",
  },
  button: {
    backgroundColor: "#24565C",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
