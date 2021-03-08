import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Dialog,
  FAB,
  Headline,
  List,
  Button,
  Paragraph,
  Snackbar,
  Subheading,
  Text,
  Portal,
} from "react-native-paper";
import {
  getOrderItems,
  closeOrder,
  openOrder,
  cancelOrder,
} from "../../DB/orderController";
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
                this.setState({ confirm: true });
              },
            },
            {
              icon: "check",
              label: "Close",
              onPress: () => {
                closeOrder(id)
                  .then((result) => {
                    if (result) {
                      this.setState({
                        actionMessage: "Ticket has been closed",
                        // action: {
                        //   label: "Undo",
                        //   onPress: () => {
                        //     openOrder(id)
                        //       .then((res) => {
                        //         if (res.status == 200) {
                        //           this.setState({
                        //             actionMessage: "Ticket has been re-opened",
                        //           });
                        //         } else {
                        //           this.setState({
                        //             actionMessage: "Could not undo",
                        //           });
                        //           console.error(res);
                        //         }
                        //       })
                        //       .catch((err) => {
                        //         console.error(err);
                        //         this.setState({
                        //           actionMessage: "Could not undo",
                        //         });
                        //       });
                        //   },
                        // },
                      });
                    } else {
                      this.setState({ actionMessage: "Could not close. :(" });
                      console.error(result);
                    }
                  })
                  .catch((err) => {});
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
        <Dialog
          visible={this.state.confirm}
          onDismiss={() => {
            this.setState({ confirm: false });
          }}
        >
          <Dialog.Title>Cancel Ticket</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to do this action?
              <Text> This cannot be undone.</Text>
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                this.setState({ confirm: false });
                cancelOrder(id)
                  .then((result) => {
                    if (result) {
                      this.props.navigation.navigate("Open Tickets", {
                        snackMessage: "Ticket has been canceled.",
                      });
                    } else
                      this.setState({ actionMessage: "Something went wrong!" });
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}
            >
              Do it
            </Button>
            <Button
              onPress={() => {
                this.setState({ confirm: false });
              }}
            >
              Nevermind
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Portal>
          <Snackbar
            visible={Boolean(this.state.actionMessage)}
            onDismiss={() => {
              this.setState({ actionMessage: null });
            }}
            action={this.state.action}
          >
            {this.state.actionMessage}
          </Snackbar>
        </Portal>
      </View>
    );
  }
}
