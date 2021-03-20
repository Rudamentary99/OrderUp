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
import { useNavigation } from "@react-navigation/native";

const moment = require("moment"); // require
const Tab = createMaterialTopTabNavigator();
const Ticket = ({ ticket }) => {
  const navigation = useNavigation();
  return (
    <Card
      onPress={() => {
        navigation.navigate("Ticket Details", {
          ticket,
          //onBack: this.onBack,
        });
      }}
      style={{ height: 200, width: 200, margin: 20 }}
    >
      <Card.Title title={ticket.table}></Card.Title>
      <Card.Content>
        <Text>{moment(ticket.created).format("hh:mm A, MMM DD, yyyy")}</Text>
        {ticket.closeDate && <Text>Closed</Text>}
      </Card.Content>
    </Card>
  );
};
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
        this.setState({ snackMessage: this.props.route?.params?.snackMessage });
        this.loadData();
      }
    );
    this.intervalID = setInterval(() => this.loadData(), 10 * 1000);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
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
    return (
      <View style={StyleSheet.absoluteFill}>
        {this.state.tickets?.length ? (
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
              {this.state.tickets.map((ticket) => (
                <Ticket key={ticket.id} ticket={ticket} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Headline>You have no {this.props.ticketType} orders.</Headline>
          </View>
        )}
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
