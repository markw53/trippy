import React from "react";
import { AuthProvider } from "./AuthContext";
// import ComponentShowcase from "./src/screens/ComponentShowcase";
import MainApp from "./MainApp";

export default function App() {
  return (
    <AuthProvider>
      {/* <ComponentShowcase/> */}
      <MainApp />
    </AuthProvider>
  );
}
