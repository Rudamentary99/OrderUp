import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import {
  Button,
  Dialog,
  Divider,
  Headline,
  Surface,
  TextInput,
  ToggleButton,
} from "react-native-paper";

import { getFoodItems, getFoodTypes } from "../../DB/foodController";

const FoodListPane = (props) => {
  const { foodTypes, foodItems, onSelect } = props;
  const [selectedFoodType, setSelectedFoodType] = React.useState("");

  return (
    <View
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        bottom: 0,
        left: 0,
        right: 0,
        margin: 20,
      }}
    >
      {foodTypes?.map((type) => {
        return (
          <Button disabled={selectedFoodType == type.id} compact>
            {type.name}
          </Button>
        );
      })}
    </View>
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
    return (
      <KeyboardAvoidingView
        behavior="height"
        style={[StyleSheet.absoluteFill, { flex: 1, flexDirection: "row" }]}
      >
        <Surface
          style={{
            width: Dimensions.get("window").width / 2,
            padding: 20,
          }}
        >
          <Headline>{`Order for table #${this.state.table}:`}</Headline>
          <Divider />
        </Surface>
        <View
          style={{
            position: "relative",
            width: Dimensions.get("window").width / 2,
            margin: 5,
          }}
        >
          <FoodListPane foodTypes={this.state.foodTypes} />
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
