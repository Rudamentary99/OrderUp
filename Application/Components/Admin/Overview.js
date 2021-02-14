import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  TouchableRipple,
  Surface,
  Title,
  Provider as PaperProvider,
} from "react-native-paper";

import RoundButton from "../helpers/RoundButton";

const AdminOverview = ({ navigation }) => {
  const [testText, setTestText] = useState("Manage House");
  return (
    <View style={styles.view}>
      <RoundButton
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={() => {
          navigation.navigate("Manage Menu");
        }}
      >
        Manage Menu
      </RoundButton>
      <RoundButton
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={() => {
          navigation.navigate("temp");
        }}
      >
        Manage House
      </RoundButton>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  Button: {
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 100,
  },
});

export default AdminOverview;
