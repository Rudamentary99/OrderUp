import React from "react";
import { View, ScrollView } from "react-native";
import { Headline, Text } from "react-native-paper";
import { getOrderItems } from "../../DB/orderController";
export default class TicketDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketItems: [],
    };
  }
  componentDidMount() {
    getOrderItems(this.props.route.params.id)
      .then((result) => {
        if (result) {
          this.setState({ ticketItems: result });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { id, table } = this.props.route.params;
    return (
      <View>
        <Headline>Table #{table}'s order</Headline>
        <ScrollView>
          {this.state.ticketItems.map((item) => (
            <Text>{item.name}</Text>
          ))}
        </ScrollView>
      </View>
    );
  }
}
