

import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Platform, TouchableOpacity, Pressable, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { createTrip } from "../api";

export default function TripCreationScreen() {
  const [tripName, setTripName] = useState("");
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
  if (!destination || !tripName || !startDate || !endDate) {
    alert("All fields are required!");
    return;
  }
  if (new Date(endDate).toISOString() < new Date(startDate).toISOString()) {
      alert("End Date cannot be before Start Date!");
      return;
    }
   
    
    const userId = 1;

    const tripData = {
      trip_name: tripName,
      location: destination,
      description: description,
      start_date: new Date(startDate).toISOString() ,
      end_date: new Date(endDate).toISOString(),
      created_by: userId,
    }

    createTrip(tripData)
    .then((response)=>{
      alert(`Trip Created Successfully`)
      console.log("Created Trip:", response.data)
    })
    .catch((err)=>{
      alert("Failed to create trip. Please try again");
      console.error(err)
  }) 
};
//-------------------------------------------------------------------------

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onStartChange = ({type}, selectedDate) => {
    
    if (type == "set") {
        const currentDate = selectedDate || date; // added ||date

      setDate(selectedDate);
      setStartDate(currentDate.toDateString());
      
      if (Platform.OS === "android") {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
 
    setStartDate(date.toDateString());
    toggleDatePicker();
  };

  const toggleEndDatePicker = ()=> setShowEndPicker(!showEndPicker)

  const onEndchange = ({type}, selectedDate) => {
        
        if (type == "set") {
      const currentDate = selectedDate || date; // added ||date
      setDate(selectedDate);
      setEndDate(currentDate.toDateString());


      if (Platform.OS === "android") {
        toggleEndDatePicker();
      }
    } else {
      toggleEndDatePicker();
    }
  };

  const confirmIOSEndDate = () => {
   
    setEndDate(date.toDateString());
    
    toggleEndDatePicker();
  };

  return (
    <View style={styles.container}>
      <Header title="Trippy" />
      <ScrollView style={styles.content}>
        <Text style={styles.text}>Create Trip</Text>
        <View>
        <Text style={styles.label}>Trip Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setTripName}
          placeholder={"Enter Trip Name"}
          value={tripName}
        />
        {/* {tripName === "" && <Text style={styles.errorText}>Trip Name is required.</Text>} */}
        </View>
        <View>
        <Text  style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          onChangeText={setDestination}
          placeholder={"Enter Destination"}
          value={destination}
        />
        </View>
          {/* {destination === "" && <Text style={styles.errorText}>Destination is required.</Text>} */}
        <View onPress={toggleDatePicker}>
            <Text style={styles.label}>Start Date</Text>

            {showPicker && (
                <DateTimePicker
                mode={"date"}
                display={"spinner"}
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
                placeholder={"Start Date"}
                value={startDate}
                onChangeText={setStartDate}
                placeholderTextColor={"#11182744"}
                editable={false}
                onPressIn={toggleDatePicker}
              />
            </Pressable>
          )}
        {/* {!startDate && <Text style={styles.errorText}>Start Date is required.</Text>} */}
        </View>

        <View onPress={toggleDatePicker}>
            <Text style={styles.label}>End Date</Text>
            
            {showEndPicker && (
                <DateTimePicker
                    mode={"date"}
                    display={"spinner"}
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
                placeholder={"End Date"}
                value={endDate}
                onChangeText={setEndDate}
                placeholderTextColor={"#11182744"}
                editable={false}
                onPressIn={toggleEndDatePicker}
              />
            </Pressable>
          )}
        {/* {!endDate && <Text style={styles.errorText}>End Date is required.</Text>} */}

        </View>
        <View style={styles.tripContainer}>
        <Text style={styles.label}>Trip Description</Text>
        <TextInput
          style={[styles.input, styles.multiLineText]}
          onChangeText={setTripDescription}
          placeholder={"Trip Description"}
          value={description}
          multiline
        />
        </View>
         <View style={styles.buttonContainer}>
            <Button
            title={"Done"}
            onPress={handleSubmit}
            style={{ alignSelf: "center", paddingHorizontal: 40 }}
            />
        </View>
      </ScrollView>
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
    marginTop: 40,
    
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
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
    fontSize: 16
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
    marginTop: 50,
    marginBottom: 50,
    
  },
  errorText:{
    color: "red"
  },
});
