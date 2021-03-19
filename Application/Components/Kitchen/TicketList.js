import React from "react";
import moment from "moment";
import momenDurationFormatSetup from "moment-duration-format";
momenDurationFormatSetup(moment);
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Card,
  Headline,
  List,
  Snackbar,
  Text,
  Subheading,
  Button,
} from "react-native-paper";
import { getOpenOrdersFull, updateOrderItem } from "../../DB/orderController";
import { FlingGestureHandler, Directions } from "react-native-gesture-handler";
import { closeOrder } from "../../DB/orderController";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
const TicketItem = (props) => {
  const {
    food: { id, name, foodID, prepTime, completionTime },
    timeElapsed,
  } = props;
  const [completed, setCompleted] = React.useState(props.food.completed);

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
      right={(params) => {
        return (
          <Text
            style={{
              paddingTop: 20,
              marginLeft: 15,
              textAlign: "right",
              justifyContent: "flex-end",
              color: completed
                ? "green"
                : prepTime - timeElapsed <= 0
                ? "red"
                : "",
            }}
          >
            {(completed &&
              moment.duration(completionTime).format("hh:mm:ss")) ||
              moment.duration(prepTime - timeElapsed).format("hh:mm:ss")}
          </Text>
        );
      }}
      onPress={() => {
        //setCompleted(!completed);
        updateOrderItem(id, {
          completed: !completed,
          completionTime: prepTime - timeElapsed,
        }).catch((err) => {
          console.error(err);
        });
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
  const { id, table, orderItems, onCloseElapsed, created } = props;
  const [duration, setDuration] = React.useState(getDuration());

  function getDuration() {
    let total = orderItems.reduce((total, item) => {
      return { prepTime: total.prepTime + item.prepTime };
    });
    return total.prepTime;
  }
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
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Card.Title title={`#${table}`}></Card.Title>
              <Subheading>
                {moment
                  .duration(duration - moment().subtract(created))
                  .format("hh:mm:ss")}
              </Subheading>
            </View>
            <List.Section>
              {orderItems
                .sort((a, b) => a.prepTime - b.prepTime)
                .map((food) => (
                  <TicketItem
                    key={uuidv4()}
                    food={food}
                    timeElapsed={moment().subtract(created)}
                  />
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
      timeElapsed: 0,
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
    this.dataInterval = setInterval(() => this.loadData(), 1000);
    // this.tickInterval = setInterval(() => this.tick(), 1000);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.dataInterval);
  }
  tick() {
    this.setState({ timeElapsed: this.state.timeElapsed + 1000 });
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
        <Button
          onPress={(params) => {
            this.setState({ timeElapsed: 0 });
          }}
        >
          reset Time
        </Button>
        {this.state.tickets.length ? (
          <ScrollView horizontal>
            {this.state.tickets
              .sort((a, b) => a.created - b.created)
              .map((ticket) => (
                <Ticket
                  key={ticket.id}
                  {...ticket}
                  timeElapsed={this.state.timeElapsed}
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
