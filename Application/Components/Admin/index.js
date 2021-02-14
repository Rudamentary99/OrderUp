import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AdminOverview from "./Overview";
import ManageMenu from "./ManageMenu";

const Stack = createStackNavigator();

const AdminComponent = () => {
  return (
    <Stack.Navigator initialRouteName="admin-overview">
      <Stack.Screen
        name="admin-overview"
        component={AdminOverview}
      ></Stack.Screen>
      <Stack.Screen name="Manage Menu" component={ManageMenu}></Stack.Screen>
    </Stack.Navigator>
  );
};
export default AdminComponent;
