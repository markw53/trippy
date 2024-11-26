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
} from "react-native";
import ItineraryButton from "../components/ItineraryButtons";
import Header from "../components/Header";
import Card from "../components/Card";
import { fetchItinerary, fetchPossibility, postPossibility } from "../api";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";

const TripScreen = ({ route }) => {
  const { tripId, tripName, navigation } = route.params;
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
  const [isShowPicker, setIsShowPicker] = useState(true);

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

  const handleTitleChange = (e) => {
    setTitle(e.nativeEvent.text);
  };

  const handleTimeChange = (e) => {
    setTime(e.nativeEvent.text);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.nativeEvent.text);
  };

  const handleActivityImageChange = (e) => {
    setActivityImage(e.nativeEvent.text);
  };

  const handleDate = ({ type }, selectedDate) => {
    setIsShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handlePostEvent = () => {
    const newEvent = {
      activity_name: title,
      description: description,
      date: date.toISOString(),
      time: time,
      activity_img_url: activityImage,
    };

    console.log("Event being posted: ", newEvent);

    postPossibility(tripId, newEvent)
      .then((response) => {
        alert("Event Created");
        console.log(response.data);
      })
      .catch((err) => {
        console.log("Error posting activity:", err);
      });
    setTitle("");
    setTime("");
    setDescription("");
    setDate(Date.now());
    setActivityImage("");
    setIsEvent(false);
    setIsItinerary(true);
  };

  const renderActivity = (activity) => {
    const isoDate = activity.item.date;

    const dateObj = new Date(isoDate);

    const readableDate = dateObj.toLocaleDateString("en-GB", {
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
      <View style={styles.container}>
        <Header title="Trippy" />
        <ScrollView>

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
        {isEvent && (
          <ScrollView>
            <View style={styles.section}>
              <TextInput
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Time"
                value={time}
                onChange={handleTimeChange}
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                multiline={true}
                numberOfLines={4}
                placeholder="Description"
                value={description}
                onChange={handleDescriptionChange}
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Image"
                value={activityImage}
                onChange={handleActivityImageChange}
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                style={styles.dateField}
                onPress={showDatePicker}
              >
                <Text style={styles.title}>
                  {date.toLocaleDateString() || "Select Date"}
                </Text>
              </TouchableOpacity>
              {isShowPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={handleDate}
                  style={styles.datePicker}
                />
              )}
              <ItineraryButton
                title="Post"
                onPress={handlePostEvent}
                style={styles.button}
              />
            </View>
          </ScrollView>
        )}
        <View style={styles.cards}>
          {isItinerary && (
            <FlatList
              data={itinerary}
              renderItem={renderActivity}
              keyExtractor={(activity) => activity.activity_id.toString()}
              numColumns={1}
            />
          )}
          {isPossibility && (
            <FlatList
              data={possibility}
              renderItem={renderActivity}
              keyExtractor={(activity) => activity.activity_id.toString()}
              numColumns={1}
            />
          )}
        </View>
        {!isEvent && (
          <View style={styles.section}>
            <ItineraryButton
              title={"Add Event"}
              onPress={handleEvent}
              style={styles.button}
            />
          </View>
        )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    padding: 0,
    flexGrow: 1,
  },
  section: {
    marginTop: 40,
    marginBottom: 24,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    paddingHorizontal: 40,
    marginHorizontal: "auto",
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  image: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  tabs: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
    fontSize: 16,
  },
  cards: {
    flex: 1,
    marginTop: 40,
    marginBottom: 24,
    marginLeft: 10,
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  dateField: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TripScreen;
