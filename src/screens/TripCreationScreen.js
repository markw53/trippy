import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Platform, TouchableOpacity, Pressable, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "../components/Button";
import Card from "../components/Card";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TripCreationScreen() {
  const [destination, setDestination] = useState("");
  const [description, setTripDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  const [startDate, setStartDate] = useState("");

  const [showEndPicker, setShowEndPicker] = useState(false);
  const [endDate, setEndDate] = useState("");
  //Added
 //-------------------------------------------------------------------------
const handleSubmit = () => {
  if (!destination || !description || !startDate || !endDate) {
    alert("All fields are required!");
    return;
  }
  if (new Date(endDate) < new Date(startDate)) {
      alert("End Date cannot be before Start Date!");
      return;
    }
    console.log("Trip Submitted:", { destination, description, startDate, endDate });
};
//-------------------------------------------------------------------------

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onStartChange = ({type}, selectedDate) => {
    if (type == "set") {
        const currentDate = formatDate(selectedDate || date); // added ||date

      setDate(selectedDate);
      setStartDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        // setStartDate(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setStartDate(formatDate(date));
    toggleDatePicker();
  };

  const formatDate = (rawDate)=>{
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() +1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${day}-${month}-${year}`;
  }

  const toggleEndDatePicker = ()=> setShowEndPicker(!showEndPicker)

  const onEndchange = ({type}, selectedDate) => {
    if (type == "set") {
        const currentDate = formatDate(selectedDate || date); // added ||date

      setDate(selectedDate);
      setEndDate(currentDate);

      if (Platform.OS === "android") {
        toggleEndDatePicker();
        // setStartDate(formatDate(currentDate));
      }
    } else {
      toggleEndDatePicker();
    }
  };

  const confirmIOSEndDate = () => {
    setEndDate(formatDate(date));
    toggleEndDatePicker();
  };


  // const members = [
  //   { id: "1", name: "Abdiaziz" },
  //   { id: "2", name: "Callum" },
  //   { id: "3", name: "Mark" },
  //   { id: "4", name: "Serkan" },
  //   { id: "5", name: "Stefano" },
  // ];

  // const renderMembers = ({ item }) => (
  //   <Card
  //     title={item.name}
  //     onPress={() => console.log(`MemberCard Pressed: ${item.name}`)}
  //   />
  // );

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
          {destination === "" && <Text style={styles.errorText}>Destination is required.</Text>}
        <View onPress={toggleDatePicker}>
            <Text style={styles.label}>Start Date</Text>

            {showPicker && (
                <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onStartChange}
                style={styles.datePicker}
                minimumDate={startDate ? new Date(startDate) : new Date()}
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
                placeholder="Start Date"
                value={startDate}
                onChangeText={setStartDate}
                placeholderTextColor="#11182744"
                editable={false}
                onPressIn={toggleDatePicker}
              />
            </Pressable>
          )}
        {!startDate && <Text style={styles.errorText}>Start Date is required.</Text>}
        </View>

        <View onPress={toggleDatePicker}>
            <Text style={styles.label}>End Date</Text>
            
            {showEndPicker && (
                <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={date}
                    onChange={onEndchange}
                    style={styles.datePicker}
                    minimumDate={endDate ? new Date(endDate) : new Date()}

                />
            )};

            {showEndPicker && Platform.OS === "ios" && (
                <View style={styles.iosButtons}>
                    <TouchableOpacity
                    style={[styles.button, styles.pickerButton, styles.cancelButton]}
                    onPress={toggleEndDatePicker}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.pickerButton]}
                    onPress={confirmIOSEndDate}
                >
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                </View>
            
            )};
            {!showEndPicker && (
            <Pressable onPress={toggleEndDatePicker}>
              <TextInput
                style={styles.input}
                placeholder="End Date"
                value={endDate}
                onChangeText={setEndDate}
                placeholderTextColor="#11182744"
                editable={false}
                onPressIn={toggleEndDatePicker}
              />
            </Pressable>
          )}
        {!endDate && <Text style={styles.errorText}>End Date is required.</Text>}

        </View>

        <TextInput
          style={[styles.input, styles.multiLineText]}
          onChangeText={setTripDescription}
          placeholder="Trip Description"
          value={description}
          multiline
        />
        <Text style={styles.subText}>Add Friends</Text>
        {/* <FlatList
          data={members}
          renderItem={renderMembers}
          keyExtractor={(item) => item.name.toString()}
          contentContainerStyle={styles.cardsContainer}
          scrollEnabled={false}
         /> */}
      </ScrollView>
         <View style={styles.buttonContainer}>
            {/* <Button
            title="Add Member"
            onPress={() => console.log("Button Add Member")}
            style={{ alignSelf: "center", paddingHorizontal: 40 }}
            /> */}
        </View>
            <Button
            title="Done"
            onPress={handleSubmit}
            // onPress={() => console.log("Button Done")}
            style={{ alignSelf: "center", paddingHorizontal: 40 }}
            />
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
    fontSize: 14,
    fontWeight: "500",
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
