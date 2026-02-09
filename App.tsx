import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function App() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Camera access denied");

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1, // High compression to stay under 1MB Firestore limit
      base64: true,
    });

    if (!result.canceled) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const saveLog = async () => {
    if (!name || !image) return Alert.alert("Fill in all fields!");
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let loc =
        status === "granted"
          ? await Location.getCurrentPositionAsync({})
          : null;

      await addDoc(collection(db, "lendings"), {
        friendName: name,
        photo: image,
        latitude: loc?.coords.latitude || 0,
        longitude: loc?.coords.longitude || 0,
        date: new Date().toLocaleString(),
      });

      Alert.alert("Success!", "Lending logged.");
      setName("");
      setImage(null);
    } catch (e) {
      Alert.alert("Error", "Could not save log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Who Borrowed This?</Text>

      <TextInput
        style={styles.input}
        placeholder="Friend's Name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
        <Text style={{ color: "white" }}>📸 Take Photo of Friend</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TouchableOpacity
        style={[
          styles.saveBtn,
          { backgroundColor: loading ? "#ccc" : "#28a745" },
        ]}
        onPress={saveLog}
        disabled={loading}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>SAVE LOG</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderBottomWidth: 1, width: "100%", marginBottom: 20, padding: 10 },
  cameraBtn: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveBtn: {
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  preview: { width: 200, height: 150, borderRadius: 10, marginBottom: 20 },
});
