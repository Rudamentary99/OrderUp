import React from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { FoodDetails } from "../Management/ManageMenu/FoodItem";
import TicketList from "./TicketList";
import { TicketItemDetails } from "../Waiter/TicketItem";
import { KitchenSettings } from "./settings";
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
      <Stack.Screen
        name="Open Tickets"
        component={TicketList}
        options={({ navigation }) => ({
          headerRight: () => (
            <IconButton
              icon="cog"
              onPress={() => {
                navigation.navigate("Settings");
              }}
            />
          ),
        })}
      />
      <Stack.Screen name="Food Details" component={TicketItemDetails} />
      <Stack.Screen name="Settings" component={KitchenSettings} />
    </Stack.Navigator>
  );
};
