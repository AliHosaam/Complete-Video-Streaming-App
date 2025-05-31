import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MoreScreen from "../screens/MoreScreen";
import SearchScreen from "../screens/SearchScreen";
import Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBarStyle,
        headerShown: false,
        tabBarActiveTintColor: "#daa520",
        tabBarShowLabel: true,
        tabBarInactiveTintColor: "#808080",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} style={styles.icon} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} style={styles.icon} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IonIcons
              name="grid"
              color={color}
              size={size}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: "absolute",
    backgroundColor: "#000000",
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: "transparent",
    paddingTop: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  icon: {
    position: "relative",
    top: -5,
  },
});
