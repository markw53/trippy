import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Card = ({ title, content, style, time }) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {time && <Text style={styles.time}> {time}</Text>}
      {content && <Text style={styles.content}>{content}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "right",
  }
});

export default Card;
