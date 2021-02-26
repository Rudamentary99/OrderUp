import React from "react";
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
} from "react-native-paper";
import { getFoodItem } from "./foodController";
function FoodItem(props) {
  const { id, name, prepTime, style, onArchive } = props;
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
          key={id}
          onPress={() => {
            navigation.navigate("Food Details", { id });
          }}
          onLongPress={() => {
            Vibration.vibrate(1000);
            setShow(true);
          }}
        >
          <Card.Title
            title={name}
            subtitle={"Prep Time: " + prepTime + "min"}
          ></Card.Title>
        </Card>
      }
    >
      <Menu.Item icon="pencil" title="Edit" />
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
class FoodDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { foodItem: {}, edit: false };
  }
  componentDidMount() {
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
      foodItem: { name, prepTime },
      edit,
    } = this.state;
    return (
      <View
        style={{
          ...StyleSheet.absoluteFill,
          padding: 50,
          paddingHorizontal: 80,
        }}
      >
        <Headline>{name || "Food Details!"}</Headline>
        <Subheading>Prep Time: {prepTime}</Subheading>
        {/* <View>
          <Subheading>Ingredients:</Subheading>
        </View>
        <View>
          <Subheading>Tags:</Subheading>
        </View> */}
        <FAB
          icon="pencil"
          onPress={() => {
            this.props.navigation.navigate("Edit Food", this.state.foodItem);
          }}
          style={{ position: "absolute", bottom: 0, right: 0, margin: 50 }}
        ></FAB>
      </View>
    );
  }
}
module.exports = { FoodItem, FoodDetails };
