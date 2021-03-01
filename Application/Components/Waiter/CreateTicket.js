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

const FoodListPane = (props) => {
  return <View></View>;
};

export default class CreatTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItems: [],
      ticketItems: [],
      table: "45",
      getTableNumber: false,
    };
  }
  componentDidMount() {}
  render() {
    return (
      <KeyboardAvoidingView
        behavior="height"
        style={[StyleSheet.absoluteFill, { flex: 1, flexDirection: "row" }]}
      >
        <View
          style={{
            width: Dimensions.get("window").width / 2,
            borderRightWidth: 2,
            borderColor: "black",
            padding: 20,
          }}
        >
          <Headline>{`Order for table #${this.state.table}:`}</Headline>
          <Divider />
        </View>
        <View
          style={{
            position: "relative",
            width: Dimensions.get("window").width / 2,
          }}
        >
          <FoodListPane />
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
