import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const tempScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Open up App.js to start working on your app!</Text>
    <StatusBar style="auto" />
    <Button
      mode="contained"
      onPress={() => {
        navigation.navigate("sec");
      }}
    >
      test button
    </Button>
  </View>
);
const secScreen = ({ navigation }) => {
  return (
    <View>
      <Text>This is the other screen</Text>
    </View>
  );
};
export default function App() {
  console.log("connPromise", connPromise);
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="temp">
          <Stack.Screen name="temp" component={tempScreen} />
          <Stack.Screen name="sec" component={secScreen}></Stack.Screen>
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
