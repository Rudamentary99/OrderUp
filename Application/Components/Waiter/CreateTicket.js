import React from "react";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  NativeModules,
} from "react-native";
import {
  Button,
  Card,
  Dialog,
  Divider,
  Headline,
  Subheading,
  Surface,
  TextInput,
} from "react-native-paper";
import SwipeList from "../helpers/SwipeList";
import { getFoodItems, getFoodTypes } from "../../DB/foodController";
import {
  createOrder,
  getOrderItems,
  updateOrderItems,
} from "../../DB/orderController";
const FoodListPane = (props) => {
  const { foodTypes, foodItems, onSelect, onLongSelect } = props;
  const [selectedFoodType, setSelectedFoodType] = React.useState("Entree");

  return (
    <>
      <View style={{ padding: 20 }}>
        <Headline style={{ textAlign: "center" }}>{selectedFoodType}s</Headline>
        <ScrollView>
          {foodItems
            .filter(({ foodType }) => foodType == selectedFoodType)
            .sort(({ name: a }, { name: b }) => {
              return a < b ? -1 : a > b ? 1 : 0;
            })
            .map((food, index) => (
              <Card
                style={{ margin: 10 }}
                onPress={() => {
                  if (onSelect) onSelect(food);
                }}
                onLongPress={() => {
                  if (onLongSelect) onLongSelect(food);
                }}
              >
                <Card.Title title={food.name}></Card.Title>
                <Card.Content style={{ flexDirection: "row" }}>
                  <Subheading
                    style={{ alignSelf: "flex-end", marginLeft: "auto" }}
                  >
                    ${food.price}
                  </Subheading>
                </Card.Content>
              </Card>
            ))}
        </ScrollView>
      </View>
      <View
        style={{
          position: "absolute",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          bottom: 0,
          left: 0,
          right: 0,
          margin: 20,
        }}
      >
        {foodTypes?.map((type, index) => {
          //   if (index > 3) return;
          return (
            <Button
              disabled={selectedFoodType == type.name}
              compact
              onPress={() => {
                setSelectedFoodType(type.name);
              }}
              labelStyle={{ fontSize: 18 }}
            >
              {type.name}
            </Button>
          );
        })}
      </View>
    </>
  );
};

