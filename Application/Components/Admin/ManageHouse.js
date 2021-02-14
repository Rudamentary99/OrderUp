import React from "react";
import { View, StyleSheet } from "react-native";
import RoundButton from "../helpers/RoundButton";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Text, BottomNavigation } from "react-native-paper";
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
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "manageWaiters", title: "Manage Servers", icon: "account-multiple" },
    { key: "manageFloors", title: "Manage Floors", icon: "table-furniture" },
  ]);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={BottomNavigation.SceneMap({
        manageWaiters: ManageTable,
        manageFloors: ManageTable,
      })}
      shifting
    />
  );
};
export default ManageHouse;
