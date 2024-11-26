import "react-native-get-random-values";
import React from "react";
import { AuthProvider } from "./AuthContext";
import MainApp from "./MainApp";

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
