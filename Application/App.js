import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  DefaultTheme,
  Button,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AdminComponent from "./Components/Admin/index";
import TagInput from "./Components/helpers/TagInput";
const Stack = createStackNavigator();

const tempScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Open up App.js to start working on your app!</Text>
    <StatusBar style="auto" />

    <TagInput></TagInput>
    <Button
      onPress={() => {
        navigation.navigate("admin");
      }}
    >
      go to admin
    </Button>
  </View>
);

export default function App() {
  // console.log("DefaultTheme", DefaultTheme);
  return (
    <PaperProvider>
      <NavigationContainer theme={DefaultTheme}>
        <Portal.Host>
          <Stack.Navigator headerMode="none" initialRouteName="admin">
            <Stack.Screen name="temp" component={tempScreen} />
            <Stack.Screen name="admin" component={AdminComponent} />
          </Stack.Navigator>
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
