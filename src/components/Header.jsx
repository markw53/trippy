import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = ({ title, style, textStyle }) => {
  return (
    <View style={[styles.header, style]}>
      <Text style={[styles.title, textStyle]}>{title}</Text>
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
  },
  title: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "bold",
  },
});

export default Header;
