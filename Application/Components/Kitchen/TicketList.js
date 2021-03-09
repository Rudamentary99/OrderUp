import React from "react";
import { View, ScrollView } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { getOpenOrdersFull } from "../../DB/orderController";

const TicketItem = (props) => {
  const { name } = props;
  const [completed, setCompleted] = React.useState(false);
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
    ></List.Item>
  );
};

const Ticket = (props) => {
  const { table, orderItems } = props;
  return (
    <Card style={{ margin: 10 }}>
      <Card.Title title={`#${table}`}></Card.Title>
      <Card.Content>
        <List.Section>
          {orderItems
            .sort((a, b) => a.prepTime - b.prepTime)
            .map(({ id, name }) => (
              <TicketItem key={id} name={name} />
            ))}
        </List.Section>
      </Card.Content>
    </Card>
  );
};

export default class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
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
    this.intervalID = setInterval(() => this.tick(), 1000);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.loadData;
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
      <ScrollView horizontal>
        {this.state.tickets
          .sort((a, b) => a.created - b.created)
          .map((ticket) => (
            <Ticket key={ticket.id} {...ticket} />
          ))}
      </ScrollView>
    );
  }
}
