import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api, { setAuthToken } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, authData, loading: authLoading } = useContext(AuthContext);

  // Redirect to Main screen if already logged in
  useEffect(() => {
    if (!authLoading && authData?.token) {
      navigation.replace("Main"); // prevent back to login
    }
  }, [authData, authLoading]);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login", {
        phone_number: mobile,
      });

      const data = response.data;
      console.log("Login API response:", data);

      if (data?.access_token) {
        setAuthToken(data.access_token, data.token_type);

        login({
          token: data.access_token,
          tokenType: data.token_type,
          phone: mobile,
          user: data.user,
        });

        Alert.alert("Success", "OTP sent successfully");
        navigation.navigate("OTP", { mobile });
      } else {
        Alert.alert("Login failed", data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Login API Error:", error.response?.data || error.message);
      Alert.alert("Error", "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while AuthProvider is restoring token
  if (authLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} color="#007bff" />;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo12.png")} style={styles.logo} />

      <View style={styles.form}>
        <Text style={styles.label}>Login with Mobile</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Your Mobile Number"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
          selectionColor="#007bff"
          cursorColor="#007bff"
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: mobile.length === 10 ? "#007bff" : "#ccc" },
          ]}
          onPress={handleSendOtp}
          disabled={loading || mobile.length !== 10}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendBtnText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>
        <Text style={styles.socialText}>Login with Social Accounts</Text>

        <View style={styles.socialIcons}>
          <Icon name="facebook" size={30} color="#3b5998" />
          <Icon name="twitter" size={30} color="#1DA1F2" style={styles.iconSpacing} />
          <Icon name="envelope" size={30} color="#EA4335" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#3f7ffb" },
  logo: { width: 250, height: 200, alignSelf: "center", marginTop: 80 },
  form: {
    backgroundColor: "#fff",
    flex: 1,
    marginTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    fontSize: 16,
    marginBottom: 20,
    paddingVertical: 5,
    color: "#000", // ✅ ensure typed numbers are visible
  },
  sendBtn: { paddingVertical: 12, borderRadius: 25, alignItems: "center" },
  sendBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  orText: { textAlign: "center", marginVertical: 20, color: "#888" },
  socialText: { textAlign: "center", fontWeight: "bold", marginBottom: 10 },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 60,
  },
  iconSpacing: { marginHorizontal: 20 },
});
