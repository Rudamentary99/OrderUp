import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import TicketList from "./TicketList";
import { ManageTicket } from "./ManageTicket";
import TicketDetails from "./TicketDetails";
import { customizeItem } from "./CustomizeItem";
import { TicketItemDetails } from "./TicketItem";
const Stack = createStackNavigator();

const temp = (props) => {
  return (
    <View>
      <Text>Hooray!</Text>
    </View>
  );
};

const WaiterNav = () => {
  return (
    <Stack.Navigator initialRouteName="Open Tickets">
      <Stack.Screen name="Open Tickets" component={TicketList} />
      <Stack.Screen name="New Ticket" component={ManageTicket} />
      <Stack.Screen name="Ticket Details" component={TicketDetails} />
      <Stack.Screen name="Edit Ticket" component={ManageTicket} />
      <Stack.Screen name="Customize Item" component={customizeItem} />
      <Stack.Screen name="Food Details" component={TicketItemDetails} />
    </Stack.Navigator>
  );
};

export default WaiterNav;
