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
import AdminNav from "./Components/Management/index";
import WaiterNav from "./Components/Waiter/index";
import KitchenNav from "./Components/Kitchen/index";
import { Audio } from "expo-av";
import { DeviceSettings } from "./Components/DeviceSettings";
const Drawer = createDrawerNavigator();
const tempScreen = ({ navigation }) => {
  const [sound, setSound] = React.useState();
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./sounds/sharp.mp3")
    );
    // this.setState({ closeSound: sound });
    await sound
      .playAsync()
      .then((result) => {
        console.log(`result`, result);
      })
      .catch((err) => {});
    // console.log(`result`, result);
    //sound.unloadAsync();
  }

  // React.useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log("Unloading Sound");
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text>Test</Text>
      <Button onPress={playSound}>play sound</Button>
    </View>
  );
};

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      accent: "#98ded9",
      primary: "#161d6f",
      card: "rgb(255, 255, 255)",
      text: "#1e212d",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Portal.Host>
          <StatusBar style="dark" />
          <Drawer.Navigator initialRouteName="kitchen">
            {/* <Drawer.Screen name="temp" component={tempScreen} /> */}
            <Drawer.Screen name="Device Settings" component={DeviceSettings} />
            <Drawer.Screen name="Manager" component={AdminNav} />
            <Drawer.Screen name="Waiter" component={WaiterNav} />
            <Drawer.Screen name="Kitchen" component={KitchenNav} />
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
