import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import {
  DefaultTheme,
  Button,
  useTheme,
  TextInput,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as navTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminNav from "./Components/Admin/index";
import WaiterNav from "./Components/Waiter/index";
import KitchenNav from "./Components/Kitchen/index";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const tempScreen = ({ navigation }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text>Test</Text>
    </View>
  );
};

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      card: "rgb(255, 255, 255)",
    },
  };
  console.log("navTheme", navTheme);
  // console.log("DefaultTheme", DefaultTheme);
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Portal.Host>
          <Drawer.Navigator initialRouteName="admin" conten>
            <Drawer.Screen name="temp" component={tempScreen} />
            <Drawer.Screen name="admin" component={AdminNav} />
            <Drawer.Screen name="waiter" component={WaiterNav} />
            <Drawer.Screen name="kitchen" component={KitchenNav} />
          </Drawer.Navigator>
          {/* <Stack.Navigator headerMode="none" initialRouteName="kitchen">
            <Stack.Screen name="temp" component={tempScreen} />
            <Stack.Screen name="admin" component={AdminNav} />
            <Stack.Screen name="waiter" component={WaiterNav} />
            <Stack.Screen name="kitchen" component={KitchenNav} />
          </Stack.Navigator> */}
        </Portal.Host>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
