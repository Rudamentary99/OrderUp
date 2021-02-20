import React from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  FAB,
  Headline,
  Modal,
  Text,
  Button,
  Title,
  TextInput,
  Card,
} from "react-native-paper";

export default class ManageFood extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItems: [],
      createFoodItem: false,
      newFoodItem: {
        name: "",
        prepTime: "",
        ingredients: [],
        tags: [],
      },
    };
  }
  render() {
    const { foodItems, createFoodItem, newFoodItem } = this.state;

    const addFoodItem = () => {
      this.setState({
        foodItems: [...foodItems, newFoodItem],
        newFoodItem: null,
      });
    };

    const listFoodItems = () => {
      if (foodItems && foodItems.length) {
        return foodItems.map(({ name, prepTime }) => (
          <Card>
            <Card.Title title={name} subtitle={prepTime}></Card.Title>
          </Card>
        ));
      }

      return (
        <View
          style={{
            padding: 50,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Headline>Looks like you don't have any food yet...</Headline>
        </View>
      );
    };
    const styles = StyleSheet.create({
      input: {
        margin: 10,
      },
    });

    return (
      <View style={{ ...StyleSheet.absoluteFill, padding: 50 }}>
        <Title>Food Items</Title>
        <ScrollView>{listFoodItems()}</ScrollView>
        <FAB
          icon="plus"
          onPress={() => {
            this.setState({ createFoodItem: true });
          }}
          style={{ position: "absolute", right: 0, bottom: 0, margin: 50 }}
        />
        <Modal
          visible={createFoodItem}
          onDismiss={() => {
            this.setState({
              newFoodItem: null,
              createFoodItem: false,
            });
          }}
          contentContainerStyle={{
            position: "relative",
            top: -200,
            backgroundColor: "white",
            padding: 50,
          }}
        >
          <Title>{(newFoodItem && newFoodItem.name) || "New Food Item"}</Title>
          <TextInput
            label="Name"
            value={(newFoodItem && newFoodItem.name) || ""}
            onChangeText={(text) => {
              this.setState({ newFoodItem: { ...newFoodItem, name: text } });
            }}
            style={styles.input}
          />
          <TextInput
            label="Prep Time"
            value={(newFoodItem && newFoodItem.prepTime) || ""}
            onChangeText={(text) => {
              this.setState({
                newFoodItem: { ...newFoodItem, prepTime: text },
              });
            }}
            style={styles.input}
          />
          <Button
            onPress={() => {
              addFoodItem();
              this.setState({ createFoodItem: false });
            }}
          >
            Add
          </Button>
        </Modal>
      </View>
    );
  }
}
