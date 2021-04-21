import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

const Tab = createMaterialBottomTabNavigator();
import AdminOverview from "./Overview";
import ManageMenu from "./ManageMenu/ManageMenu";
import ManageHouse from "./ManageHouse/ManageHouse";
import { useTheme } from "@react-navigation/native";
import { Reports } from "./Reports/Report";
const Stack = createStackNavigator();

const AdminNav = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Manage Menu"
      activeColor={colors.primary}
      barStyle={{ backgroundColor: colors.surface }}
      headerMode="none"
      // screenOptions={{
      //   header: MyAppbar,
      // }}
    >
      {/* <Tab.Screen name="admin-overview" component={AdminOverview} /> */}
      <Tab.Screen
        options={{ tabBarIcon: "food" }}
        name="Manage Menu"
        component={ManageMenu}
      />
      <Tab.Screen
        options={{ tabBarIcon: "home" }}
        name="Manage House"
        component={ManageHouse}
      />
      <Tab.Screen
        options={{ tabBarIcon: "poll" }}
        name="Reports"
        component={Reports}
      />
    </Tab.Navigator>
  );
};
export default AdminNav;
