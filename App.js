import React from "react";
import { AuthProvider } from "./AuthContext";
// import ComponentShowcase from "./src/screens/ComponentShowcase";
import MainApp from "./MainApp";
import TripScreen from "./src/screens/TripScreen";

export default function App() {
  return (
    <AuthProvider>
      {/* <ComponentShowcase /> */}
      <MainApp />
    </AuthProvider>
  );
}
