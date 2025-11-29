import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { userLogout } from "../api/userLoginAPI";

export default function MoreScreen() {
  const navigation = useNavigation();

  const handleHistoryScreenNavigation = () => {
    navigation.navigate("HistoryScreen");
  };

  const onLogout = async () => {
    try {
      const response = await userLogout();

      if (response.success === true) {
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => onLogout(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={handleHistoryScreenNavigation}
          style={styles.historyButton}
          activeOpacity={0.8}
        >
          <IonIcons
            style={styles.timerIcon}
            name="timer"
            size={35}
            color="#fff"
          />
          <Text style={styles.historyText}>History</Text>
          <IonIcons
            style={styles.chevronIcon}
            name="chevron-forward-outline"
            size={25}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e20",
    marginBottom: 30,
    height: 60,
    width: 400,
    borderRadius: 10,
  },
  historyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
  },
  timerIcon: {
    marginLeft: 10,
  },
  chevronIcon: {
    marginLeft: 240,
  },
  logoutButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#daa520",
    height: 60,
    width: 400,
    borderRadius: 10,
  },
  logoutText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
