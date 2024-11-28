import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { AuthProvider } from "./AuthContext";
import MainApp from "./MainApp";
import * as Font from "expo-font";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
      "DancingScript-Regular": require("./assets/fonts/DancingScript-Regular.ttf"),
    });
    setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
