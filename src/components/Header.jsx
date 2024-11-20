import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth } from "../../firebase"; // Adjust path as needed
import { signOut } from "firebase/auth";
import { useAuth } from "../../AuthContext"; // Ensure you're using your AuthContext here

const Header = ({ title, style, textStyle }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { setUser } = useAuth(); // Add this to update the auth context on logout

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Reset the user in the AuthContext
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <View style={[styles.header, style]}>
      <Text style={[styles.title, textStyle]}>{title}</Text>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={toggleMenu}>
        <View style={styles.modalOverlay}>
          <View style={styles.menu}>
            <Button title="Itinerary" onPress={() => alert("Itinerary pressed")} />
            <Button title="Chat" onPress={() => alert("Chat pressed")} />
            <Button title="Logout" onPress={handleLogout} />
            <Button title="Close" onPress={toggleMenu} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginTop: 0,
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#24565C",
    alignItems: "left",
    justifyContent: "left",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menu: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: 250,
  },
});

export default Header;
