import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Colors } from "../../constants/Theme";
import { BorrowCard } from "../../components/BorrowCard";
import { Ionicons } from "@expo/vector-icons"; // Part of Expo
import { router } from "expo-router";

export default function HomeScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "lendings"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(docs);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lent History</Text>

      <FlatList
        data={items}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => <BorrowCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-item")}
      >
        <Ionicons name="add" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: Colors.primary,
    width: 65,
    height: 65,
    borderRadius: 33,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: Colors.primary,
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
});
