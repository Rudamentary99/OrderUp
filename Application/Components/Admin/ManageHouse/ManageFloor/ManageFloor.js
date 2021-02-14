import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { FAB, Modal, TextInput, Title, Button } from "react-native-paper";
import { createNewFloor } from "./FloorController";

const ManageFloor = ({ state }) => {
  const [doCreateFloor, setCreateFloor] = React.useState(false);
  const [newFloorName, setNewFloorName] = React.useState("");
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
        <KeyboardAvoidingView behavior="height">
          <Title>New Floor</Title>
          <TextInput
            value={newFloorName}
            onChangeText={(text) => {
              setNewFloorName(text);
            }}
            style={{ marginBottom: 30 }}
            label="Name"
          ></TextInput>
          <View style={{ flexDirection: "row-reverse" }}>
            <Button
              onPress={() => {
                createNewFloor(newFloorName);
              }}
            >
              Create
            </Button>
            <Button
              onPress={() => {
                setCreateFloor(false);
                setNewFloorName("");
              }}
            >
              Cancel
            </Button>
          </View>
        </KeyboardAvoidingView>
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
