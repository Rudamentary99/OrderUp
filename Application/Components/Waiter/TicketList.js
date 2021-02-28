import React from "react";
import { View } from "react-native";
import { Text, Headline } from "react-native-paper";

export default class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
    };
  }

  render() {
    return (
      <View>
        <Headline>Hello from list</Headline>
      </View>
    );
  }
}
