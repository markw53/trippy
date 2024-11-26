import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-web";
import { fetchTripById, patchTripDetails } from "../api";

import Header from "../components/Header";
import Button from "../components/Button";

import Card from "../components/Card";

export default function AddMembersScreen() {
    const [tripName, setTripName] = useState("");
    const [tripPic, setTripPic] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [originalTripName, setOriginalTripName] = useState()
    const [originalTripPic, setOriginalTripPic] = useState()

    const tripId = 9;

    // const isFormValid = tripName.trim() !== "" && tripPic.trim() !== "";

    const handleSubmit = () => {
        const updateTrip = {
            trip_id: trip_id,
            trip_name: tripName,
            trip_img_url: tripPic,
        }
        patchTripDetails(updateTrip)
            .then((response) => {
                const updatedTrip = response.data.trip;

                setOriginalTripName(updatedTrip.tripName || tripName);
                setOriginalTripPic(updatedTrip.trip_img_url || tripPic);

                alert("Trip details updated successfully!");
            })
            .catch((error) => {
                alert("Failed to update trip details. Please try again.");
                console.error("Error in patching trip details:", error);
            })
    }

    const handleCancel = () => {
        // Revert to original values
        setTripName(originalTripName);
        setTripPic(originalTripPic);
    };

    useEffect(() => {
        fetchTripById(tripId)
            .then((response) => {
                const data = response.data.trip;

                // console.log(data);
                setTripName(data.trip_name || "");
                setTripPic(data.trip_img_url || "");

                setOriginalTripName(data.tripName || "");
                setOriginalTripPic(data.trip_img_url || "")

                setIsLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching trip details:", error);
                setIsError(true)
                setIsLoading(false)
            })
    }, [])

    const renderTripMembers = ({ item }) => (
        <Card

        />
    )

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading trip details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Trippy" />
            <View style={styles.content}>
                <ScrollView>
                    <Text style={styles.text}>Trip Settings</Text>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: tripPic || "https://static.independent.co.uk/2023/08/31/12/iStock-1484200613.jpg"
                            }}
                            onError={(e) => {
                                console.error("Image failed to load:", e.nativeEvent.error);
                                if (!originalTripPic) {
                                    setOriginalTripPic("https://reactnative.dev/img/tiny_logo.png");
                                }
                            }}
                        />
                        <Text style={styles.tripNameheading}
                        >{tripName || originalTripName}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Change Trip Name:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setTripName}
                            // value={tripName}
                            numberOfLines={1}
                            multiline={false}
                            textAlignVertical="center"
                            autoCapitalize="none"
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Change Trip  Picture:</Text>
                        <TextInput
                            style={styles.input}
                            onChange={setTripPic}
                            numberOfLines={1}
                            multiline={false}
                            textAlignVertical="center"
                            autoCapitalize="none"
                        />
                    </View>
                    <View>
                        <Text style={styles.textCurrentMembers}>Current Members</Text>
                        {/* <FlatList></FlatList> */}
                    </View>
                    <View>
                        <Text style={styles.textAddMembers}>Add Member</Text>
                        <Text style={styles.label}>Members Email:</Text>
                        <TextInput
                            style={styles.input}
                            numberOfLines={1}
                            multiline={false}
                            textAlignVertical="center"
                            autoCapitalize="none"
                        />
                        <Button title="Add Member"
                            style={styles.button}
                            textStyle={styles.buttonText}
                        />
                    </View>
                    <View style={styles.confirmationbtnsContainer}>
                        <Button title="Save Changes"
                            style={[styles.button, styles.confirmationbtn]}
                            textStyle={styles.buttonText}

                        />
                        <Button title="Cancel"
                            style={[styles.button, styles.confirmationbtn]}
                            textStyle={styles.buttonText}

                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    text: {
        marginBottom: 30,
        fontSize: 24,
        color: "#24565C",
        fontWeight: "bold",
        textAlign: "center"
    },
    tripNameheading: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20,
    },
    textCurrentMembers: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 20,
        color: "#24565C",
        fontWeight: "bold",
        textAlign: "center"
    },
    textAddMembers: {
        marginTop: 20,
        marginBottom: 5,
        fontSize: 20,
        color: "#24565C",
        fontWeight: "bold",
        textAlign: "center"
    },
    label: {
        paddingHorizontal: 50,
        fontSize: 16,
        marginVertical: 10, // Keep vertical spacing
        color: "#333",
        textAlign: "left", // Align the text to the left
        alignSelf: "flex-start", // Align the label itself to the start of its parent container
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 10,
        padding: 12,
        fontSize: 16,
        width: "100%",
    },
    imageContainer: {
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    button: {
        backgroundColor: "#24565C",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    confirmationbtnsContainer: {
        marginTop: 50,
        color: "#fff",
    },
    confirmationbtn: {
        marginTop: 20
    },
    loadingText: {
        fontSize: 18,
        color: "#999",
        marginTop: 20,
    },
});