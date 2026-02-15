import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { router } from "expo-router";
import { Colors } from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "697423123208-ov9i6f49rob6mnsvcdg2p6u8jegeof7e.apps.googleusercontent.com",
    androidClientId:
      "697423123208-ov9i6f49rob6mnsvcdg2p6u8jegeof7e.apps.googleusercontent.com",
    webClientId:
      "697423123208-ov9i6f49rob6mnsvcdg2p6u8jegeof7e.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(() => {
        router.replace("/(tabs)"); // Go to History after login
      });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Ionicons name="wallet" size={80} color={Colors.primary} />
      <Text style={styles.title}>Borrower</Text>
      <Text style={styles.subtitle}>Keep track of what you lend.</Text>

      <TouchableOpacity
        style={styles.loginBtn}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Ionicons
          name="logo-google"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.loginText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { color: Colors.text, fontSize: 40, fontWeight: "900", marginTop: 20 },
  subtitle: { color: Colors.textSecondary, fontSize: 16, marginBottom: 50 },
  loginBtn: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  loginText: { color: "#000", fontWeight: "bold", fontSize: 18 },
});
