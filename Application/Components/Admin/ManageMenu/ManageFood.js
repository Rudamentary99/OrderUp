import React from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
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
  Snackbar,
  Portal,
  Subheading,
} from "react-native-paper";
import TagInput from "../../helpers/TagInput";
import {
  getFoodItems,
  getFoodTypes,
  updateFoodItem,
} from "../../../DB/foodController";
import { CreateFoodItem, EditFoodItem } from "./CreateFoodItem";
import { FoodItem, FoodDetails } from "./FoodItem";
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
      refreshing: false,
      prepTimeHasError: false,
      archived: null,
    };
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      if (this.props?.route?.params) {
        this.setState({
          foodItems: [...this.state.foodItems, this.props?.route?.params],
        });
      }
    });
    console.log("this.focusListener", this.focusListener);
    this.loadFood();
    getFoodTypes()
      .then((result) => {
        this.setState({ foodTypes: result });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  componentWillUnmount() {
    this.focusListener.remove;
  }
  loadFood() {
    this.setState({ refreshing: true });
    getFoodItems(false)
      .then((result) => {
        //console.log("result", result);
        this.setState({ foodItems: result, refreshing: false });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { foodItems, archived, refreshing, foodTypes } = this.state;

    const removeFoodItem = (pID) => {
      this.setState({ foodItems: foodItems.filter(({ id }) => id != pID) });
    };
    const listFoodItems = () => {
      if (foodItems?.length && foodTypes?.length) {
        return foodTypes
          .sort(({ name: aName }, { name: bName }) =>
            aName < bName ? -1 : aName > bName ? 1 : 0
          )
          .map(({ id, name }) => {
            if (foodItems.find(({ foodType }) => name == foodType)) {
              return (
                <>
                  <Subheading key={id}>{name}</Subheading>
                  {foodItems
                    .filter(({ foodType }) => foodType == name)
                    .sort(({ name: aName }, { name: bName }) =>
                      aName < bName ? -1 : aName > bName ? 1 : 0
                    )
                    .map((food) => (
                      <FoodItem
                        key={food.id}
                        {...food}
                        onArchive={(pID) => {
                          const archivee = foodItems.find(
                            ({ id }) => id == pID
                          );
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
                    ))}
                </>
              );
            }
          });

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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                this.loadFood();
              }}
            ></RefreshControl>
          }
        >
          {listFoodItems()}
        </ScrollView>
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
      <Stack.Screen name="Food Details" component={FoodDetails} />
      <Stack.Screen name="Edit Food" component={EditFoodItem} />
    </Stack.Navigator>
  );
}
