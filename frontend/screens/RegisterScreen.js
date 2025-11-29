import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { userRegisterAPI } from "../api/userRegisterAPI";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!password || !username) {
      console.warn("Please enter username and password");
      Alert.alert("Error", "Please enter username and password!");
      return;
    } else if (password.length < 6) {
      console.warn("Password must be at least 6 characters long");
      Alert.alert("Error", "Password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);

    try {
      const responseData = await userRegisterAPI(username, password);

      if (responseData.success === false) {
        console.warn("User already exists");
        Alert.alert("Error", "This username is taken. User already exists!");
      } else if (responseData.success === true) {
        navigation.replace("BottomTabNavigator", {
          screen: "Home",
          params: {
            mylist: responseData.user.mylist,
          },
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert(
        "Error",
        "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.replace("LoginScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#FFFFFF"
        value={username}
        onChangeText={(text) => setUsername(text)}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#FFFFFF"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000000" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
        <Text
          style={[
            styles.buttonText,
            { color: "#ffffff" },
            isLoading && { opacity: 0.5 },
          ]}
        >
          Already a member. Login!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#333333",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "#FFFFFF",
    borderColor: "gray",
    borderWidth: 1,
  },
  loginButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#daa520",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
