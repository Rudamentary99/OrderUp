import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ManageTickets } from "./ManageTickets";
const Stack = createStackNavigator();
const ManageHouse = (props) => {
  const { navigation } = props;

  return (
    <Stack.Navigator>
      <Stack.Screen name="Closed Tickets" component={ManageTickets} />
    </Stack.Navigator>

    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <Text>ManageHouse</Text>
    // </View>
  );
};
export default ManageHouse;
