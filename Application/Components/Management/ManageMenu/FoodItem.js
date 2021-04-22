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
  Chip,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { getFoodItem, updateFoodItem } from "../../../DB/foodController";
import { ScrollView } from "react-native-gesture-handler";
import { CustomStyles } from "../../../Styles";
import { TagChip } from "../../helpers/Tag";
export function FoodItem(props) {
  const {
    item: { id, name, prepTime, tags },
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
          <Card.Content>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              {tags?.map((tag) => (
                <TagChip key={uuidv4()} tag={tag} mode="flat" />
              ))}
            </View>
          </Card.Content>
        </Card>
      }
    >
      <Menu.Item
        icon="pencil"
        title="Edit"
        onPress={() => {
          setShow(false);
          navigation.navigate("Edit Food", props.item);
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
      manageItemOpen: false,
      confirmArchive: false,
    };
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.loadData();
    });
    this.loadData();
  }
  componentWillUnmount() {
    this.focusListener();
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
      foodItem: { id, name, prepTime, foodType, price, ingredients, tags },
      confirmArchive,
    } = this.state;
    return (
      <View
        style={{
          ...StyleSheet.absoluteFill,
          ...CustomStyles.container,
          padding: 50,
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

        <View>
          <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
            {tags?.map((tag) => (
              <Chip mode="outlined" key={uuidv4()} style={{ marginLeft: 3 }}>
                {tag}
              </Chip>
            ))}
          </View>
          <Headline>Price: ${price}</Headline>
        </View>
        <FAB.Group
          style={{ display: this.props.route.params.noEdit ? "none" : "flex" }}
          icon={this.state.manageItemOpen ? "dots-vertical" : "pencil"}
          open={this.state.manageItemOpen}
          onStateChange={() => {
            this.setState({ manageItemOpen: !this.state.manageItemOpen });
          }}
          actions={[
            {
              icon: "archive",
              label: "Archive",
              onPress: () => {
                this.setState({ confirmArchive: true });
              },
            },
            {
              icon: "pencil",
              label: "Edit",

              onPress: () => {
                this.props.navigation.navigate(
                  "Edit Food",
                  this.props.route.params
                );
              },
            },
          ]}
          style={{
            ...CustomStyles.bottomRightActionGroup,
            display: Boolean(this.props.route.params?.noEdit) ? "none" : "flex",
          }}
        ></FAB.Group>
        <Dialog
          visible={confirmArchive}
          onDismiss={() => {
            this.setState({ confirmArchive: false });
          }}
        >
          <Dialog.Title>Archiving food item</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              This action cannot be undone. Do you wish to proceed?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                updateFoodItem({ id, archived: true })
                  .then((result) => {
                    if (result) {
                      this.props.navigation.navigate("Food Items", {
                        archivee: this.state.foodItem,
                        playArchivedSound: true,
                      });
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}
            >
              Proceed
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                this.setState({ confirmArchive: false });
              }}
            >
              Nevermind
            </Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    );
  }
}
