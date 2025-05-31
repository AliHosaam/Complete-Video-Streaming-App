import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("LoginScreen");
    }, [500]);
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
