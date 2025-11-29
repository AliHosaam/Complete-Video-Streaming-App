import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import BottomTabNavigator from "./BottomTabNav";
import MoviesVideoPlayer from "../screens/MoviesVideoPlayer";
import MoviesDetailsScreen from "../screens/MoviesDetailsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SplashScreen from "../screens/SplashScreen";
import ShowsTabNavigator from "./ShowsTabNav";
import ShowsDetailsScreen from "../screens/ShowsDetailsScreen";
import ShowsVideoPlayer from "../screens/ShowsVideoPlayer";
import ShowsHistoryScreen from "../screens/ShowsHistoryScreen";

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
        <Stack.Screen
          name="MoviesVideoPlayer"
          component={MoviesVideoPlayer}
          options={{ gestureEnabled: false }}
        />
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
        <Stack.Screen
          name="ShowsTabNavigator"
          component={ShowsTabNavigator}
          options={{
            animation: "slide_from_bottom",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ShowsDetailsScreen"
          component={ShowsDetailsScreen}
        />
        <Stack.Screen
          name="ShowsVideoPlayer"
          component={ShowsVideoPlayer}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="ShowsHistoryScreen"
          component={ShowsHistoryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
