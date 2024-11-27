import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  fetchTripById,
  patchTripDetails,
  fetchTripMembers,
  getUserIdByEmail,
  postTripMembers,
} from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";

export default function AddMembersScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tripId } = route.params;

  const [tripName, setTripName] = useState("");
  const [tripPic, setTripPic] = useState("");
  const [tripDescription, setTripDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [originalTripName, setOriginalTripName] = useState("");
  const [originalTripPic, setOriginalTripPic] = useState("");
  const [originalTripDescription, setOriginalTripDescription] = useState("");

  const [members, setMembers] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const isFormValid = tripName.trim() !== "" && tripPic.trim() !== "";

  const handleSubmit = () => {
    const updateTrip = {
      trip_id: tripId,
      trip_name: tripName,
      trip_img_url: tripPic,
      description: tripDescription,
    };
    patchTripDetails(updateTrip)
      .then((response) => {
        const updatedTrip = response.data.trip;

        setOriginalTripName(updatedTrip.trip_name || tripName);
        setOriginalTripPic(updatedTrip.trip_img_url || tripPic);
        setOriginalTripDescription(updateTrip.description || tripDescription);

        alert("Trip details updated successfully!");
      })
      .catch((error) => {
        alert("Failed to update trip details. Please try again.");
        console.error("Error in patching trip details:", error);
      });
  };

  const handleCancel = () => {
    // Revert to original values
    setTripName(originalTripName);
    setTripPic(originalTripPic);
    setOriginalTripDescription(originalTripDescription);
  };

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
  }, [members]);

  const renderMembers = ({ item }) => <Card title={item.name} />;

  const addMember = () => {
    getUserIdByEmail(userEmail).then((response) => {
      const userId = response.data.userId.user_id;
      const newMember = {
        user_id: userId,
      };
      postTripMembers(tripId, newMember).catch((err) => {
        console.log("Error adding member:", err);
      });
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <View style={styles.content}>
        <ScrollView>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: "#24565C", fontSize: 16 }}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.text}>Trip Settings</Text>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri:
                  originalTripPic ||
                  "https://reactnative.dev/img/tiny_logo.png",
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
          <View>
            <Text style={styles.textCurrentMembers}>Current Members</Text>

            <FlatList
              data={members}
              renderItem={renderMembers}
              keyExtractor={(item) => item.name.toString()}
              contentContainerStyle={styles.cardsContainer}
              //   scrollEnabled={false}
            />
          </View>
          <View>
            <Text style={styles.textAddMembers}>Add Member</Text>
            <Text style={styles.label}>Members Email:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUserEmail}
              numberOfLines={1}
              multiline={false}
              textAlignVertical="center"
              autoCapitalize="none"
              value={userEmail}
            />
            <View style={styles.addMemberbtn}>
              <Button
                title="Add Member"
                style={styles.button}
                onPress={addMember}
              />
            </View>
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
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 10,
  },
  userNameheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  addMemberbtn: {
    padding: 10,
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
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmationbtnsContainer: {
    marginTop: 50,
    color: "#fff",
  },
  tripNameheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  textCurrentMembers: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    color: "#24565C",
    fontWeight: "bold",
    textAlign: "center",
  },
  textAddMembers: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 20,
    color: "#24565C",
    fontWeight: "bold",
    textAlign: "center",
  },
  tripDescription: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },
  cardsContainer: {
    paddingVertical: 0,
  },
});
