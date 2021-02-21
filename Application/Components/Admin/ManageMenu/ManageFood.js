import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  FAB,
  Headline,
  Modal,
  Text,
  Button,
  IconButton,
  Title,
  TextInput,
  Card,
  Menu,
} from "react-native-paper";
import TagInput from "../../helpers/TagInput";
import { getFoodItems, createFoodItem } from "./foodController";
const Stack = createStackNavigator();
const MenuBar = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <View
      style={{
        position: "relative",
        flexDirection: "row",
      }}
    >
      <IconButton compact disabled icon="magnify"></IconButton>
      <IconButton icon="filter" compact disabled></IconButton>
      <Menu
        visible={isMenuOpen}
        onDismiss={() => setIsMenuOpen(false)}
        style={{
          marginLeft: "auto",
        }}
        anchor={
          <IconButton
            disabled
            compact
            icon="cog"
            onPress={() => setIsMenuOpen(true)}
          ></IconButton>
        }
      >
        <Menu.Item
          title="Manage Food Types"
          onPress={() => {
            setIsMenuOpen(false);
            navigation.navigate("temp");
          }}
        ></Menu.Item>
      </Menu>
    </View>
  );
};
class FoodMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItems: [],
      doCreateFoodItem: false,
      newFoodItem: {
        name: "",
        prepTime: "",
        ingredients: [],
        tags: [],
      },
    };
  }
  componentDidMount() {
    getFoodItems()
      .then((result) => {
        //console.log("result", result);
        this.setState({ foodItems: result });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { foodItems, doCreateFoodItem, newFoodItem } = this.state;

    const addFoodItem = () => {
      const newID = createFoodItem(newFoodItem);
      this.setState({
        foodItems: [...foodItems, { ...newFoodItem, id: newID }],
        newFoodItem: null,
      });
    };

    const listFoodItems = () => {
      if (foodItems && foodItems.length) {
        return foodItems.map(({ id, name, prepTime }) => (
          <Card key={id}>
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
      <View style={{ ...StyleSheet.absoluteFill, padding: 50, paddingTop: 0 }}>
        <MenuBar navigation={this.props.navigation}></MenuBar>
        <Title>Food Items</Title>
        <ScrollView>{listFoodItems()}</ScrollView>
        <FAB
          icon="plus"
          onPress={() => {
            this.setState({ doCreateFoodItem: true });
          }}
          style={{ position: "absolute", right: 0, bottom: 0, margin: 50 }}
        />
        <Modal
          visible={doCreateFoodItem}
          onDismiss={() => {
            this.setState({
              newFoodItem: null,
              doCreateFoodItem: false,
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
              this.setState({ doCreateFoodItem: false });
            }}
          >
            Add
          </Button>
        </Modal>
      </View>
    );
  }
}

export default function ManageFood(props) {
  return (
    <Stack.Navigator initialRouteName="main" headerMode="none">
      <Stack.Screen name="main" component={FoodMain} />
    </Stack.Navigator>
  );
}
