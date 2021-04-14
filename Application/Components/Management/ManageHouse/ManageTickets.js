import react from "react";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Paragraph } from "react-native-paper";
import { getOrders } from "../../../DB/orderController";
import { CustomStyles } from "../../../Styles";
import { Ticket } from "../../Waiter/TicketList";

export function ManageTickets({ navigation }) {
  const [closedTickets, setClosedTickets] = useState([]);
  React.useEffect(() => {
    const listener = navigation.addListener("focus", loadData);
    return listener;
  });
  function loadData() {
    getOrders("closed")
      .then((result) => {
        setClosedTickets(result || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <ScrollView
      contentContainerStyle={[StyleSheet.absoluteFill, CustomStyles.container]}
    >
      <View>
        {closedTickets.map((ticket) => (
          <Ticket ticket={ticket} />
        ))}
      </View>
    </ScrollView>
  );
}
