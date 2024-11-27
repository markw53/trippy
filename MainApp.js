import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "./AuthContext";
import { SafeAreaView } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import WeatherScreen from "./src/screens/WeatherScreen";
import UserScreen from "./src/screens/UserScreen";
import ChatScreen from "./src/screens/ChatScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import Header from "./src/components/Header";
import TripScreen from "./src/screens/TripScreen";
import TripCreationScreen from "./src/screens/TripCreationScreen";
import ActivityScreen from "./src/screens/ActivityScreen";
import AddMembersScreen from "./src/screens/AddMembersScreen";

export default function MainApp() {
  const { user } = useAuth();
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Homescreen" component={HomeScreen} />
      <Stack.Screen
        name="Trip"
        component={TripScreen}
        options={{
          header: () => <Header title="Trip Details" />,
        }}
      />
      <Stack.Screen name="AddMembersScreen" component={AddMembersScreen}/>
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="TripCreationScreen" component={TripCreationScreen} />
    </Stack.Navigator>
  );

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
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs">
            {() => (
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
                    } else if (route.name === "Chat") {
                      iconName = focused ? "chatbubble" : "chatbubble-outline";
                    }

                    return (
                      <Ionicons name={iconName} size={size} color={color} />
                    );
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
                    fontWeight: "bold",
                    color: "#24565C",
                  },
                  headerShown: false,
                })}
              >
                <Tab.Screen
                  name="Home"
                  component={HomeStack}
                  options={{
                    header: () => <Header title="Home" />,
                  }}
                />
                <Tab.Screen
                  name="Weather"
                  component={WeatherScreen}
                  options={{
                    header: () => <Header title="Weather" />,
                  }}
                />
                <Tab.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{
                    header: () => <Header title="Chat" />,
                  }}
                />
                <Tab.Screen
                  name="User"
                  component={UserScreen}
                  options={{
                    header: () => <Header title="User" />,
                  }}
                />
              </Tab.Navigator>
            )}
          </Stack.Screen>         
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
