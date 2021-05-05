import React, { useState, useEffect } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView } from "react-native-gesture-handler";
import { CustomStyles } from "../../../Styles";
import {
  Button,
  Card,
  Headline,
  Paragraph,
  Subheading,
  Surface,
  ToggleButton,
} from "react-native-paper";
import { getFoodItems } from "../../../DB/foodController";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import {
  getOrderItems,
  getOrderItemsFullSimple,
} from "../../../DB/orderController";
import { useNavigation, useTheme } from "@react-navigation/native";

const moment = require("moment"); // require
import { DatePickerModal } from "react-native-paper-dates";

function FoodItem(props) {
  const {
    food: { name, prepTime },
    count,
  } = props;
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("Food Details", { ...props.food, noEdit: true });
      }}
    >
      <Surface
        style={{
          flexDirection: "row",
          justifyContent: "space-between",

          margin: 20,
          padding: 20,
          borderRadius: theme.roundness,
        }}
      >
        <Headline>{name}</Headline>

        <Headline>{count}</Headline>
      </Surface>
    </TouchableWithoutFeedback>
  );
}

export function PurchaseHistory({ navigation }) {
  const [FoodItems, setFoodItems] = useState([]);
  const [OrderItems, setOrderItems] = useState([]);
  const [filterMode, setfilterMode] = useState(null);
  const [getCustomRange, setGetCustomRange] = useState(false);
  const [{ filterStart, filterEnd }, setFilterRange] = useState({});
  useEffect(() => {
    const focusListener = navigation.addListener("focus", loadData);
    return focusListener;
  });

  function loadData() {
    getFoodItems(false)
      .then((result) => {
        setFoodItems(result || []);
      })
      .catch((err) => {
        console.error(err);
      });
    getOrderItemsFullSimple()
      .then((result) => {
        setOrderItems(result || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // function getFilter(mode) {
  //   switch (mode) {
  //     case "Yesterday":
  //       console.log("yesterday");
  //       const yesterday = moment().subtract(1, "day");

  //       setFilterRange({
  //         filterStart: yesterday.startOf("day"),
  //         filterEnd: yesterday.endOf("day"),
  //       });
  //       break;
  //     case "Last Week":
  //       console.log("last week");
  //       const lastWeek = moment().subtract(1, "day");
  //       // console.log(
  //       //   `lastWeek.startOf("week").format("MM/DD/YYYY")`,
  //       //   lastWeek.startOf("week").format("MM/DD/YYYY")
  //       // );
  //       setFilterRange({
  //         filterStart: lastWeek.startOf("day"),
  //         filterEnd: lastWeek.endOf("week"),
  //       });

  //     case "Last Month":
  //       const lastMonth = moment().subtract(1, "month");
  //       setFilterRange({
  //         filterStart: lastMonth.startOf("month"),
  //         filterEnd: lastMonth.endOf("month"),
  //       });
  //       break;

  //     default:
  //       setFilterRange({});
  //       break;
  //   }
  // }
  return (
    <View>
      <View
        style={{
          position: "relative",
          flexDirection: "row",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Headline>
          {filterMode == "Custom"
            ? `${moment(filterStart).format("MM/DD/YYYY")} - ${moment(
                filterEnd
              ).format("MM/DD/YYYY")}`
            : filterMode || " "}
        </Headline>
        <ToggleButton.Row
          onValueChange={(value) => {
            //   if (value == "Custom") {
            //setFilterRange({});
            if (filterMode != "Custom") setGetCustomRange(true);
            // } else {
            //   getFilter(value);
            // }
            setfilterMode(value);
          }}
          value={filterMode}
          style={{ position: "absolute", right: 0, margin: 20 }}
        >
          {/* <ToggleButton icon="calendar-today" value="Yesterday" />
          <ToggleButton icon="calendar-week" value="Last Week" />
          <ToggleButton icon="calendar-month" value="Last Month" /> */}
          <ToggleButton icon="calendar-edit" value="Custom" />
        </ToggleButton.Row>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 40,
          ...CustomStyles.container,
        }}
      >
        <Subheading>Food</Subheading>
        <Subheading>Units Sold</Subheading>
      </View>
      <ScrollView style={{ marginBottom: 100 }}>
        <View style={[CustomStyles.container, { padding: 15 }]}>
          {FoodItems.map((food) => ({
            ...food,
            count: OrderItems.filter(({ foodID }) => foodID == food.id).filter(
              (food) => {
                if (filterMode) {
                  return moment(food.closeDate).isBetween(
                    moment(filterStart),
                    moment(filterEnd)
                  );
                } else {
                  return true;
                }
              }
            ).length,
          }))
            .sort((a, b) => b.count - a.count)
            .map((food) => (
              <FoodItem key={uuidv4()} food={food} count={food.count} />
            ))}
        </View>
      </ScrollView>
      <DatePickerModal
        mode="range"
        visible={getCustomRange}
        onDismiss={() => {
          setGetCustomRange(false);
        }}
        // startDate={filterStart}
        // endDate={filterEnd}
        onConfirm={({ startDate, endDate }) => {
          setGetCustomRange(false);
          setFilterRange({ filterStart: startDate, filterEnd: endDate });
        }}
      />
      <Paragraph>
        {/* {" "}
        {filterStart
          ? `${filterStart.format("MM/DD/YYYY")} - ${filterEnd.format(
              "MM/DD/YYYY"
            )}`
          : ""} */}
      </Paragraph>
    </View>
  );
}
