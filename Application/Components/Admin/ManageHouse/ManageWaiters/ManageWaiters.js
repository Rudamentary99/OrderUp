import React from "react";
import { ScrollView } from "react-native";
import { Text, Card, Title, Paragraph } from "react-native-paper";

const ManageWaiters = (props) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Manage Waiters</Text>
    </ScrollView>
  );
};
export default ManageWaiters;
