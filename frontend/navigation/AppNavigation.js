import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import BottomTabNavigator from "./BottomTabNav";
import MoviesVideoPlayer from "../screens/MoviesVideoPlayer";
import MoviesDetailsScreen from "../screens/MoviesDetailsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SplashScreen from "../screens/SplashScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
        <Stack.Screen name="MoviesVideoPlayer" component={MoviesVideoPlayer} />
        <Stack.Screen
          name="MoviesDetailsScreen"
          component={MoviesDetailsScreen}
        />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ animation: "fade" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
