import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import Header from "../components/Header";

export default function WeatherScreen() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Fetch weather data
        const API_KEY = "9bbf52bb91991e0f174188157333b47c"; // Replace with your OpenWeather API key
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
        const response = await axios.get(url);

        // Filter for daily forecasts
        const filteredData = response.data.list.filter((item, index) => index % 8 === 0);
        setWeatherData({
          city: response.data.city,
          forecast: filteredData,
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
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Weather Forecast" />
      <Text style={styles.city}>
        {weatherData.city.name}, {weatherData.city.country}
      </Text>
      <FlatList
        data={weatherData.forecast}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.forecastItem}>
            <Text style={styles.date}>{new Date(item.dt * 1000).toDateString()}</Text>
            <Text style={styles.temp}>Temp: {item.main.temp}°C</Text>
            <Text style={styles.description}>
              {item.weather[0].description.charAt(0).toUpperCase() +
                item.weather[0].description.slice(1)}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  city: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    color: "#24565C",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  forecastItem: {
    backgroundColor: "#E1F5FE",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#24565C",
  },
  temp: {
    fontSize: 14,
    color: "#24565C",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#24565C",
    marginTop: 5,
  },
});
