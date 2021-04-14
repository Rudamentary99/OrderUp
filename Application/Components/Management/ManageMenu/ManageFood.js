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
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import TagInput from "../../helpers/Tag";
import {
  getFoodItems,
  getFoodTypes,
  updateFoodItem,
} from "../../../DB/foodController";
import { ManageFoodItem } from "./ManageFoodItem";
import { FoodItem, FoodDetails } from "./FoodItem";
import { FoodSettings } from "./FoodSettings";
import { CustomStyles } from "../../../Styles";
import { Audio } from "expo-av";
const Stack = createStackNavigator();
const MenuBar = ({ navigation }) => {
  // const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <View
      style={{
        position: "relative",
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
    >
      {/* <IconButton compact disabled icon="magnify"></IconButton>
      <IconButton icon="filter" compact disabled></IconButton> */}
      <View
        style={{
          marginLeft: "auto",
          alignSelf: "flex-end",
        }}
      >
        {/* <Menu
          visible={isMenuOpen}
          onDismiss={() => setIsMenuOpen(false)}
          style={{ paddingTop: 50 }}
          anchor={ */}
        <IconButton
          compact
          icon="cog"
          onPress={() => {
            navigation.navigate("Food Settings");
            //   setIsMenuOpen(true)
          }}
        ></IconButton>
        {/* }
        >
          <Menu.Item
            title="Manage Food Types"
            onPress={() => {
              setIsMenuOpen(false);
              navigation.navigate("temp");
            }}
          ></Menu.Item>
        </Menu> */}
      </View>
    </View>
  );
};

class FoodMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItems: [],
      doCreateFoodItem: false,

      refreshing: false,
      prepTimeHasError: false,
      archived: null,
    };
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.loadFood();
      this.setState({ archived: this?.props?.route?.params?.archivee });

      if (this?.props?.route?.params?.playArchivedSound) {
        this.playArchivedFoodSound();
      }
    });
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
    this.focusListener();
    this.state?.sound?.unloadAsync();
  }
  loadFood() {
    this.setState({ refreshing: true });
    getFoodItems(false)
      .then((result) => {
        if (result && this.state.foodItems?.length) {
          result?.forEach((food) => {
            if (!this.state.foodItems.find(({ id }) => id == food.id)) {
              this.playNewFoodSound();
              return;
            }
          });
        }
        //console.log("result", result);
        this.setState({ foodItems: result || [], refreshing: false });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async playNewFoodSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../sounds/createdFood.mp3")
    );
    this.setState({ sound: sound });
    await sound.playAsync();
  }
  async playArchivedFoodSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../sounds/archivedFood.mp3")
    );
    this.setState({ sound: sound });
    await sound.playAsync();
  }
  render() {
    const { foodItems, archived, refreshing, foodTypes } = this.state;
    const removeFoodItem = (pID) => {
      this.setState({ foodItems: foodItems.filter(({ id }) => id != pID) });
    };
    const listFoodItems = () => {
      if (foodItems?.length && foodTypes?.length) {
        return foodTypes
          .sort((a, b) => {
            return b.priority - a.priority;
          })
          .map(({ id, name }) => {
            return (
              <View key={uuidv4()}>
                <Subheading>{name}</Subheading>
                {foodItems.find(({ foodType }) => name == foodType) ? (
                  foodItems
                    .filter(({ foodType }) => foodType == name)
                    .sort(({ name: aName }, { name: bName }) =>
                      aName.localeCompare(bName)
                    )
                    .map((food) => (
                      <FoodItem
                        key={food.id + "-" + uuidv4()}
                        item={food}
                        onArchive={(pID) => {
                          const archivee = foodItems.find(
                            ({ id }) => id == pID
                          );
                          updateFoodItem({ ...archivee, archived: true })
                            .then((result) => {
                              // console.log("result", result);
                              if (result) {
                                this.playArchivedFoodSound();
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
                    ))
                ) : (
                  <View style={{ padding: 15 }}>
                    <Subheading style={{ textAlign: "center" }}>
                      No food of this type.
                    </Subheading>
                  </View>
                )}
              </View>
            );
          });
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

    return (
      <View
        style={{
          ...StyleSheet.absoluteFill,
          paddingTop: 0,
        }}
      >
        <MenuBar navigation={this.props.navigation}></MenuBar>

        <ScrollView
          contentContainerStyle={[
            CustomStyles.container,
            { paddingBottom: 100 },
          ]}
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
          style={CustomStyles.bottomRightAction}
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
      <Stack.Screen name="Food Items" component={FoodMain} />
      <Stack.Screen name="create-food" component={ManageFoodItem} />
      <Stack.Screen name="Food Details" component={FoodDetails} />
      <Stack.Screen name="Edit Food" component={ManageFoodItem} />
      <Stack.Screen name="Food Settings" component={FoodSettings} />
    </Stack.Navigator>
  );
}
