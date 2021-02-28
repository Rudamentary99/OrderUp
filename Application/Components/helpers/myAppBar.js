import React from "react";
import { Appbar } from "react-native-paper";
const MyAppbar = (props) => {
  const { title, navigation, previous } = props;
  console.log("title", title);
  return (
    <Appbar.Header>
      {previous ? (
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
      ) : null}
      <Appbar.Content title="test" />
    </Appbar.Header>
  );
};
export default MyAppbar;
