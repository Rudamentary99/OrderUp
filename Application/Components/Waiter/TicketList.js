import React from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, Headline, FAB, Card } from "react-native-paper";
import { getOpenOrders } from "../../DB/orderController";
export default class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
    };
  }
  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 1000);
  }
  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    getOpenOrders()
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
        <Headline>Hello from list</Headline>
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
              <Card
                key={ticket.id}
                style={{ height: 200, width: 200, margin: 20 }}
              >
                <Card.Title title={ticket.table}></Card.Title>
              </Card>
            ))}
          </View>
        </ScrollView>
        <FAB
          icon="plus"
          onPress={() => {
            this.props.navigation.navigate("New Ticket");
          }}
          style={{ position: "absolute", bottom: 0, right: 0, margin: 50 }}
        />
      </View>
    );
  }
}
