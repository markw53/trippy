import React from "react";
import { AuthProvider } from "./AuthContext";
import MainApp from "./MainApp";
import TripScreen from "./src/screens/TripScreen";

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
