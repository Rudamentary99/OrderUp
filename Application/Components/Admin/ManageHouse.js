import React from "react";
import { View, StyleSheet } from "react-native";
import RoundButton from "../helpers/RoundButton";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const Tab = createMaterialBottomTabNavigator();

const ManageTable = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Manage Table</Text>
    </View>
  );
};

const ManageHouse = (props) => {
  return (
    <Tab.Navigator initialRouteName="Manage Table" shifting>
      <Tab.Screen
        name="Manage Servers"
        component={ManageTable}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple"
              color={color}
              size={26}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Manage Table"
        component={ManageTable}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="table-furniture"
              color={color}
              size={26}
            />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};
export default ManageHouse;
