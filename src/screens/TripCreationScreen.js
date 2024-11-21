import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Platform, TouchableOpacity, Pressable, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "../components/Button";
import Card from "../components/Card";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TripCreationScreen() {
  const [destination, setDestination] = useState();
  const [description, setTripDescription] = useState();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [startDate, setStartDate] = useState("");

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setStartDate(selectedDate.toDateString());
      if (Platform.OS === "android") toggleDatePicker();
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setStartDate(date.toDateString());
    toggleDatePicker();
  };

  const members = [
    { id: "1", name: "Abdiaziz" },
    { id: "2", name: "Callum" },
    { id: "3", name: "Mark" },
    { id: "4", name: "Serkan" },
    { id: "5", name: "Stefano" },
  ];

  const renderMembers = ({ item }) => (
    <Card
      title={item.name}
      onPress={() => console.log(`MemberCard Pressed: ${item.name}`)}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <ScrollView style={styles.content}>
        <Text style={styles.text}>Create Trip</Text>
        <TextInput
          style={styles.input}
          onChangeText={setDestination}
          placeholder="Enter Destination"
          value={destination}
        />
        <TouchableOpacity onPress={toggleDatePicker}>
          <Text style={styles.label}>Start Date</Text>

          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChange}
              style={styles.datePicker}
            />
          )}

          {showPicker && Platform.OS === "ios" && (
            <View style={styles.iosButtons}>
              <TouchableOpacity
                style={[styles.button, styles.pickerButton, styles.cancelButton]}
                onPress={toggleDatePicker}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.pickerButton]}
                onPress={confirmIOSDate}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}

          {!showPicker && (
            <Pressable onPress={toggleDatePicker}>
              <TextInput
                style={styles.input}
                placeholder="Select a Date"
                value={startDate}
                editable={false}
                placeholderTextColor={"#11182744"}
              />
            </Pressable>
          )}
        </TouchableOpacity>

        <TextInput
          style={[styles.input, styles.multiLineText]}
          onChangeText={setTripDescription}
          placeholder="Trip Description"
          value={description}
          multiline
        />
        <Text style={styles.subText}>Add Friends</Text>
        <FlatList
          data={members}
          renderItem={renderMembers}
          keyExtractor={(item) => item.name.toString()}
          contentContainerStyle={styles.cardsContainer}
        //   scrollEnabled={false}

        />
      </ScrollView>
         <View style={styles.buttonContainer}>
            <Button
            title="Add Member"
            onPress={() => console.log("Button Add Member")}
            style={{ alignSelf: "center", paddingHorizontal: 40 }}
            />
            <Button
            title="Done"
            onPress={() => console.log("Button Done")}
            style={{ alignSelf: "center", paddingHorizontal: 40 }}
            />
        </View>
      <Footer text="Icons display here" style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    color: "#24565C",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: "#333",
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  multiLineText: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  cardsContainer: {
    paddingVertical: 0
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  iosButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#075985",
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  cancelText: {
    color: "#075985",
    textAlign: "center",
  },
  buttonContainer:{
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginBottom: 10,
  }
});
