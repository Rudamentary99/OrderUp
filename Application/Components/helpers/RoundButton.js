import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableRipple, Surface, Title } from "react-native-paper";
const RoundButton = (props) => {
  const { onPress, children, rippleColor } = props;

  return (
    <Surface style={styles.Button}>
      <TouchableRipple
        onPress={onPress}
        rippleColor={rippleColor}
        style={styles.Button}
      >
        <Title>{children}</Title>
      </TouchableRipple>
    </Surface>
  );
};

const styles = StyleSheet.create({
  Button: {
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 100,
  },
});
export default RoundButton;
