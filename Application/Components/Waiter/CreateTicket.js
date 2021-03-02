import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Button,
  Card,
  Dialog,
  Divider,
  Headline,
  Surface,
  TextInput,
  ToggleButton,
} from "react-native-paper";
import SwipeList from "../helpers/SwipeList";
import { getFoodItems, getFoodTypes } from "../../DB/foodController";

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
  const { ticketItems } = props;
  const [openSwipable, setOpenSwipable] = React.useState(null);
  return (
    <SwipeList
      renderItem={(data) => {
        console.log("data", data);
        return (
          <TouchableHighlight
            onPress={() => console.log("You touched me")}
            style={{
              alignItems: "center",
              backgroundColor: "white",
              borderBottomColor: "black",
              borderBottomWidth: 1,
              justifyContent: "center",
              height: 50,
            }}
            underlayColor={"#AAA"}
          >
            <View>
              <Text>{data.item.name}</Text>
            </View>
          </TouchableHighlight>
        );
      }}
      renderHiddenItem={(data, rowMap) => (
        <View
          style={{
            alignItems: "center",
            backgroundColor: "#DDD",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 15,
          }}
        >
          <Text>Left</Text>
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
                backgroundColor: "blue",
                right: 75,
              },
            ]}
            onPress={() => closeRow(rowMap, data.item.key)}
          >
            <Text style={{ color: "#FFF" }}>Close</Text>
          </TouchableOpacity>
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
            onPress={() => deleteRow(rowMap, data.item.key)}
          >
            <Text style={{ color: "#FFF" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      data={ticketItems}
    />
  );
};

export default class CreatTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItems: [],
      foodTypes: [],
      ticketItems: [],
      table: "45",
      getTableNumber: false,
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
        behavior="height"
        style={[StyleSheet.absoluteFill, { flex: 1, flexDirection: "row" }]}
      >
        <Surface
          style={{
            width: (Dimensions.get("window").width / 10) * 4,
            padding: 20,
          }}
        >
          <Headline>{`Order for table #${this.state.table}:`}</Headline>
          <Divider />
          <TicketListPane ticketItems={ticketItems} />
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
              this.setState({ ticketItems: [...ticketItems, food] });
            }}
          />
        </View>
        <Dialog visible={this.state.getTableNumber}>
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
