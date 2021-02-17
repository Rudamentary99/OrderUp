import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { FAB, Modal, TextInput, Title, Button, Card } from "react-native-paper";
import { createNewFloor, getFloors } from "./FloorController";
import Floor from "./Floor";
class ManageFloor extends React.Component {
  // floors = await getFloors();
  //const [floors, setFloors] = React.useState(getFloors());
  constructor(props) {
    super(props);
    this.state = {
      newFloorName: null,
      floors: null,
    };
  }
  componentDidMount() {
    getFloors()
      .then((result) => {
        this.setState({ floors: result.r });
      })
      .catch((err) => {});
    console.log("floors", this.state.floors);
  }
  render() {
    const { newFloorName, floors } = this.state;
    const listFloors = () => {
      return floors.map(() => <Floor />);
    };
    return (
      <KeyboardAvoidingView behavior="height" style={styles.wrapper}>
        <ScrollView horizontal style={styles.scrollView}>
          <View style={styles.floorContainer}>
            {floors === null ? <Text>loading...</Text> : listFloors()}
          </View>
        </ScrollView>
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => {
            this.setState({ newFloorName: "" });
          }}
        />
        <Modal
          contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
          visible={newFloorName !== null}
          onDismiss={() => {
            this.setState({ newFloorName: null });
          }}
        >
          <KeyboardAvoidingView behavior="height">
            <Title>New Floor</Title>
            <TextInput
              value={newFloorName}
              onChangeText={(text) => {
                this.setState({ newFloorName: text });
              }}
              style={{ marginBottom: 30 }}
              label="Name"
            ></TextInput>
            <View style={{ flexDirection: "row-reverse" }}>
              <Button
                onPress={() => {
                  createNewFloor(newFloorName)
                    .then((result) => {
                      this.setState({
                        newFloorName: null,
                        floors: [...floors, result],
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                }}
              >
                Create
              </Button>
              <Button
                onPress={() => {
                  this.setState({ newFloorName: null });
                }}
              >
                Cancel
              </Button>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    // backgroundColor: "#e3d7cf",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    position: "relative",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  floorContainer: {
    flex: 1,
    position: "relative",
    right: 0,
    left: 0,
    flexWrap: "wrap",
    //backgroundColor: "#f59042",
  },
  floor: {
    width: 250,
    height: 250,
    margin: 20,
  },
});
export default ManageFloor;
