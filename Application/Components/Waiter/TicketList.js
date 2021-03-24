import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Headline,
  FAB,
  Card,
  Snackbar,
  Subheading,
  IconButton,
  Button,
  Portal,
} from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getOrders } from "../../DB/orderController";
import { useNavigation } from "@react-navigation/native";
import { CustomStyles } from "../../Styles";

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
export default class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      filter: true,
      ticketType: this.props.ticketType || "open",
    };
  }
  componentDidMount() {
    this.focusSubscription = this.props.navigation.addListener("focus", () => {
      this.setState({ snackMessage: this.props.route?.params?.snackMessage });
      this.loadData();
    });
    this.intervalID = setInterval(() => this.loadData(), 10 * 1000);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    this.focusSubscription();
  }

  loadData() {
    getOrders(this.state.ticketType)
      .then((result) => {
        if (result) this.setState({ tickets: result });
        // console.log("result", result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const filter = (ticket) =>
      !this.state.filter ||
      moment(ticket.created).isAfter(moment().startOf("day"));
    return (
      <View
        style={{
          ...StyleSheet.absoluteFill,
        }}
      >
        {/* <View
          style={{
            margin: 20,
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <Button
            mode="contained"
            labelStyle={{ fontSize: 15 }}
            compact
            icon={this.state.filter ? "filter" : "filter-outline"}
            onPress={() => {
              this.setState({ filter: !this.state.filter });
            }}
          >
            Today
          </Button>
        </View> */}

        {this.state.tickets?.length ? (
          this.state.tickets.filter(filter).length ? (
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
                {this.state.tickets.filter(filter).map((ticket) => (
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
              <Headline>
                You have no {this.state.ticketType} orders for
                <Text style={{ textDecorationLine: "underline" }}>today</Text>.
              </Headline>
            </View>
          )
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Headline>You have no {this.state.ticketType} orders.</Headline>
          </View>
        )}

        <FAB
          icon="plus"
          onPress={() => {
            this.props.navigation.navigate("New Ticket");
          }}
          style={CustomStyles.bottomRightAction}
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
// export default function WaiterTicketLists(props) {
//   return (
//     <TicketList ticketType="open" />
//     // <Tab.Navigator initialRouteName="Open">
//     //   <Tab.Screen name="Open">
//     //     {(props) => <TicketList {...props} ticketType="open" />}
//     //   </Tab.Screen>
//     //   <Tab.Screen name="Closed">
//     //     {(props) => <TicketList {...props} ticketType="closed" />}
//     //   </Tab.Screen>
//     // </Tab.Navigator>
//   );
// }
