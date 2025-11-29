import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { checkAuthAPI } from "../api/userLoginAPI";

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timeToNavigate = setTimeout(() => {
      const checkAuhUser = async () => {
        const response = await checkAuthAPI();

        if (response.authenticated) {
          navigation.replace("BottomTabNavigator", {
            screen: "Home",
            params: {
              mylist: response.user.mylist,
            },
          });
        } else {
          navigation.replace("LoginScreen");
        }
      };

      checkAuhUser();
    }, 500);

    return () => clearTimeout(timeToNavigate);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image
          style={styles.splashLogo}
          source={require("../assets/icons/logo-bg-transparent.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  subContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: 200,
    height: 200,
  },
});
