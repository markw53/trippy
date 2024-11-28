import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ItineraryButton from "../components/ItineraryButtons";
import Header from "../components/Header";
import Card from "../components/Card";
import {
  fetchItinerary,
  fetchPossibility,
  fetchTripById,
  postPossibility,
} from "../api";
import { FlatList } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

const TripScreen = ({ route }) => {
  const navigation = useNavigation();
  const { tripId, tripName, tripImage, location } = route.params;
  const [tripStart, setTripStart] = useState("");
  const [tripEnd, setTripEnd] = useState("");
  const [tripDesc, setTripDesc] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [possibility, setPossibility] = useState([]);
  const [isItinerary, setIsItinerary] = useState(true);
  const [isPossibility, setIsPossibility] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [activityImage, setActivityImage] = useState("");
  const [isShowPicker, setIsShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { latitude, longitude } = location;

  useEffect(() => {
    if (tripId) {
      setIsLoading(true);
      setIsError(false);

      fetchItinerary(tripId)
        .then((response) => {
          const itineraryList = response.data.activities;
          setItinerary(itineraryList);
        })
        .catch((err) => {
          console.error("Error fetching itinerary:", err);
          setIsError(true);
        })
        .finally(() => setIsLoading(false));

      fetchPossibility(tripId)
        .then((response) => {
          const possibilityList = response.data.activities;
          setPossibility(possibilityList);
        })
        .catch((err) => {
          console.error("Error fetching possibilities:", err);
          if (!isError) {
            setIsError(true);
          }
        });
      fetchTripById(tripId)
        .then((response) => {
          const tripDetails = response.data.trip;
          setTripStart(tripDetails.start_date);
          setTripEnd(tripDetails.end_date);
          setTripDesc(tripDetails.description);
        })
        .catch((err) => {
          console.error("Error fetching trip details:", err);
          if (!isError) {
            setIsError(true);
          }
        });
    }
  }, [tripId, isRefresh]);

  const handleNavigationToSettings = () => {
    navigation.navigate("AddMembersScreen", { tripId, tripName });
  };

  const showDatePicker = () => {
    setIsShowPicker(true);
  };

  const handleShowTimePicker = () => {
    setShowTimePicker(true);
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
    setIsEvent(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.nativeEvent.text);
  };

  const handleTimeChange = ({ type }, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setTime(selectedDate);
    }
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

  const handlePostEvent = async () => {
    const newEvent = {
      activity_name: title,
      description: description,
      date: date.toISOString(),
      time: time.toTimeString(),
      activity_img_url: activityImage,
    };

    await postPossibility(tripId, newEvent)
      .then((response) => {
        alert("Event Created");
        console.log(response.data);
      })
      .catch((err) => {
        console.log("Error posting activity:", err);
      });
    setTitle("");
    setTime(Date.now());
    setDescription("");
    setDate(Date.now());
    setActivityImage("");
    setIsEvent(false);
    setIsRefresh(!isRefresh);
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
            setIsRefresh: setIsRefresh,
            isRefresh: isRefresh,
            tripName: tripName,
            tripImage: tripImage,
            location: location,
          })
        }
      />
    );
  };

  const startObj = new Date(tripStart);
  const endObj = new Date(tripEnd);

  const tripStartDate = startObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const tripEndDate = endObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Header title="Trippy" />

        <FlatList
          data={[
            {
              id: "tripDetails",
              component: (
                <View style={styles.topSection}>
                  <View style={styles.topRow}>
                    <Text style={styles.title}>{tripName}</Text>
                    <TouchableOpacity onPress={handleNavigationToSettings}>
                      <MaterialIcons
                        name="settings"
                        size={26}
                        color="#24565C"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text>
                    {tripStartDate} --- {tripEndDate}
                  </Text>
                  <Text>{tripDesc}</Text>
                </View>
              ),
            },
            {
              id: "tabs",
              component: (
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
              ),
            },
            {
              id: "dynamicSection",
              component: (
                <View style={styles.cards}>
                  {isLoading ? (
                    <View style={styles.center}>
                      <ActivityIndicator size="small" color="#24565C" />
                      <Text>Loading activities...</Text>
                    </View>
                  ) : itinerary.length === 0 && possibility.length === 0 ? (
                    <View style={styles.center}>
                      <Text style={styles.friendlymsg}>
                        No activities found for this trip.
                      </Text>
                      <Text style={styles.friendlymsgBold}>Add one!</Text>
                    </View>
                  ) : (
                    <>
                      {isItinerary && (
                        <FlatList
                          data={itinerary}
                          renderItem={renderActivity}
                          keyExtractor={(activity) =>
                            activity.activity_id.toString()
                          }
                          numColumns={1}
                        />
                      )}
                      {isPossibility && (
                        <FlatList
                          data={possibility}
                          renderItem={renderActivity}
                          keyExtractor={(activity) =>
                            activity.activity_id.toString()
                          }
                          numColumns={1}
                        />
                      )}
                    </>
                  )}
                </View>
              ),
            },
            {
              id: "eventSection",
              component: (
                <View style={styles.section}>
                  {isEvent ? (
                    <>
                      <TextInput
                        placeholder="Title"
                        value={title}
                        onChange={handleTitleChange}
                        style={styles.input}
                        placeholderTextColor="#888"
                      />
                      <TouchableOpacity
                        style={styles.dateField}
                        onPress={handleShowTimePicker}
                      >
                        <Text style={styles.title}>
                          {time.toLocaleTimeString() || "Select Time"}
                        </Text>
                      </TouchableOpacity>
                      {showTimePicker && (
                        <DateTimePicker
                          mode={"time"}
                          display={"default"}
                          value={time}
                          onChange={handleTimeChange}
                          style={styles.datePicker}
                        />
                      )}
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
                          mode={"date"}
                          display={"default"}
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
                    </>
                  ) : (
                    <View style={styles.eventBotton}>
                      <ItineraryButton
                        title="Add Event"
                        onPress={handleEvent}
                        style={styles.button}
                      />
                    </View>
                  )}
                </View>
              ),
            },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => item.component}
        />
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
  topSection: {
    marginTop: 20,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 25,
  },
  section: {
    marginTop: 40,
    marginBottom: 24,
    marginHorizontal: 15,
  },
  eventBotton: {
    marginTop: 5,
    marginBottom: 30,
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
  friendlymsg: {
    fontSize: 16,
    color: "#24565C",
  },
  friendlymsgBold: {
    marginTop: 5,
    fontSize: 20,
    color: "#24565C",
    fontWeight: "bold",
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
    marginHorizontal: 20,
    marginTop: 10,
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
    marginTop: 30,
    marginBottom: 24,
    marginHorizontal: 15,
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
