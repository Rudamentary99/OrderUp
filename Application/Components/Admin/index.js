import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AdminOverview from "./Overview";
import ManageMenu from "./ManageMenu";
import ManageHouse from "./ManageHouse";
const Stack = createStackNavigator();

const AdminComponent = () => {
  return (
    <Stack.Navigator initialRouteName="Manage House">
      <Stack.Screen name="admin-overview" component={AdminOverview} />
      <Stack.Screen name="Manage Menu" component={ManageMenu} />
      <Stack.Screen name="Manage House" component={ManageHouse} />
    </Stack.Navigator>
  );
};
export default AdminComponent;
