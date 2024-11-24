import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { GOOGLE_PLACES_API_KEY } from "@env";
import Header from "../components/Header";
import { createTrip } from "../api";

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

  const handleSubmit = async () => {
    if (!tripName || !destination || !description) {
      alert("Please fill out all fields.");
      return;
    }
    
    const tripData = {
      trip_name: tripName,
      location: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
      description: description || "No description provided",
      start_date: startDate.toISOString(),
      end_date: endDate ? endDate.toISOString() : null,
      created_by: user?.userId,
      trip_img_url: tripImageUrl || "https://default-trip-image.com",
    };
    
    createTrip(tripData)
      .then((response) => {
        alert("Trip created successfully!");
        navigation.navigate("HomeScreen", { newTrip: response.data.trip });
      })
      .catch((error) => {
        console.error("Error creating trip:", error.response?.data || error.message);
        alert(`Failed to create trip: ${error.response?.data?.msg || "Unknown error"}`);
      });
  
  return (
    <View style={styles.screen}>
      <Header title="Create Trip" /> {/* Add the header */}

      <ScrollView contentContainerStyle={styles.container}>
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

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateText}>
            {startDate.toDateString()}
          </Text>
        </TouchableOpacity>
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

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateText}>
            {endDate.toDateString()}
          </Text>
        </TouchableOpacity>
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

        <Button title="Create Trip" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
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
  dateText: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
  },
  map: {
    height: 200,
    marginVertical: 16,
  },
});
