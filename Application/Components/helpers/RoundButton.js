import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableRipple, Surface, Title } from "react-native-paper";
const RoundButton = (props) => {
  const { onPress, children, rippleColor, style } = props;

  return (
    <Surface style={[styles.Button, style]}>
      <TouchableRipple
        onPress={onPress}
        rippleColor={rippleColor || "rgba(0, 0, 0, .32)"}
        style={[styles.Button, style, { position: "relative" }]}
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
