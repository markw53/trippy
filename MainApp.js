import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "./AuthContext";
import LoginScreen from "./LoginScreen";

export default function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {user
        ? <Text>
            Welcome, {user.email}!
          </Text>
        : <LoginScreen />}
    </View>
  );
}
