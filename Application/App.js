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
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AdminComponent from "./Components/Admin/index";
import TagInput from "./Components/helpers/TagInput";

import DropDown from "react-native-paper-dropdown";
const Stack = createStackNavigator();

const testItems = [
  { name: "food 1", key: 1 },
  { name: "food 2", key: 2 },
];

const tempScreen = ({ navigation }) => {
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [gender, setGender] = React.useState();
  const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "others" },
  ];
  const theme = useTheme();
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <SafeAreaView style={styles.containerStyle}>
        <DropDown
          label={"Gender"}
          mode={"flat"}
          value={gender}
          setValue={setGender}
          list={genderList}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          inputProps={{
            right: <TextInput.Icon name={"menu-down"} />,
          }}
          theme={theme}
        />
      </SafeAreaView>
      <StatusBar style="auto" />

      {/* <TagInput items={testItems} itemsKey="key" itemsTitle="name"></TagInput> */}
      <Button
        onPress={() => {
          navigation.navigate("admin");
        }}
      >
        go to admin
      </Button>
    </KeyboardAvoidingView>
  );
};

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
