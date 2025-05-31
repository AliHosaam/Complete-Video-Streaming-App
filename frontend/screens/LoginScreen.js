import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { userLoginAPI, checkAuthAPI } from "../api/userLoginAPI";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkAuhUser = async () => {
      const response = await checkAuthAPI();

      if (response.authenticated) {
        navigation.navigate("BottomTabNavigator", {
          screen: "Home",
          params: {
            mylist: response.user.mylist,
          },
        });
      }
    };

    checkAuhUser();
  }, [checkAuthAPI, navigation]);

  const handleLogin = async () => {
    const responseData = await userLoginAPI(username, password);

    if (responseData.success === false) {
      console.warn("Wrong username or password!");
    } else if (responseData.success === true) {
      navigation.navigate("BottomTabNavigator", {
        screen: "Home",
        params: {
          mylist: responseData.user.mylist,
        },
      });
    }
  };

  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#FFFFFF"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister}>
        <Text style={[styles.buttonText, { color: "#ffffff" }]}>
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
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
