import React from "react";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Headline, List, Snackbar, Text } from "react-native-paper";
import { getOpenOrdersFull } from "../../DB/orderController";
import { FlingGestureHandler, Directions } from "react-native-gesture-handler";
import { closeOrder } from "../../DB/orderController";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
const TicketItem = (props) => {
  const {
    food: { name, foodID },
  } = props;
  const [completed, setCompleted] = React.useState(false);
  const navigation = useNavigation();
  return (
    <List.Item
      left={() => (
        <List.Icon
          icon={
            completed
              ? "checkbox-marked-circle-outline"
              : "checkbox-blank-circle-outline"
          }
        />
      )}
      title={name}
      onPress={() => {
        setCompleted(!completed);
      }}
      onLongPress={() => {
        navigation.navigate("Food Details", {
          id: foodID,
          noEdit: true,
        });
      }}
    ></List.Item>
  );
};

const Ticket = (props) => {
  const [animation, setAnimation] = React.useState("");
  const { id, table, orderItems, onClose } = props;
  //console.log("id", id);
  return (
    <FlingGestureHandler
      direction={Directions.DOWN}
      onHandlerStateChange={() => {
        setAnimation("fadeOutDown");
      }}
    >
      <Animatable.View
        animation={animation}
        duration={500}
        onAnimationEnd={() => {
          onClose(id);
        }}
      >
        <Card style={{ margin: 10 }}>
          <Card.Title title={`#${table}`}></Card.Title>
          <Card.Content>
            <List.Section>
              {orderItems
                .sort((a, b) => a.prepTime - b.prepTime)
                .map((food) => (
                  <TicketItem key={uuidv4()} food={food} />
                ))}
            </List.Section>
          </Card.Content>
        </Card>
      </Animatable.View>
    </FlingGestureHandler>
  );
};

export default class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      snackMessage: null,
    };
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.setState({ snackMessage: this.props.route?.params?.snackMessage });
        this.loadData();
      }
    );
    this.intervalID = setInterval(() => this.tick(), 5 * 1000);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.loadData();
  }
  loadData() {
    getOpenOrdersFull()
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
        {this.state.tickets.length ? (
          <ScrollView horizontal>
            {this.state.tickets
              .sort((a, b) => a.created - b.created)
              .map((ticket) => (
                <Ticket
                  key={ticket.id}
                  {...ticket}
                  onClose={(pId) => {
                    closeOrder(pId)
                      .then((result) => {
                        if (result)
                          this.setState({ snackMessage: "Ticket Closed!" });
                        else
                          this.setState({
                            snackMessage: "something went wrong! :'(",
                          });
                      })
                      .catch((err) => {});
                    this.setState({
                      tickets: this.state.tickets.filter(({ id }) => id != pId),
                    });
                  }}
                />
              ))}
          </ScrollView>
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Headline>You're all caught up! :)</Headline>
          </View>
        )}
        <Snackbar
          visible={this.state.snackMessage}
          duration={3000}
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
