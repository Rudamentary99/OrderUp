import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { FAB, Headline, List, Subheading, Text } from "react-native-paper";
import { getOrderItems } from "../../DB/orderController";
import moment from "moment";
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
    const { id, table, created } = this.props.route.params;
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, padding: 50 }}>
        <Subheading>
          {moment(created).format("hh:mm A, MMM DD, yyyy")}
        </Subheading>
        <Headline style={{ marginBottom: 15 }}>Table #{table}'s order</Headline>
        <ScrollView>
          <List.Section>
            {this.state.ticketItems.map((item) => (
              <List.Item title={"- " + item.name}></List.Item>
            ))}
          </List.Section>
        </ScrollView>
        <FAB
          icon="pencil"
          onPress={() => {
            this.props.navigation.navigate(
              "Edit Ticket",
              this.props.route.params
            );
          }}
          style={{ position: "absolute", bottom: 0, right: 0, margin: 50 }}
        />
      </View>
    );
  }
}
