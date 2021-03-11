import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Headline,
  FAB,
  Card,
  Snackbar,
  Subheading,
} from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getOrders } from "../../DB/orderController";
const moment = require("moment"); // require
const Tab = createMaterialTopTabNavigator();
class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
    };
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        console.log(
          " this.props.route?.params?.snackMessage ",
          this.props.route?.params?.snackMessage
        );
        this.setState({ snackMessage: this.props.route?.params?.snackMessage });
        this.loadData();
      }
    );
    this.intervalID = setInterval(() => this.tick(), 10 * 1000);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.loadData();
  }
  loadData() {
    getOrders(this.props.ticketType)
      .then((result) => {
        if (result) this.setState({ tickets: result });
        // console.log("result", result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const getDate = (dateInMilli) => {
      return new moment(dateInMilli).format("hh:mm A, MMM DD, yyyy");
    };

    return (
      <View style={StyleSheet.absoluteFill}>
        <ScrollView
          style={{
            position: "relative",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
        >
          <View
            style={{
              position: "relative",
              right: 0,
              left: 0,
              flexWrap: "wrap",
              flexDirection: "row",
              //backgroundColor: "#f59042",
            }}
          >
            {this.state?.tickets?.length ? (
              this.state.tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  onPress={() => {
                    this.props.navigation.navigate("Ticket Details", ticket);
                  }}
                  style={{ height: 200, width: 200, margin: 20 }}
                >
                  <Card.Title title={ticket.table}></Card.Title>
                  <Card.Content>
                    <Text>{getDate(ticket.created)}</Text>
                    {ticket.closeDate && <Text>Closed</Text>}
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Subheading style={{ margin: 50 }}>
                You have no open orders.
              </Subheading>
            )}
          </View>
        </ScrollView>
        <FAB
          icon="plus"
          onPress={() => {
            this.props.navigation.navigate("New Ticket");
          }}
          style={{ position: "absolute", bottom: 0, right: 0, margin: 50 }}
        />
        <Snackbar
          visible={this.state.snackMessage}
          onDismiss={() => {
            this.setState({ snackMessage: null });
          }}
        >
          {this.state.snackMessage}
        </Snackbar>
      </View>
    );
  }
}
export default function WaiterTicketLists(props) {
  return (
    <Tab.Navigator initialRouteName="Open">
      <Tab.Screen name="Open">
        {(props) => <TicketList {...props} ticketType="open" />}
      </Tab.Screen>
      <Tab.Screen name="Closed">
        {(props) => <TicketList {...props} ticketType="closed" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
