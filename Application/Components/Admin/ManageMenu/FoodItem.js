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
function FoodItem(props) {
  const { id, name, prepTime, foodType, style, onArchive } = props;
  const item = {
    id,
    name,
    prepTime,
    foodType,
  };
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
            navigation.navigate("Food Details", item);
          }}
          onLongPress={() => {
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
class FoodDetails extends React.Component {
  constructor(props) {
    super(props);
  }
  // componentDidMount() {
  //   const itemID = this.props?.route?.params?.id;
  //   if (itemID)
  //     getFoodItem(itemID)
  //       .then((result) => {
  //         this.setState({ foodItem: result });
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  // }
  render() {
    const {
      route: {
        params: { name, prepTime, foodType },
      },
    } = this.props;
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
        <Subheading>Food Type: {foodType}</Subheading>
        {/* <View>
          <Subheading>Ingredients:</Subheading>
        </View>
        <View>
          <Subheading>Tags:</Subheading>
        </View> */}
        <FAB
          icon="pencil"
          onPress={() => {
            this.props.navigation.navigate(
              "Edit Food",
              this.props.route.params
            );
          }}
          style={{ position: "absolute", bottom: 0, right: 0, margin: 50 }}
        ></FAB>
      </View>
    );
  }
}
module.exports = { FoodItem, FoodDetails };
