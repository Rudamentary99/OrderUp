import React from "react";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { View, StyleSheet, Modal, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Card,
  Divider,
  FAB,
  Headline,
  Menu,
  Subheading,
  Text,
  Title,
  Button,
  TextInput,
  List,
} from "react-native-paper";
import { getFoodItem } from "../../../DB/foodController";
import { ScrollView } from "react-native-gesture-handler";
export function FoodItem(props) {
  const {
    item: { id, name, prepTime, foodType },
    style,
    onArchive,
  } = props;
  // const item = {
  //   id,
  //   name,
  //   prepTime,
  //   foodType,
  // };
  const [show, setShow] = React.useState(false);
  const navigation = useNavigation();
  return (
    <Menu
      visible={show}
      onDismiss={() => {
        setShow(false);
      }}
      anchor={
        <Card
          style={style}
          onPress={() => {
            navigation.navigate("Food Details", props.item);
          }}
          onLongPress={() => {
            setShow(true);
          }}
        >
          <Card.Title
            title={name}
            subtitle={"Prep Time: " + prepTime / 60 / 1000 + "min"}
          ></Card.Title>
        </Card>
      }
    >
      <Menu.Item
        icon="pencil"
        title="Edit"
        onPress={() => {
          setShow(false);
          navigation.navigate("Edit Food", item);
        }}
      />
      <Divider />
      <Menu.Item
        icon="archive"
        title="Archive"
        onPress={() => {
          onArchive(id);
          setShow(false);
        }}
      />
    </Menu>
  );
}
export class FoodDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodItem: {},
    };
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.loadData();
    });
    this.loadData();
  }
  componentWillUnmount() {
    this.focusListener.remove;
  }
  loadData() {
    const itemID = this.props?.route?.params?.id;
    if (itemID)
      getFoodItem(itemID)
        .then((result) => {
          this.setState({ foodItem: result });
        })
        .catch((err) => {
          console.error(err);
        });
  }

  render() {
    const {
      foodItem: { name, prepTime, foodType, price, ingredients },
    } = this.state;
    return (
      <View
        style={{
          ...StyleSheet.absoluteFill,
          padding: 50,
          paddingHorizontal: 80,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Headline>{name || "Food Details!"}</Headline>
          <Subheading>Prep Time: {prepTime / 60 / 1000}</Subheading>
          <Subheading>Food Type: {foodType}</Subheading>
          <List.Section title="Ingredients">
            <ScrollView>
              {ingredients
                ?.sort((a, b) => a.localeCompare(b))
                .map((ingredient) => (
                  <List.Item
                    key={uuidv4()}
                    title={"- " + ingredient}
                  ></List.Item>
                )) || <List.Item title="no ingredients given..."></List.Item>}
            </ScrollView>
          </List.Section>
        </View>

        {/* <View>
          <Subheading>Ingredients:</Subheading>
        </View>
        <View>
          <Subheading>Tags:</Subheading>
        </View> */}
        <Headline style={{}}>Price: ${price}</Headline>
        <FAB
          icon="pencil"
          onPress={() => {
            this.props.navigation.navigate(
              "Edit Food",
              this.props.route.params
            );
          }}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            margin: 50,
            display: Boolean(this.props.route.params?.noEdit) ? "none" : "flex",
          }}
        ></FAB>
      </View>
    );
  }
}
