import "react-native-get-random-values";
import React from "react";
import { AuthProvider } from "./AuthContext";

import MainApp from "./MainApp";
import AddMembersScreen from "./src/screens/AddMembersScreen";

export default function App() {
  return (
    <AuthProvider>
      {/* <MainApp /> */}
      <AddMembersScreen />
    </AuthProvider>
  );
}
