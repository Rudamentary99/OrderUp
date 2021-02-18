import React from "react";

import FloorList from "./FloorList";
import FloorDetails from "./FloorDetails";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const ManageFloor = (props) => {
  return (
    <Stack.Navigator initialRouteName="floor-list" headerMode="none">
      <Stack.Screen name="floor-list" component={FloorList} />
      <Stack.Screen name="floor-details" component={FloorDetails} />
    </Stack.Navigator>
  );
};

export default ManageFloor;