const TicketListPane = (props) => {
  const { ticketItems, onRemove } = props;
  const [openSwipable, setOpenSwipable] = React.useState(null);
  return (
    <SwipeList
      renderItem={(data) => {
        return (
          <TouchableHighlight
            key={data.item.key}
            onPress={() => console.log("You touched me")}
            style={{
              backgroundColor: "white",
              justifyContent: "center",
              height: 50,
            }}
            underlayColor={"#AAA"}
          >
            <View>
              <Text style={{ fontSize: 19 }}>- {data.item.name}</Text>
            </View>
          </TouchableHighlight>
        );
      }}
      renderHiddenItem={(data, rowMap) => (
        <View
          style={{
            alignItems: "center",
            backgroundColor: "white",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 15,
          }}
        >
          <TouchableOpacity
            style={[
              {
                alignItems: "center",
                bottom: 0,
                justifyContent: "center",
                position: "absolute",
                top: 0,
                width: 75,
              },
              {
                backgroundColor: "red",
                right: 0,
              },
            ]}
            onPress={() => onRemove(data.item)}
          >
            <Text style={{ color: "#FFF" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
      data={ticketItems}
    />
  );
};
class CreateTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItems: [],
      foodTypes: [],
      ticketItems: [],
      table: "",
      getTableNumber: true,
    };
  }
  componentDidMount() {
    getFoodTypes()
      .then((result) => {
        this.setState({ foodTypes: result });
      })
      .catch((err) => {
        console.error(err);
      });
    getFoodItems(false)
      .then((result) => {
        this.setState({ foodItems: result });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { ticketItems } = this.state;
    return (
      <KeyboardAvoidingView
        enabled={false}
        behavior="height"
        style={[StyleSheet.absoluteFill, { flex: 1, flexDirection: "row" }]}
      >
        <Surface
          style={{
            marginTop: 25,
            width: (Dimensions.get("window").width / 10) * 4,
            padding: 20,
          }}
        >
          <TouchableHighlight
            onPress={() => {
              this.setState({ getTableNumber: true });
            }}
          >
            <Headline>{`Order for table #${this.state.table}:`}</Headline>
          </TouchableHighlight>
          <Divider />
          <TicketListPane
            ticketItems={ticketItems}
            onRemove={({ key }) => {
              this.setState({
                ticketItems: ticketItems.filter(
                  ({ key: itemKey }) => itemKey != key
                ),
              });
            }}
          />
          <Subheading>
            Total: $
            {ticketItems.reduce(
              (runningTotal, { price }) => runningTotal + price
            )}
          </Subheading>
          <Button
            onPress={() => {
              createOrder({
                table: this.state.table,
                ticketItems: ticketItems,
                created: Date.now(),
                open: true,
              })
                .then((result) => {
                  if (result) {
                    this.props.navigation.navigate("Open Tickets");
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
            disabled={!this.state.ticketItems.length}
            labelStyle={{ fontSize: 20 }}
          >
            Submit
          </Button>
        </Surface>
        <View
          style={{
            position: "relative",
            width: (Dimensions.get("window").width / 10) * 6,
            margin: 5,
          }}
        >
          <FoodListPane
            foodTypes={this.state.foodTypes}
            foodItems={this.state.foodItems}
            onSelect={(food) => {
              this.setState({
                ticketItems: [
                  ...ticketItems,
                  { ...food, key: food.id + "-" + uuidv4() },
                ],
              });
            }}
          />
        </View>
        <Dialog
          visible={this.state.getTableNumber}
          style={{ marginBottom: 400 }}
        >
          <Dialog.Content>
            <TextInput
              label="Table Number"
              value={this.state.table}
              onChangeText={(text) => {
                this.setState({ table: text });
              }}
              autoFocus
            ></TextInput>
          </Dialog.Content>
          <Dialog.Actions style={{ justifyContent: "center" }}>
            <Button
              onPress={() => {
                this.setState({ getTableNumber: false });
              }}
            >
              Enter
            </Button>
          </Dialog.Actions>
        </Dialog>
      </KeyboardAvoidingView>
    );
  }
}
class EditTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItems: [],
      foodTypes: [],
      ticketItems: [],
      removedItems: [],
      getTableNumber: false,
      table: this.props.route.params.table,
    };
  }
  componentDidMount() {
    getFoodTypes()
      .then((result) => {
        this.setState({ foodTypes: result });
      })
      .catch((err) => {
        console.error(err);
      });
    getFoodItems(false)
      .then((result) => {
        this.setState({ foodItems: result });
      })
      .catch((err) => {
        console.error(err);
      });
    getOrderItems(this.props.route.params.id)
      .then((result) => {
        if (result)
          this.setState({
            ticketItems: result.map((item) => ({
              ...item,
              key: item.id + "-" + uuidv4(),
            })),
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { ticketItems, removedItems } = this.state;
    console.log("removedItems", removedItems);

    return (
      <View
        style={[StyleSheet.absoluteFill, { flex: 1, flexDirection: "row" }]}
      >
        <Surface
          style={{
            marginTop: 25,
            width: (Dimensions.get("window").width / 10) * 4,
            padding: 20,
          }}
        >
          <TouchableHighlight
            onPress={() => {
              this.setState({ getTableNumber: true });
            }}
          >
            <Headline>{`Order for table #${this.state.table}:`}</Headline>
          </TouchableHighlight>
          <Divider />
          <TicketListPane
            ticketItems={ticketItems}
            onRemove={(item) => {
              this.setState({
                ticketItems: ticketItems.filter(
                  ({ key: itemKey }) => itemKey != item.key
                ),
              });
              if (item.id) {
                this.setState({ removedItems: [...removedItems, item] });
              }
            }}
          />
          <Subheading>
            Total: $
            {ticketItems.length
              ? ticketItems.reduce(
                  (runningTotal, { price }) => runningTotal + Number(price)
                )
              : "0.00"}
          </Subheading>
          <Button
            onPress={() => {
              updateOrderItems({
                id: this.props.route.params.id,
                table: this.state.table,
                ticketItems: ticketItems,
                removedItems: removedItems,
              })
                .then((result) => {
                  if (result)
                    this.props.navigation.navigate(
                      "Ticket Details",
                      this.props.route.params
                    );
                  // console.log("result", result);
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
            disabled={!this.state.ticketItems.length}
            labelStyle={{ fontSize: 20 }}
          >
            Submit
          </Button>
        </Surface>
        <View
          style={{
            position: "relative",
            width: (Dimensions.get("window").width / 10) * 6,
            margin: 5,
          }}
        >
          <FoodListPane
            foodTypes={this.state.foodTypes}
            foodItems={this.state.foodItems}
            onSelect={(food) => {
              this.setState({
                ticketItems: [
                  ...ticketItems,
                  { ...food, key: food.id + "-" + uuidv4() },
                ],
              });
            }}
          />
        </View>
        <Dialog
          visible={this.state.getTableNumber}
          style={{ marginBottom: 400 }}
        >
          <Dialog.Content>
            <TextInput
              label="Table Number"
              value={this.state.table}
              onChangeText={(text) => {
                this.setState({ table: text });
              }}
              autoFocus
            ></TextInput>
          </Dialog.Content>
          <Dialog.Actions style={{ justifyContent: "center" }}>
            <Button
              onPress={() => {
                this.setState({ getTableNumber: false });
              }}
            >
              Enter
            </Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    );
  }
}
module.exports = {
  CreateTicket,
  EditTicket,
};
