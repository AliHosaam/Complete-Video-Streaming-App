import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { userRegisterAPI } from "../api/userRegisterAPI";
import { checkAuthAPI } from "../api/userLoginAPI";

export default function RegisterScreen() {
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

  const handleRegister = async () => {
    const responseData = await userRegisterAPI(username, password);

    if (responseData.success === false) {
      console.warn("User already exists");
    } else if (responseData.success === true) {
      navigation.navigate("BottomTabNavigator", {
        screen: "Home",
        params: {
          mylist: responseData.user.mylist,
        },
      });
    }
  };

  const handleLogin = () => {
    navigation.navigate("LoginScreen");
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#FFFFFF"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin}>
        <Text style={[styles.buttonText, { color: "#ffffff" }]}>
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
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
