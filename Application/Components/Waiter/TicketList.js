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
    getOpenOrders()
      .then((result) => {
        this.setState({ tickets: result });
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
        <ScrollView>
          {this.state.tickets.map((ticket) => (
            <Card key={ticket.id}>
              <Card.Title title={ticket.table}></Card.Title>
            </Card>
          ))}
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
