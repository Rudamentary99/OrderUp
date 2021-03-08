import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
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
