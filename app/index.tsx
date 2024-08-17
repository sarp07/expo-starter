import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ThirdwebProvider } from "thirdweb/react";
import { NavigationContainer } from "@react-navigation/native";

import { useColorScheme } from "@/hooks/useColorScheme";
import Start from "./screens/Start";
import Login from "./screens/Login";
import OTP from "./screens/Start2";
import Main from "./screens/Main";
import Deposit from "./screens/Deposit";
import SendEnterAmount from "./screens/SendNative";
import NotFoundScreen from "./screens/+not-found";
import { WalletProvider } from "./context/walletProvider";
import Starter from "./screens/Starter";
import PasskeyLogin from "./screens/PasskeyLogin";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThirdwebProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <WalletProvider>
          <Stack.Navigator>
            <Stack.Screen
              name="Start"
              component={Start}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Start2"
              component={OTP}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              component={Main}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SendEnterAmount"
              component={SendEnterAmount}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PasskeyLogin"
              component={PasskeyLogin}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Starter"
              component={Starter}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Deposit"
              component={Deposit}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </WalletProvider>
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
