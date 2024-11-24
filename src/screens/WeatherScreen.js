import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import Header from "../components/Header";
import { WEATHER_API_KEY } from "@env";

let MapView, Marker;
if (Platform.OS === "web") {
  const {
    MapContainer,
    TileLayer,
    Marker: LeafletMarker,
    Popup
  } = require("react-leaflet");
  MapView = MapContainer;
  Marker = LeafletMarker;
} else {
  const RNMaps = require("react-native-maps");
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
}

export default function WeatherScreen() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLocation({ latitude, longitude });

        const API_KEY = WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
        const response = await axios.get(url);

        const filteredData = response.data.list.filter(
          (item, index) => index % 8 === 0
        );
        setWeatherData({
          city: response.data.city,
          forecast: filteredData
        });
        setLoading(false);
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLocationAndWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#24565C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <Text style={styles.city}>
        {weatherData.city.name}, {weatherData.city.country}
      </Text>

      {location &&
        (Platform.OS === "web"
          ? <MapView
              center={[location.latitude, location.longitude]}
              zoom={13}
              style={styles.map}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
              />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>Your Location</Popup>
              </Marker>
            </MapView>
          : <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude
                }}
                title="Your Location"
                description="Current location"
              />
            </MapView>)}

      <FlatList
        data={weatherData.forecast}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          <View style={styles.forecastItem}>
            <Text style={styles.date}>
              {new Date(item.dt * 1000).toDateString()}
            </Text>
            <Text style={styles.temp}>
              Temp: {item.main.temp}°C
            </Text>
            <Text style={styles.description}>
              {item.weather[0].description.charAt(0).toUpperCase() +
                item.weather[0].description.slice(1)}
            </Text>
          </View>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7"
  },
  city: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    color: "#24565C",
    fontWeight: "bold"
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10
  },
  forecastItem: {
    backgroundColor: "#E1F5FE",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#24565C"
  },
  temp: {
    fontSize: 14,
    color: "#24565C",
    marginTop: 5
  },
  description: {
    fontSize: 14,
    color: "#24565C",
    marginTop: 5
  },
  map: {
    width: "100%",
    height: 250,
    marginBottom: 20
  }
});
