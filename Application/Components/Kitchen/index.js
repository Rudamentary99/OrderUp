import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
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
    <Stack.Navigator initialRouteName="temp">
      <Stack.Screen name="temp" component={temp} />
    </Stack.Navigator>
  );
};
