import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import Header from "../components/Header";

export default function WeatherScreen() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = "9bbf52bb91991e0f174188157333b47c"; // Replace with your OpenWeather API key
  const CITY = "London"; // Change to your desired city
  const UNITS = "metric"; // Use 'imperial' for Fahrenheit

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=${UNITS}&appid=${API_KEY}`
      );
      const data = response.data.list.filter((item, index) => index % 8 === 0); // Filter for daily forecasts
      setForecast(data);
      setLoading(false);
    } catch (err) {
      setError("Unable to fetch weather data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
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
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Weather Forecast" />
      <FlatList
        data={forecast}
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
  error: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
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
