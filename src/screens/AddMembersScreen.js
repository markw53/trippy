import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList
} from "react-native";
import { fetchTripById, patchTripDetails, fetchTripMembers, getUserIdByEmail, postTripMembers, deleteMemberFromTrip } from "../api";

import Header from "../components/Header";
import Button from "../components/Button";

import Card from "../components/Card";

export default function AddMembersScreen() {
    const [tripName, setTripName] = useState("");
    const [tripPic, setTripPic] = useState("");
    const [tripDescription, setTripDescription] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [originalTripName, setOriginalTripName] = useState("")
    const [originalTripPic, setOriginalTripPic] = useState("")
    const [originalTripDescription, setOriginalTripDescription] = useState("")

    const [members, setMembers] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const [deleteState, setDeleteState] = useState({});

    const tripId = 4;

    const isFormValid = tripName.trim() !== "" && tripPic.trim() !== "";

    const handleSubmit = () => {
        const updateTrip = {
            trip_id: tripId,
            trip_name: tripName,
            trip_img_url: tripPic,
            description: tripDescription,
        }
        patchTripDetails(updateTrip)
            .then((response) => {
                const updatedTrip = response.data.trip;

                setOriginalTripName(updatedTrip.trip_name || tripName);
                setOriginalTripPic(updatedTrip.trip_img_url || tripPic);
                setOriginalTripDescription(updateTrip.description || tripDescription)

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
        setOriginalTripDescription(originalTripDescription)
        setUserEmail("")
        setDeleteState({});
    };

    useEffect(() => {
        fetchTripById(tripId)
            .then((response) => {
                const data = response.data.trip;

                setTripName(data.trip_name || "");
                setTripPic(data.trip_img_url || "");
                setTripDescription(data.description || "");

                setOriginalTripName(data.trip_name || "");
                setOriginalTripPic(data.trip_img_url || "");
                setOriginalTripDescription(data.description || "");

                setIsLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching trip details:", error);
                setIsError(true)
                setIsLoading(false)
            })
        fetchTripMembers(tripId)
            .then((response) => {
                const data = response.data.members;
                setMembers(data)
            })
            .catch((error) => {
                console.error("Error fetching member details:", error);
                setIsError(true)
                setIsLoading(false)
            })
    }, [members])



    const handlePrompt = (userId) => {
        setDeleteState((previousState) => ({
            ...previousState,
            [userId]: true,
        }));
        n
        setTimeout(() => {
            setDeleteState((previousState) => {
                if (previousState[userId]) {
                    return {
                        ...previousState,
                        [userId]: false
                    };
                }
                return previousState;
            });
        }, 5000);
    };

    const renderMembers = ({ item }) => {
        const isDelete = deleteState[item.user_id] || false
        return (
            <View style={styles.memberCardContainer}>
                <View style={styles.cardContent}>
                    <Text style={styles.memberCardTitle}>{item.name}</Text>
                </View>
                {!isDelete ? (<TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handlePrompt(item.user_id)}
                >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                )
                    : (<TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMember(item.user_id)}
                    >
                        <Text style={styles.deleteButtonText}>Are you sure?</Text>
                    </TouchableOpacity>
                    )}
            </View>
        );
    }

    const addMember = () => {
        getUserIdByEmail(userEmail)
            .then((response) => {
                const userId = response.data.userId.user_id;
                const newMember = {
                    "user_id": userId,
                }
                postTripMembers(tripId, newMember)
                    .then(() => {
                        setUserEmail("")
                    })
                    .catch((err) => {
                        console.log("Error adding member:", err);
                    })
            })
    }

    const handleDeleteMember = (memberId) => {
        console.log("Line 129:", tripId)
        console.log("Line 139:", memberId)
        const removeUser = { user_id: memberId }
        deleteMemberFromTrip(tripId, removeUser)

            .then((response) => {
                setDeleteState({})
                alert(response.data.msg)
            })
            .catch((error) => {
                console.error("Error removing member:", error)
                alert("Failed to remove member. Please try again.")
            })
    }

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
                                uri: originalTripPic || "https://reactnative.dev/img/tiny_logo.png"
                            }}
                            onError={(e) => {
                                console.error("Image failed to load:", e.nativeEvent.error);
                                if (!originalTripPic) {
                                    setTripPic("https://reactnative.dev/img/tiny_logo.png");
                                }
                            }}
                        />
                        <Text style={styles.tripNameheading}
                        >{originalTripName}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Trip Name:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setTripName}
                            value={tripName}
                            numberOfLines={1}
                            multiline={false}
                            textAlignVertical="center"
                            autoCapitalize="none"
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Trip Picture:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setTripPic}
                            value={tripPic}
                            numberOfLines={1}
                            multiline={false}
                            textAlignVertical="center"
                            autoCapitalize="none"
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Trip Description:</Text>
                        <TextInput
                            style={[styles.input, styles.tripDescription]}
                            onChangeText={setTripDescription}
                            value={tripDescription}
                            numberOfLines={5}
                            scrollEnabled={true}
                            multiline={true}
                            autoCapitalize="none"
                        />
                    </View>
                    <View>
                        <Text style={styles.textCurrentMembers}>Current Members</Text>

                        <FlatList
                            data={members}
                            renderItem={renderMembers}
                            keyExtractor={(item) => item.name.toString()}
                            contentContainerStyle={styles.memberardsContainer}
                        />
                    </View>
                    <View>
                        <Text style={styles.textAddMembers}>Add Member</Text>
                        <Text style={styles.label}>Members Email:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setUserEmail}
                            numberOfLines={1}
                            multiline={false}
                            textAlignVertical="center"
                            autoCapitalize="none"
                            value={userEmail}

                        />
                        <View style={styles.addMemberbtn}>
                            <Button title="Add Member"
                                style={styles.addMemberbutton}
                                onPress={addMember}
                            />
                        </View>
                    </View>
                    <View style={styles.confirmationbtnsContainer}>
                        <View style={styles.saveChangesbtn}>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={!isFormValid}
                                style={[
                                    styles.button,
                                    !isFormValid && styles.buttonDisabled,
                                ]}
                            >
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cancelbtn}>
                            <Button title="Cancel"
                                onPress={handleCancel}
                            />
                        </View>
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
        padding: 20,
    },
    text: {
        marginBottom: 30,
        fontSize: 24,
        color: "#24565C",
        fontWeight: "bold",
        textAlign: "center",
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
        padding: 12,
        fontSize: 16,
    },
    imageContainer: {
        alignItems: "center",
    },
    image: {
        width: 250,
        height: 150,
        borderRadius: 10,
    },
    userNameheading: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    addMemberbtn: {
        padding: 10,
    },
    saveChangesbtn: {
        padding: 10,
    },
    cancelbtn: {
        padding: 10,
    },
    loadingText: {
        fontSize: 18,
        color: "#999",
        marginTop: 20,
    },
    disabledInput: {
        backgroundColor: "#f5f5f5",
        color: "#999",
    },
    button: {
        backgroundColor: "#24565C",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: "center"
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    confirmationbtnsContainer: {
        marginTop: 50,
        marginBottom: 10,
        color: "#fff",
    },
    tripNameheading: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20,
    },
    textCurrentMembers: {
        marginTop: 20,
        marginBottom: 5,
        fontSize: 20,
        color: "#24565C",
        fontWeight: "bold",
        textAlign: "center"
    },
    textAddMembers: {
        marginTop: 20,
        marginBottom: 1,
        fontSize: 20,
        color: "#24565C",
        fontWeight: "bold",
        textAlign: "center"
    },
    tripDescription: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 12,
        fontSize: 16,
        height: 100,
        textAlignVertical: "top"
    },
    memberardsContainer: {
        paddingVertical: 0
    },
    memberCardContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 8,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1.5,
        borderColor: "#24565C",

    },
    memberCardContent: {
        flex: 1,
    },
    memberCardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    deleteButton: {
        backgroundColor: "#ff4d4d",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },

});