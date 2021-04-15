import { useNavigation } from "@react-navigation/native";
import react from "react";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Card,
  Headline,
  Menu,
  Paragraph,
  Subheading,
  Text,
} from "react-native-paper";
import { getClosedOrdersFull, getOrders } from "../../../DB/orderController";
import { CustomStyles } from "../../../Styles";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
const moment = require("moment"); // require
const Ticket = ({ ticket }) => {
  const [showQuickAction, setShowQuickAction] = useState(false);
  const navigation = useNavigation();
  return (
    <Menu
      visible={showQuickAction}
      onDismiss={() => {
        setShowQuickAction(false);
      }}
      style={{ marginTop: 100, marginLeft: 20 }}
      anchor={
        <Card
          onPress={() => {
            navigation.navigate("Ticket Details", {
              ticket,
              //onBack: this.onBack,
            });
          }}
          onLongPress={() => {
            setShowQuickAction(true);
          }}
          style={{ height: 200, width: 200, margin: 20 }}
        >
          <Card.Title title={ticket.table}></Card.Title>
          <Card.Content style={{ flexGrow: 1 }}>
            <Text>
              {moment(ticket.created).format("hh:mm A, MMM DD, yyyy")}
            </Text>
            <View style={{ alignSelf: "flex-end", marginTop: "auto" }}>
              <Subheading>
                Closed on{" "}
                {moment(ticket.closeDate).format("hh:mm A, MMM DD, yyyy")}
              </Subheading>
            </View>
          </Card.Content>
        </Card>
      }
    >
      <Menu.Item
        icon="pencil"
        title="Edit"
        onPress={() => {
          setShowQuickAction(false);
          navigation.navigate("Edit Ticket", { ticket });
        }}
      />
      {/* <Menu.Item
        icon="check"
        title="Close"
        onPress={() => {
          closeOrder(id)
            .then((result) => {
              if (result) {
                navigation.navigate("Open Tickets", {
                  snackMessage: "Ticket has been closed",
                });
              } else {
                navigation.navigate("Open Tickets", {
                  snackMessage: "Could not close. :(",
                });
                console.error(result);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }}
      /> */}
    </Menu>
  );
};

export function ManageTickets({ navigation }) {
  const [closedTickets, setClosedTickets] = useState([]);
  React.useEffect(() => {
    const listener = navigation.addListener("focus", loadData);
    const interval = setInterval(loadData, 1000);
    return () => {
      listener();
      clearInterval(interval);
    };
  });
  function loadData() {
    getClosedOrdersFull()
      .then((result) => {
        setClosedTickets(result || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getTicketList() {
    let baseDay = moment();
    return closedTickets
      .sort((a, b) => b.closeDate - a.closeDate)
      .map((ticket) => {
        //console.log("mapping");
        const cd = moment(ticket.closeDate);
        if (cd.isBefore(moment(baseDay).endOf("day"))) {
          baseDay = cd;
          return (
            <View key={uuidv4()}>
              <Subheading key={uuidv4()}>{cd.format("MMM DD")}</Subheading>
              <Ticket key={uuidv4()} ticket={ticket} />
            </View>
          );
        } else {
          return (
            <>
              <Headline>test</Headline>
              <Ticket key={uuidv4()} ticket={ticket} />
            </>
          );
        }
      });
  }

  return (
    <ScrollView
      contentContainerStyle={[StyleSheet.absoluteFill, CustomStyles.container]}
    >
      <View>{getTicketList()}</View>
    </ScrollView>
  );
}
