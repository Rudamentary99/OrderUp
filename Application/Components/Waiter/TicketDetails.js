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
import { CustomStyles } from "../../Styles";
export default class TicketDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketItems: [],
      editOpen: false,
    };
  }
  componentDidMount() {
    this.FocusSubscription = this.props.navigation.addListener("focus", () => {
      this.loadData();
    });
    this.loadData();
  }
  componentWillUnmount() {
    this.FocusSubscription();
  }

  loadData() {
    getOrderItems(this.props.route.params.ticket.id)
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
    const {
      ticket: { id, table, created, closeDate },
      onBack,
    } = this.props.route.params;

    const getDesiption = (item) => {
      let rv = "";
      const excluded = item?.customization?.excludedIngredients;
      if (excluded) {
        excluded.forEach((ingredient) => {
          rv += "no " + ingredient + ", ";
        });
      }
      return rv;
    };
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, padding: 50 }}>
        <Subheading>
          {moment(created).format("hh:mm A, MMM DD, yyyy")}
        </Subheading>
        {closeDate && (
          <Subheading style={{ color: "green" }}>
            <Headline style={{ color: "green" }}>Closed: </Headline>
            {moment(closeDate).format("hh:mm A, MMM DD, yyyy")}
          </Subheading>
        )}
        <Headline style={{ marginBottom: 15 }}>Table #{table}'s order</Headline>
        <ScrollView>
          <List.Section>
            {this.state.ticketItems.map((item) => (
              <List.Item
                key={uuidv4()}
                left={() => (
                  <List.Icon
                    style={{ opacity: 0.5 }}
                    icon={
                      item.completed
                        ? "checkbox-marked-circle-outline"
                        : "checkbox-blank-circle-outline"
                    }
                  />
                )}
                title={item.name + (item.customization?.notes ? "*" : "")}
                description={getDesiption(item)}
                onPress={() => {
                  this.props.navigation.navigate("Food Details", {
                    id: item.id,
                  });
                  console.log(`item`, item);
                }}
              ></List.Item>
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
              label: closeDate ? "Open" : "Close",
              onPress: () => {
                if (closeDate) {
                  openOrder(id)
                    .then((result) => {
                      if (result) {
                        this.props.navigation.navigate("Open", {
                          snackMessage: "Ticket Reopened",
                        });
                      } else {
                        console.log("nawfame");
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                } else {
                  closeOrder(id)
                    .then((result) => {
                      if (result) {
                        this.props.navigation.navigate("Open Tickets", {
                          snackMessage: "Ticket has been closed",
                        });
                      } else {
                        this.setState({ actionMessage: "Could not close. :(" });
                        console.error(result);
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                }
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
          style={CustomStyles.bottomRightActionGroup}
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
                      this.props.navigation.goBack();
                      this.props.navigation.setParams({
                        snackMessage: "Ticket has been canceled.",
                      });
                      // onBack({
                      //   snackMessage: "Ticket has been canceled.",
                      // });

                      // this.props.navigation.navigate("parent", {
                      //   snackMessage: "Ticket has been canceled.",
                      // });
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
