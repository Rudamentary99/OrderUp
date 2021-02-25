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
  HelperText,
  Snackbar,
  Portal,
} from "react-native-paper";
import TagInput from "../../helpers/TagInput";
import { getFoodItems, createFoodItem, updateFoodItem } from "./foodController";
import CreateFoodItem from "./CreateFoodItem";
import FoodItem from "./FoodItem";
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
        archived: false,
      },
      prepTimeHasError: false,
      archived: null,
    };
  }
  componentDidMount() {
    getFoodItems(false)
      .then((result) => {
        //console.log("result", result);
        this.setState({ foodItems: result });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const {
      foodItems,
      doCreateFoodItem,
      newFoodItem,
      prepTimeHasError,
      archived,
    } = this.state;

    const addFoodItem = () => {
      const newID = createFoodItem(newFoodItem);
      this.setState({
        foodItems: [...foodItems, { ...newFoodItem, id: newID }],
        newFoodItem: null,
      });
    };
    const removeFoodItem = (pID) => {
      this.setState({ foodItems: foodItems.filter(({ id }) => id != pID) });
    };
    const listFoodItems = () => {
      if (foodItems && foodItems.length) {
        return foodItems
          .sort(({ name: aName }, { name: bName }) =>
            aName < bName ? -1 : aName > bName ? 1 : 0
          )
          .map((food) => (
            <FoodItem
              key={food.id}
              {...food}
              onArchive={(pID) => {
                const archivee = foodItems.find(({ id }) => id == pID);
                updateFoodItem({ ...archivee, archived: true })
                  .then((result) => {
                    console.log("result", result);
                    if (result) {
                      removeFoodItem(pID);
                      this.setState({ archived: archivee });
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}
              style={{ margin: 10 }}
            />
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
            this.props.navigation.navigate("create-food");
          }}
          style={{ position: "absolute", right: 0, bottom: 0, margin: 50 }}
        />
        <Portal>
          <Snackbar
            visible={Boolean(archived)}
            onDismiss={() => {
              this.setState({ archived: null });
            }}
            action={{
              label: "Undo",
              onPress: () => {
                updateFoodItem(archived.id, {
                  ...archived,
                  archived: false,
                }).then((result) => {
                  if (result) {
                    this.setState({
                      foodItems: [...foodItems, archived],
                      archived: null,
                    });
                  }
                });
                // Do something
              },
            }}
          >
            Food Item has been archived.
          </Snackbar>
        </Portal>
      </View>
    );
  }
}

export default function ManageFood(props) {
  return (
    <Stack.Navigator initialRouteName="main" headerMode="float">
      <Stack.Screen name="main" component={FoodMain} />
      <Stack.Screen name="create-food" component={CreateFoodItem} />
    </Stack.Navigator>
  );
}
