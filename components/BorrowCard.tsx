import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../constants/Theme";

export const BorrowCard = ({ item }: any) => (
  <View style={styles.card}>
    <Image source={{ uri: item.photo }} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.name}>{item.friendName}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.location}>📍 {item.locationName || "Near me"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    flexDirection: "row",
    padding: 12,
    marginBottom: 16,
    elevation: 4,
  },
  image: { width: 70, height: 70, borderRadius: 12 },
  info: { marginLeft: 15, justifyContent: "center" },
  name: { color: Colors.text, fontSize: 18, fontWeight: "bold" },
  date: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  location: { color: Colors.secondary, fontSize: 12, marginTop: 4 },
});
