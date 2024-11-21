import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth } from "../../firebase"; 
import { signOut } from "firebase/auth";
import { useAuth } from "../../AuthContext"; 
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, style, textStyle }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { setUser } = useAuth(); 
  // const navigation = useNavigation();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); 
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const handleNavigateToChat = () => {
    toggleMenu();
    navigation.navigate("Chat");
  };

  const handleNavigateToItinerary = () => {
    toggleMenu();
    navigation.navigate("Itinerary"); 
  };

  return (
    <View style={[styles.header, style]}>
      <Text style={[styles.title, textStyle]}>{title}</Text>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
       visible={menuVisible} 
       transparent={true} 
       animationType="fade" 
       onRequestClose={toggleMenu}
       >
        <View style={styles.modalOverlay}>
          <View style={styles.menu}>
            <Button title="Itinerary" onPress={handleNavigateToItinerary} />
            <Button title="Chat" onPress={handleNavigateToChat} />
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
    paddingTop: 40,
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
