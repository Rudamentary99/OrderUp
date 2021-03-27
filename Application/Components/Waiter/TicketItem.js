import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Chip,
  Headline,
  List,
  Paragraph,
  Subheading,
  useTheme,
} from "react-native-paper";
import { getOrderItem } from "../../DB/orderController";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { CustomStyles } from "../../Styles";

function TagChip({ tag, emphasized }) {
  const theme = useTheme();
  const style = emphasized
    ? {
        backgroundColor: theme.colors.accent,
      }
    : {};
  return <Chip style={style}>{tag.name}</Chip>;
}
export class TicketItemDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderItem: {},
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
      getOrderItem(itemID)
        .then((result) => {
          this.setState({ orderItem: result });
        })
        .catch((err) => {
          console.error(err);
        });
  }

  render() {
    const {
      orderItem: {
        name,
        prepTime,
        foodType,
        price,
        ingredients,
        tags,
        customization,
      },
    } = this.state;
    console.log(`customization`, customization);
    return (
      <View
        style={{
          ...StyleSheet.absoluteFill,
          padding: 50,
          paddingHorizontal: 80,
          justifyContent: "space-between",
          ...CustomStyles.container,
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
                    titleStyle={{
                      textDecorationLine: customization?.excludedIngredients.find(
                        (eg) => eg == ingredient
                      )
                        ? "line-through"
                        : "none",
                    }}
                    key={uuidv4()}
                    title={"- " + ingredient}
                  ></List.Item>
                )) || <List.Item title="no ingredients given..."></List.Item>}
            </ScrollView>
          </List.Section>
          {customization?.notes && (
            <View>
              <Subheading>Notes: </Subheading>
              <Paragraph style={{ paddingLeft: 20 }}>
                {customization?.notes}
              </Paragraph>
            </View>
          )}
        </View>

        <View
          style={{
            display:
              tags?.length || customization?.customTags?.length
                ? "flex"
                : "none",
          }}
        >
          <Subheading>Tags</Subheading>
          <View style={{ flexDirection: "row" }}>
            {customization?.customTags?.length
              ? customization?.customTags?.map((customTag) => (
                  // <TagChip
                  //   key={uuidv4()}
                  //   tag={customTag}
                  //   emphasized={!tags.find(({ id }) => customTag.id == id)}
                  // />
                  <Chip
                    key={uuidv4()}
                    mode="outlined"
                    style={{
                      marginRight: 3,
                    }}
                  >
                    {customTag.name}
                  </Chip>
                ))
              : tags?.map((tag) => (
                  <Chip
                    key={uuidv4()}
                    mode="outlined"
                    style={{
                      marginRight: 3,
                    }}
                  >
                    {tag.name}
                  </Chip>
                ))}
          </View>
        </View>
        
        <Headline>Price: ${price}</Headline>
      </View>
    );
  }
}
