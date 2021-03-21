import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { FoodDetails } from "../Admin/ManageMenu/FoodItem";
import TicketList from "./TicketList";
import { TicketItemDetails } from "../Waiter/TicketItem";
const Stack = createStackNavigator();
const temp = (props) => {
  return (
    <View>
      <Text>HELLO FROM KITCHEN</Text>
    </View>
  );
};

export default KitchenNav = (props) => {
  return (
    <Stack.Navigator initialRouteName="Open Tickets">
      <Stack.Screen name="Open Tickets" component={TicketList} />
      <Stack.Screen name="Food Details" component={TicketItemDetails} />
    </Stack.Navigator>
  );
};
