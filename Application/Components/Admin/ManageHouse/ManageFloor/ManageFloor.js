import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { FAB, Modal, TextInput, Title, Button } from "react-native-paper";
const ManageFloor = ({ state }) => {
  const [doCreateFloor, setCreateFloor] = React.useState(false);
  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Manage Floors</Text>
      <Text>{doCreateFloor ? "yaas" : "no"}</Text>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          setCreateFloor(true);
        }}
      />
      <Modal
        contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
        visible={doCreateFloor}
        onDismiss={() => {
          setCreateFloor(false);
        }}
      >
        <Title>New Floor</Title>
        <TextInput style={{ marginBottom: 30 }} label="Name"></TextInput>
        <View style={{ flexDirection: "row-reverse" }}>
          <Button>Create</Button>
          <Button>Cancel</Button>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default ManageFloor;
