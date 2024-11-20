import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "./AuthContext";
import { SafeAreaView } from "react-native";

import LoginScreen from "./LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import WeatherScreen from "./src/screens/WeatherScreen";
import UserScreen from "./src/screens/UserScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ItineraryScreen from "./src/screens/ItineraryScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import Header from "./src/components/Header";

export default function MainApp() {
  const { user } = useAuth();
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs">
          {() =>
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
                  height: 70
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#24565C"
                },
                headerShown: false
              })}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  header: () => <Header title="Home" />
                }}
              />
              <Tab.Screen
                name="Weather"
                component={WeatherScreen}
                options={{
                  header: () => <Header title="Weather" />
                }}
              />
              <Tab.Screen
                name="User"
                component={UserScreen}
                options={{
                  header: () => <Header title="User" />
                }}
              />
            </Tab.Navigator>}
        </Stack.Screen>

        <Stack.Screen
          name="Itinerary"
          component={ItineraryScreen}
          options={{
            header: () => <Header title="Itinerary" />
          }}
        />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            header: () => <Header title="Chat" />
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
