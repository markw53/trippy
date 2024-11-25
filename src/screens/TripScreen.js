import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { fetchNearbyPlaces } from "../api"; // Update this to call your Google Places API if necessary
import ItineraryButton from "../components/ItineraryButtons";
import Header from "../components/Header";
import Card from "../components/Card";
import { fetchItinerary, fetchPossibility, postPossibility } from "../api";
import DateTimePicker from "@react-native-community/datetimepicker";

const TripScreen = ({ route }) => {
  const { tripId, tripName, navigation } = route.params;
  const [radius, setRadius] = useState(500);
  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState({ lat: 52.369358, lng: 4.889258 }); // Default location
  const [itinerary, setItinerary] = useState([]);
  const [possibility, setPossibility] = useState([]);
  const [isItinerary, setIsItinerary] = useState(true);
  const [isPossibility, setIsPossibility] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [activityImage, setActivityImage] = useState("");
  const [isShowPicker, setIsShowPicker] = useState(false);

  useEffect(() => {
    if (tripId) {
      fetchItinerary(tripId)
        .then((response) => {
          const itineraryList = response.data.activities;
          setItinerary(itineraryList);
        })
        .catch((err) => console.error("Error fetching itinerary:", err));

      fetchPossibility(tripId)
        .then((response) => {
          const possibilityList = response.data.activities;
          setPossibility(possibilityList);
        })
        .catch((err) => console.error("Error fetching possibilities:", err));
    }
  }, [tripId]);

  const showDatePicker = () => {
    setIsShowPicker(true);
  };

  const handleFetchPlaces = async () => {
    try {
      const request = {
        fields: ["displayName", "location", "businessStatus"],
        locationRestriction: {
          center: new google.maps.LatLng(location.lat, location.lng),
          radius: radius,
        },
        includedPrimaryTypes: ["restaurant"],
        maxResultCount: 5,
        rankPreference: google.maps.places.RankBy.POPULARITY,
        language: "en-GB",
        region: "gb",
      };
      // Assuming `Place` is already initialized in the environment
      //@ts-ignore
      const { places } = await Place.searchNearby(request);
      setPlaces(places);
    } catch (err) {
      console.error("Error fetching nearby places:", err);
    }
  };

  const handleItinerary = () => {
    setIsPossibility(false);
    setIsEvent(false);
    setIsItinerary(true);
  };

  const handlePossibility = () => {
    setIsItinerary(false);
    setIsEvent(false);
    setIsPossibility(true);
  };

  const handleEvent = () => {
    setIsItinerary(false);
    setIsPossibility(false);
    setIsEvent(true);
  };

  const handleTitleChange = (e) => setTitle(e.nativeEvent.text);
  const handleTimeChange = (e) => setTime(e.nativeEvent.text);
  const handleDescriptionChange = (e) => setDescription(e.nativeEvent.text);
  const handleActivityImageChange = (e) => setActivityImage(e.nativeEvent.text);

  const handleDate = ({ type }, selectedDate) => {
    setIsShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handlePostEvent = () => {
    const newEvent = {
      activity_name: title,
      description: description,
      date: date.toISOString(),
      time: time,
      activity_img_url: activityImage,
    };

    postPossibility(tripId, newEvent)
      .then(() => {
        alert("Event Created");
        setTitle("");
        setTime("");
        setDescription("");
        setDate(new Date());
        setActivityImage("");
        setIsEvent(false);
        setIsItinerary(true);
      })
      .catch((err) => console.log("Error posting activity:", err));
  };

  const renderActivity = (activity) => {
    const isoDate = activity.item.date;
    const readableDate = new Date(isoDate).toLocaleDateString("en-GB", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return (
      <Card
        title={activity.item.activity_name}
        time={activity.item.time}
        votes={activity.item.votes}
        content={activity.item.description}
        image={activity.item.activity_img_url}
        date={readableDate}
        onPress={() =>
          navigation.navigate("Activity", {
            activityId: activity.item.activity_id,
            tripId: tripId,
            navigation: navigation,
          })
        }
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <FlatList
        ListHeaderComponent={
          <>
            <Header title="Trippy" />
            <View style={styles.section}>
              <Text style={styles.title}>{tripName}</Text>
              <View style={styles.image}>
                <Text>17C</Text>
                <Image
                  source={{
                    uri: "https://i.pinimg.com/736x/f1/83/cc/f183ccd0f8be3477c28d4104dc836a97.jpg",
                    width: 50,
                    height: 50,
                    alignItems: "right",
                  }}
                />
              </View>
            </View>
            <View style={styles.tabs}>
              <ItineraryButton
                title="Itinerary"
                onPress={handleItinerary}
                style={styles.button}
                isActive={isItinerary}
              />
              <ItineraryButton
                title="Possibility"
                onPress={handlePossibility}
                style={styles.button}
                isActive={isPossibility}
              />
            </View>
          </>
        }
        data={isItinerary ? itinerary : possibility}
        renderItem={renderActivity}
        keyExtractor={(activity) => activity.activity_id.toString()}
        contentContainerStyle={styles.cards}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  section: { marginTop: 40, marginBottom: 24, marginLeft: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  tabs: { flexDirection: "row", justifyContent: "space-between" },
  cards: { flex: 1, marginTop: 20 },
});

export default TripScreen;
