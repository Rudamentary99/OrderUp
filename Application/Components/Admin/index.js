import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import MyAppbar from "../helpers/myAppBar";
import AdminOverview from "./Overview";
import ManageMenu from "./ManageMenu/ManageMenu";
import ManageHouse from "./ManageHouse";
const Stack = createStackNavigator();

const AdminNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="admin-overview"
      headerMode="none"
      // screenOptions={{
      //   header: MyAppbar,
      // }}
    >
      <Stack.Screen name="admin-overview" component={AdminOverview} />
      <Stack.Screen name="Manage Menu" component={ManageMenu} />
      <Stack.Screen name="Manage House" component={ManageHouse} />
    </Stack.Navigator>
  );
};
export default AdminNav;
