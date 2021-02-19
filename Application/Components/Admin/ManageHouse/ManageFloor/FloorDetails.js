//import { loadPartialConfig } from "@babel/core";
import React from "react";
import { View, Text } from "react-native";
import { getFloor } from "./FloorController";
export default class FloorDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: null,
    };
  }
  componentDidMount() {
    //console.log("props", this.props);
    getFloor(this.props.route.params.id)
      .then((result) => {
        this.setState(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { name } = this.state;
    return (
      <View>
        <Text>{name || "loading..."}</Text>
      </View>
    );
  }
}
