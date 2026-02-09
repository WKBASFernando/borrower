import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Colors } from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Access denied");

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    if (!name || !image)
      return Alert.alert("Missing Info", "Please provide a name and photo.");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const loc =
        status === "granted"
          ? await Location.getCurrentPositionAsync({})
          : null;

      await addDoc(collection(db, "lendings"), {
        friendName: name,
        photo: image,
        locationName: loc
          ? `Lat: ${loc.coords.latitude.toFixed(2)}, Lon: ${loc.coords.longitude.toFixed(2)}`
          : "Unknown",
        date: new Date().toLocaleDateString(),
        timestamp: serverTimestamp(),
      });

      router.back();
    } catch (e) {
      Alert.alert("Error", "Could not save.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Lending</Text>

      <TouchableOpacity style={styles.imagePlaceholder} onPress={takePhoto}>
        {image ? (
          <Image source={{ uri: image }} style={styles.fullImage} />
        ) : (
          <Ionicons name="camera" size={50} color={Colors.textSecondary} />
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Who borrowed it?"
        placeholderTextColor={Colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Lending Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 25 },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 30,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    overflow: "hidden",
  },
  fullImage: { width: "100%", height: "100%" },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 40,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  saveBtnText: { fontWeight: "bold", fontSize: 16 },
});
