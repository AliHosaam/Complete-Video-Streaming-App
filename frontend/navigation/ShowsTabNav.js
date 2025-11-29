import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import ShowsScreen from "../screens/ShowsScreen";
import ShowsSearchScreen from "../screens/ShowsSearchScreen";
import ShowsMoreScreen from "../screens/ShowsMoreScreen";

const Tab = createBottomTabNavigator();

export default function ShowsTabNavigator() {
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
        component={ShowsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} style={styles.icon} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={ShowsSearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} style={styles.icon} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={ShowsMoreScreen}
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
