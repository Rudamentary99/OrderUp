import React from "react";
import { View, Text } from "react-native";

export default class FloorDetails extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("this.props", this.props);
  }
  render() {
    return (
      <View>
        <Text>FloorDeets</Text>
      </View>
    );
  }
}
