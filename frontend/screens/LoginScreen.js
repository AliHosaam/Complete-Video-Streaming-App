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
import { userLoginAPI } from "../api/userLoginAPI";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!password || !username) {
      console.warn("Please enter username and password");
      Alert.alert("Error", "Please enter username and password!");
      return;
    }

    setIsLoading(true);

    try {
      const responseData = await userLoginAPI(username, password);

      if (responseData.success === false) {
        console.warn("Wrong username or password!");
        Alert.alert("Error", "Wrong username or password!");
      } else if (responseData.success === true) {
        navigation.replace("BottomTabNavigator", {
          screen: "Home",
          params: {
            mylist: responseData.user.mylist,
          },
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.replace("RegisterScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
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
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000000" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
        <Text
          style={[
            styles.buttonText,
            { color: "#ffffff" },
            isLoading && { opacity: 0.5 },
          ]}
        >
          Not a member. Register!
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
