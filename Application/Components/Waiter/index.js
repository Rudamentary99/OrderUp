import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import TicketList from "./TicketList";
import CreateTicket from "./CreateTicket";
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
    <Stack.Navigator initialRouteName="waiter-overview">
      <Stack.Screen name="waiter-overview" component={TicketList} />
      <Stack.Screen name="New Ticket" component={CreateTicket} />
    </Stack.Navigator>
  );
};

export default WaiterNav;
