import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
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

const testItems = [
  { name: "food 1", key: 1 },
  { name: "food 2", key: 2 },
];

const tempScreen = ({ navigation }) => (
  <KeyboardAvoidingView behavior="padding" style={styles.container}>
    <Text>Open up App.js to start working on your app!</Text>
    <StatusBar style="auto" />

    <TagInput items={testItems} itemsKey="key" itemsTitle="name"></TagInput>
    <Button
      onPress={() => {
        navigation.navigate("admin");
      }}
    >
      go to admin
    </Button>
  </KeyboardAvoidingView>
);

export default function App() {
  // console.log("DefaultTheme", DefaultTheme);
  return (
    <PaperProvider>
      <NavigationContainer theme={DefaultTheme}>
        <Portal.Host>
          <Stack.Navigator headerMode="none" initialRouteName="temp">
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
