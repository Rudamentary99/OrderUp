import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";

const AdminOverview = ({ navigation }) => {
  return (
    <View style={styles.view}>
      <Button
        style={styles.Button}
        mode="contained"
        onPress={() => {
          navigation.navigate("admin");
        }}
      >
        Manage Food
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("admin");
        }}
      >
        Manage House
      </Button>
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
  Button: {},
});

export default AdminOverview;
