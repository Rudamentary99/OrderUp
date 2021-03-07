import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  FAB,
  Headline,
  List,
  Snackbar,
  Subheading,
  Text,
} from "react-native-paper";
import { getOrderItems } from "../../DB/orderController";
import moment from "moment";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { getActionFromState } from "@react-navigation/native";
export default class TicketDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketItems: [],
      editOpen: false,
    };
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.loadData();
      }
    );
    this.loadData();
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove;
  }

  loadData() {
    console.log("loading data");
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
    const getAction = () => {
      return {};
    };
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, padding: 50 }}>
        <Subheading>
          {moment(created).format("hh:mm A, MMM DD, yyyy")}
        </Subheading>
        <Headline style={{ marginBottom: 15 }}>Table #{table}'s order</Headline>
        <ScrollView>
          <List.Section>
            {this.state.ticketItems.map((item) => (
              <List.Item key={uuidv4()} title={"- " + item.name}></List.Item>
            ))}
          </List.Section>
        </ScrollView>
        <FAB.Group
          icon="dots-vertical"
          actions={[
            {
              icon: "delete",
              label: "Cancel",
              onPress: () => {
                console.log("archive");
              },
            },
            {
              icon: "check",
              label: "Close",
              onPress: () => {
                console.log("archive");
              },
            },
            {
              icon: "pencil",
              label: "Edit",
              onPress: () => {
                this.props.navigation.navigate(
                  "Edit Ticket",
                  this.props.route.params
                );
              },
            },
          ]}
          open={this.state.editOpen}
          onStateChange={() => {
            this.setState({ editOpen: !this.state.editOpen });
          }}
          style={{ position: "absolute", bottom: 0, right: 0, padding: 50 }}
        />
        <Snackbar
          visible={Boolean(this.state.actionMessage)}
          onDismiss={() => {
            this.setState({ actionMessage: null });
          }}
          action={getAction()}
        />
      </View>
    );
  }
}
