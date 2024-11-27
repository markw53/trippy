import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { GOOGLE_PLACES_API_KEY } from "@env";
import Header from "../components/Header";
import Button from "../components/Button";
import { createTrip } from "../api";
import { useAuth } from "../../AuthContext";

const API = GOOGLE_PLACES_API_KEY;

export default function TripCreationScreen({ navigation }) {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [description, setDescription] = useState("");
  const [tripImageUrl, setTripImageUrl] = useState("");
  const { user } = useAuth();

  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            key: API,
          },
        }
      );
      setSuggestions(response.data.predictions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelectSuggestion = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: API,
          },
        }
      );
      const { location } = response.data.result.geometry;
      setSelectedLocation({
        latitude: location.lat,
        longitude: location.lng,
      });
      setDestination(response.data.result.name);
      setSuggestions([]);
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  const handleSubmit = () => {
    if (!tripImageUrl) {
      setTripImageUrl("https://default-trip-image.com");
    }

    if (!user || !user.userId) {
      alert("User not authenticated.");
      return;
    }

    if (!tripName || !destination || !description) {
      alert("Please fill out all fields.");
      return;
    }

    const tripData = {
      trip_name: tripName,
      location: {
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
      },
      description: description || "No description provided",
      start_date: startDate.toISOString(),
      end_date: endDate ? endDate.toISOString() : null,
      created_by: user?.userId,
      trip_img_url: tripImageUrl || "https://default-trip-image.com",
    };

    createTrip(tripData)
      .then((response) => {
        console.log(tripData);
        alert("Trip created successfully!");
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error(
          "Error creating trip:",
          error.response?.data || error.message
        );
        alert(
          `Failed to create trip: ${
            error.response?.data?.msg || "Unknown error"
          }`
        );
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Trippy" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Trip Name</Text>
        <TextInput
          style={styles.input}
          value={tripName}
          onChangeText={setTripName}
          placeholder="Enter trip name"
        />

        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          value={destination}
          onChangeText={(text) => {
            setDestination(text);
            fetchSuggestions(text);
          }}
          placeholder="Search for a destination"
        />
        {suggestions.length > 0 && (
          <View style={styles.suggestions}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.place_id}
                onPress={() => handleSelectSuggestion(suggestion.place_id)}
              >
                <Text style={styles.suggestionText}>
                  {suggestion.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Image</Text>
        <TextInput
          style={styles.input}
          value={tripImageUrl}
          onChangeText={setTripImageUrl}
          placeholder="Enter image url"
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.label}>Start Date</Text>
            {/* <Text style={styles.dateText}>{startDate.toDateString()}</Text> */}
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.label}>End Date</Text>
            {/* <Text style={styles.dateText}>{endDate.toDateString()}</Text> */}
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter trip description"
          multiline
        />

        {selectedLocation && (
          <MapView
            style={styles.map}
            initialRegion={{
              ...selectedLocation,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker coordinate={selectedLocation} />
          </MapView>
        )}

        <Button title="Done" onPress={handleSubmit} style={styles.button} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    color: "#24565C",
    marginVertical: 8,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  suggestions: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
  },
  suggestionText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dateButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    alignSelf: "center",
    paddingHorizontal: 40,
    marginBottom: 30,
    marginTop: 30,
  },
  map: {
    height: 200,
    marginVertical: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
