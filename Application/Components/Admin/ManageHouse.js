import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RoundButton from "../helpers/RoundButton";
const ManageHouse = (props) => {
  const { navigation } = props;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ManageHouse</Text>
      <RoundButton
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          margin: 50,
          height: 100,
          width: 100,
        }}
        onPress={() => {
          navigation.navigate("admin-overview");
        }}
      >
        +
      </RoundButton>
    </View>
  );
};
export default ManageHouse;
