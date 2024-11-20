import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "./AuthContext";
import { SafeAreaView } from "react-native";

import LoginScreen from "./LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import WeatherScreen from "./src/screens/WeatherScreen";
import UserScreen from "./src/screens/UserScreen";
import Header from "./src/components/Header";

export default function MainApp() {
  const { user } = useAuth(); // Get the authenticated user from AuthContext
  const Tab = createBottomTabNavigator();

  if (!user) {
    // If the user is not logged in, show the LoginScreen
    return (
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
  }

  // If the user is logged in, show the bottom tab navigator
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Weather") {
              iconName = focused ? "cloud" : "cloud-outline";
            } else if (route.name === "User") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#24565C",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#CCD6D5",
            borderTopWidth: 0,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight:"bold",
            color: "#24565C",
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Weather" component={WeatherScreen} />
        <Tab.Screen name="User" component={UserScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
