import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Colors } from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export const BorrowCard = ({ item }: any) => {
  const handleDelete = () => {
    Alert.alert("Confirm Return", `Has item been returned?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => await deleteDoc(doc(db, "lendings", item.id)),
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.photo }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.friendName}</Text>
        <Text style={styles.details}>📍 {item.returnAddress}</Text>
        <Text style={styles.details}>⏰ {item.returnTime || "No time"}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <TouchableOpacity onPress={handleDelete}>
        <Ionicons
          name="checkmark-done-circle"
          size={32}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    flexDirection: "row",
    padding: 15,
    marginBottom: 16,
    alignItems: "center",
  },
  image: { width: 70, height: 70, borderRadius: 15 },
  info: { marginLeft: 15, flex: 1 },
  name: { color: Colors.text, fontSize: 18, fontWeight: "bold" },
  details: { color: Colors.secondary, fontSize: 13 },
  date: { color: Colors.textSecondary, fontSize: 11, marginTop: 5 },
});
