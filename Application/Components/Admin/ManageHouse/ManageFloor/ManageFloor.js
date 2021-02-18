import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { FAB, Modal, TextInput, Title, Button, Card } from "react-native-paper";
import { createNewFloor, getFloors } from "./FloorController";
import Floor from "./Floor";
import FloorList from "./FloorList";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const ManageFloor = (props) => {
  return (
    <Stack.Navigator initialRouteName="floor-list" headerMode="none">
      <Stack.Screen name="floor-list" component={FloorList} />
    </Stack.Navigator>
  );
};

export default ManageFloor;
