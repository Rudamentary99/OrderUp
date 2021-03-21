import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Headline, List, Paragraph, Subheading } from "react-native-paper";
import { getOrderItem } from "../../DB/orderController";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
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
        customization,
      },
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

        {/* <View>
          <Subheading>Ingredients:</Subheading>
        </View>
        <View>
          <Subheading>Tags:</Subheading>
        </View> */}
        <Headline style={{}}>Price: ${price}</Headline>
      </View>
    );
  }
}
