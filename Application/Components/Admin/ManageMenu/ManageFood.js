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
import foodItem from "./FoodItem";
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
            label="Prep Time (minuets)"
            value={(newFoodItem && newFoodItem.prepTime) || ""}
            error={prepTimeHasError}
            onChangeText={(text) => {
              let er = false;
              if (isNaN(text)) er = true;
              this.setState({
                newFoodItem: { ...newFoodItem, prepTime: text },
                prepTimeHasError: er,
              });
            }}
            style={styles.input}
          />
          <HelperText type="error" visible={prepTimeHasError}>
            Prep time must be a number.
          </HelperText>
          <Button
            onPress={() => {
              let go = true;
              for (const key in foodItem) {
                if (!foodItem[key]) {
                  go = false;
                  break;
                }
              }
              if (go) {
                addFoodItem();
                this.setState({ doCreateFoodItem: false });
              }
            }}
          >
            Add
          </Button>
        </Modal>
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
    <Stack.Navigator initialRouteName="main" headerMode="none">
      <Stack.Screen name="main" component={FoodMain} />
    </Stack.Navigator>
  );
}
