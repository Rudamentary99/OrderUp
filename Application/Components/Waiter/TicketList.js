import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Headline, FAB } from "react-native-paper";

export default class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
    };
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Headline>Hello from list</Headline>
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
