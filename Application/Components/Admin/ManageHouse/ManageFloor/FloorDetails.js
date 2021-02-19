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
  Button,
} from "react-native-paper";
import { getFloor, updateTables } from "./FloorController";
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
    this._numberInput = React.createRef();
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
    const { id, name, tables, isAddingTable, newTable } = this.state;

    const addTable = () => {
      const newTables = [...tables, newTable];
      updateTables(id, newTables)
        .then((result) => {
          //console.log("result", result);
          this.setState({ tables: newTables });
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const listTables = () => {
      if (tables && tables.length) {
        return tables.map(({ number, name }, index) => (
          <List.Item
            key={`${number}-${index}`}
            title={number}
            description={name}
          />
        ));
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
      m10: {
        margin: 10,
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
              style={{ marginHorizontal: 100 }}
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
            position: "relative",
            top: -200,
            backgroundColor: "white",
            padding: 50,
            margin: 50,
          }}
        >
          <Title style={StyleSheet.m10}>New Table</Title>
          <TextInput
            ref={this._numberInput}
            label="Table Number"
            value={newTable.number}
            onChangeText={(text) => {
              this.setState({ newTable: { ...newTable, number: text } });
            }}
            style={styles.m10}
          />
          <TextInput
            label="Name"
            value={newTable.name}
            onChangeText={(text) => {
              this.setState({ newTable: { ...newTable, name: text } });
            }}
            style={styles.m10}
          />
          <Button
            onPress={() => {
              addTable();
            }}
            style={{ marginTop: 20 }}
          >
            Add
          </Button>
        </Modal>
      </View>
    );
  }
}
