import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { PurchaseHistory } from "./PurchaseHistory";
const Stack = createStackNavigator();

export function Reports(props) {
  return (
    <Stack.Navigator initialRouteName="Purchase History">
      <Stack.Screen name="Purchase History" component={PurchaseHistory} />
    </Stack.Navigator>
  );
}
