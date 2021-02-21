import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  DefaultTheme,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AdminComponent from "./Components/Admin/index";
const Stack = createStackNavigator();

const tempScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Open up App.js to start working on your app!</Text>
    <StatusBar style="auto" />
    <Button
      mode="contained"
      onPress={() => {
        navigation.navigate("admin");
      }}
    >
      go to admin
    </Button>
  </View>
);

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer theme={DefaultTheme}>
        <Stack.Navigator headerMode="none" initialRouteName="admin">
          <Stack.Screen name="temp" component={tempScreen} />
          <Stack.Screen name="admin" component={AdminComponent} />
        </Stack.Navigator>
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
