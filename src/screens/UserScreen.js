import React, { useState } from "react";

import { View, Text, StyleSheet,TextInput, Image, ScrollView, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";


export default function UserScreen() {
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  

  return (
    <View style={styles.container}>
    <Header title="Trippy" />
    <View style={styles.content}>
    <ScrollView>
        <Text style={styles.text}>Welcome to your Profile!</Text>
        <View style={styles.imageContainer}>
        <Image
        style={styles.image}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
        <Text style={styles.userNameheading}>The Goat Coder</Text>
        </View>
        <View> 
          <View>
              <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setName}
                  placeholder={"Enter Name"}
                  value={name}
                />
          </View>
        <View>
            <Text style={styles.label}>Profile Picture:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProfilePic}
                placeholder={"Enter Picture URl"}
                value={profilePic}
              />
        </View>
          <View>
            <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProfilePic}
                placeholder={"TheGoatCoder@gmail.com"}
                
              />
          </View>
               <View style={styles.saveChangesbtn}>
                <Button
                  title={"Save Changes"}
                  style={{ alignSelf: "center", paddingHorizontal: 30 }}
                />
              </View>
            <View style={styles.cancelbtn}>
                <Button
                  title={"Cancel"}
                  style={{ alignSelf: "center", paddingHorizontal: 40 }}
                />
          </View>
      </View>
      </ScrollView>
    </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  text: {
    fontSize: 24,
    color: "#24565C",
    fontWeight: "bold",
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
  imageContainer:{
    flex:1,
    alignItems: "center",
  },
  image: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userNameheading:{

  },
  saveChangesbtn:{
    padding: 10
  },
  cancelbtn:{
    padding: 10
  },
});
