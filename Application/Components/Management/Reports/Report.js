import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { PurchaseHistory } from "./PurchaseHistory";
import { FoodDetails, FoodItem } from "../ManageMenu/FoodItem";
const Stack = createStackNavigator();

export function Reports(props) {
  return (
    <Stack.Navigator initialRouteName="Purchase History">
      <Stack.Screen name="Purchase History" component={PurchaseHistory} />
      <Stack.Screen name="Food Details" component={FoodDetails} />
    </Stack.Navigator>
  );
}
