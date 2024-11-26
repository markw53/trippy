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
  ActivityIndicator,
} from "react-native";
import ItineraryButton from "../components/ItineraryButtons";
import Header from "../components/Header";
import Card from "../components/Card";
import { fetchItinerary, fetchPossibility, postPossibility } from "../api";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { WEATHER_API_KEY } from "@env";

const TripScreen = ({ route }) => {
  const navigation = useNavigation();
  const { tripId, tripName, tripImage, location } = route.params;
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
  const [weatherData, setWeatherData] = useState(null);
  const { latitude, longitude } = location

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
    }
  }, [tripId, isRefresh]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
        );
        setWeatherData(weatherResponse.data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    if (tripName) {
      fetchWeather();
    }
  }, [tripName]);

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

  const handlePostEvent = () => {
    const newEvent = {
      activity_name: title,
      description: description,
      date: date.toISOString(),
      time: time.toTimeString(),
      activity_img_url: activityImage,
    };

    postPossibility(tripId, newEvent)
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
            {weatherData && (
              <View style={styles.weather}>
                <Text>{weatherData.main.temp}°C</Text>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}} style={{
                    width: 50,
                    height: 50,
                    alignItems: "right",
                  }}
                />
              </View>
            )}
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

          {/* Dynamic section: show loading, error, or data */}
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
            )}
            
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
                    mode="time"
                    display="spinner"
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
          {!isEvent && (
            <View style={styles.eventBotton}>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 25
  },
  section: {
    marginTop: 40,
    marginBottom: 24,
    marginLeft: 10,
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
