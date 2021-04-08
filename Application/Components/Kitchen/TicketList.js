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
  useTheme,
  IconButton,
  Chip,
} from "react-native-paper";
import { getOpenOrdersFull, updateOrderItem } from "../../DB/orderController";
import {
  FlingGestureHandler,
  Directions,
  TouchableHighlight,
} from "react-native-gesture-handler";
import { Audio } from "expo-av";
import { closeOrder } from "../../DB/orderController";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { TagChip } from "../helpers/Tag";
import { getData } from "../../Storage";
const TicketItem = (props) => {
  const {
    food: { id, name, customization, tags },
    // timeElapsed,
  } = props;
  const [completed] = React.useState(props.food.completed);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const getDescription = () => {
    let rv = "";
    if (customization?.excludedIngredients?.length) {
      customization.excludedIngredients.forEach((ingredient) => {
        rv += ` no ${ingredient},\n`;
      });
    }
    if (customization?.notes) {
      rv += `\n${customization.notes}`;
    }
    return rv;
  };
  return (
    <View>
      <List.Item
        left={() => (
          <IconButton
            onPress={() => {
              updateOrderItem(id, {
                completed: !completed,
              }).catch((err) => {
                console.error(err);
              });
            }}
            icon={
              completed
                ? "checkbox-marked-circle-outline"
                : "checkbox-blank-circle-outline"
            }
          />
        )}
        title={name}
        description={getDescription()}
        onPress={() => {
          //setCompleted(!completed);
          navigation.navigate("Food Details", {
            id: id,
          });
        }}
        onLongPress={() => {
          navigation.navigate("Food Details", {
            id: id,
          });
        }}
        descriptionStyle={{ color: colors.notification }}
      />
      <View
        style={{
          display: customization?.customTags ? "flex" : "none",
          flexDirection: "row",
          paddingLeft: 20,
        }}
      >
        {tags
          ?.filter(
            (tag) => !customization?.customTags.find(({ id }) => tag.id == id)
          )
          .map((tag) => (
            <Chip key={uuidv4()} disabled>
              {tag.name}
            </Chip>
          ))}
        {customization?.customTags
          ?.filter((customTag) => !tags.find(({ id }) => customTag.id == id))
          ?.map((customTag) => (
            <Chip key={uuidv4()} style={{ display: customTag }}>
              {customTag.name}
            </Chip>
          ))}
      </View>
    </View>
  );
};

const Ticket = (props) => {
  const [animation, setAnimation] = React.useState("");
  const {
    ticket: { id, table, orderItems, created },
    filterTags,
    onClose,
  } = props;
  const [duration, setDuration] = React.useState(getDuration());
  const { colors } = useTheme();
  // console.log(`theme`, theme);
  function getDuration() {
    let total = (orderItems.length &&
      orderItems.reduce((total, item) => {
        return { prepTime: total.prepTime + item.prepTime };
      })) || { prepTime: 0 };
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
        <Card style={{ margin: 10, width: 300, maxHeight: "97%" }}>
          <Card.Content style={{ position: "relative" }}>
            <Card.Title title={`#${table}`}></Card.Title>

            <Subheading
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: 22,
                color:
                  duration - moment().subtract(created) > 0
                    ? colors.text
                    : colors.notification,
              }}
            >
              {moment
                .duration(duration - moment().subtract(created))
                .format("hh:mm:ss")}
            </Subheading>

            <ScrollView style={{ height: "90%" }}>
              <List.Section>
                {orderItems.length ? (
                  orderItems

                    .sort((a, b) => a.prepTime - b.prepTime)
                    .map((food) => <TicketItem key={uuidv4()} food={food} />)
                ) : (
                  <List.Item
                    titleStyle={{
                      color: colors.secondary,
                      fontStyle: "italic",
                    }}
                    title="no items entered..."
                  ></List.Item>
                )}
              </List.Section>
            </ScrollView>
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
      filterTags: [],
    };
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.setState({ snackMessage: this.props.route?.params?.snackMessage });
        this.loadData();
        getData("filterTags")
          .then((result) => {
            if (result) {
              this.setState({ filterTags: result });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    );
    this.dataInterval = setInterval(() => this.loadData(), 1000);
    // this.tickInterval = setInterval(() => this.tick(), 1000);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.dataInterval);
    this.state?.sound?.unloadAsync();
  }
  tick() {
    this.setState({ timeElapsed: this.state.timeElapsed + 1000 });
  }
  loadData() {
    getOpenOrdersFull()
      .then((result) => {
        if (result)
          result?.forEach((ticket) => {
            if (!this.state.tickets.find(({ id }) => id == ticket.id)) {
              this.playNewTicketSound();
            }
          });

        this.setState({ tickets: result || [] });
        // console.log("result", result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async playCloseSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../sounds/archivedFood.mp3")
    );
    this.setState({ sound: sound });
    await sound.playAsync();
  }
  async playNewTicketSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../sounds/newOrder.mp3")
    );
    this.setState({ sound: sound });
    await sound.playAsync();
  }
  render() {
    const { filterTags, tickets } = this.state;
    const filteredTickets = tickets
      .map((ticket) => ({
        ...ticket,
        orderItems: ticket.orderItems.filter((item) => {
          // console.log(`item`, item);
          if (filterTags?.length) {
            if (item?.tags || item?.customization?.customTags) {
              let rv = false;
              const tags = item?.customization?.customTags || item?.tags;
              filterTags?.forEach((ft) => {
                if (tags.find((tag) => tag.id == ft.id)) {
                  rv = true;
                  return;
                }
              });
              return rv;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }),
      }))
      .filter((ticket) => ticket?.orderItems?.length);
    return (
      <View style={StyleSheet.absoluteFill}>
        {filteredTickets.length ? (
          <ScrollView horizontal>
            <View style={{ flexDirection: "row" }}>
              {filteredTickets
                .sort((a, b) => a.created - b.created)
                .map((ticket) => (
                  <Ticket
                    key={ticket.id}
                    ticket={{
                      ...ticket,
                    }}
                    onClose={(pId) => {
                      this.playCloseSound();
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
                        tickets: this.state.tickets.filter(
                          ({ id }) => id != pId
                        ),
                      });
                    }}
                  />
                ))}
            </View>
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
