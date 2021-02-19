//import { loadPartialConfig } from "@babel/core";
import React from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import {
  List,
  Title,
  Caption,
  Surface,
  FAB,
  Headline,
  TextInput,
  Modal,
} from "react-native-paper";
import { getFloor } from "./FloorController";
export default class FloorDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: null,
      tables: [],
      newTable: { number: "", name: "" },
      isAddingTable: false,
    };
  }
  componentDidMount() {
    //console.log("props", this.props);
    getFloor(this.props.route.params.id)
      .then((result) => {
        //console.log("result", result);
        this.setState(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { name, tables, isAddingTable, newTable } = this.state;

    const listTables = () => {
      if (tables && tables.length) {
        return tables.map(({ number, name }) => {
          <List.Item key={number} title={number} description={name} />;
        });
      }
      return (
        <Caption style={{ padding: 40, textAlign: "center" }}>
          No Tables
        </Caption>
      );
    };
    const styles = StyleSheet.create({
      p10: {
        padding: 10,
      },
    });
    return (
      <View style={[StyleSheet.absoluteFill, { padding: 50 }]}>
        <Headline>{name}</Headline>
        <Surface style={styles.p10}>
          {/* <Headline>tables:</Headline> */}
          <List.Section title="Tables" style={styles.p10}>
            {listTables()}
            <FAB
              label="Add Table"
              onPress={() => {
                this.setState({ isAddingTable: true });
              }}
              style={{ marginHorizontal: 50 }}
            ></FAB>
          </List.Section>
        </Surface>
        <Modal
          visible={isAddingTable}
          onDismiss={() => {
            this.setState({ isAddingTable: false });
          }}
          animationType="fade"
          presentationStyle="formSheet"
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 50,
            margin: 50,
          }}
        >
          <Title>New Table</Title>
          <TextInput
            label="Table Number"
            value={newTable.number}
            onChangeText={(text) => {
              this.setState({ newTable: { ...newFloor, number: text } });
            }}
          />
          <TextInput
            label="Name"
            value={newTable.name}
            onChangeText={(text) => {
              this.setState({ newTable: { ...newFloor, name: text } });
            }}
          />
        </Modal>
      </View>
    );
  }
}
