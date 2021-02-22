import React from "react";
import { Vibration } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, Divider, Menu } from "react-native-paper";

export default function FoodItems(props) {
  const { id, name, prepTime, style, onArchive } = props;
  const [show, setShow] = React.useState(false);
  return (
    <Menu
      visible={show}
      onDismiss={() => {
        setShow(false);
      }}
      anchor={
        <Card
          style={style}
          key={id}
          onLongPress={() => {
            Vibration.vibrate(1000);
            setShow(true);
          }}
        >
          <Card.Title
            title={name}
            subtitle={"Prep Time: " + prepTime + "min"}
          ></Card.Title>
        </Card>
      }
    >
      <Menu.Item icon="pencil" title="Edit" />
      <Divider />
      <Menu.Item
        icon="archive"
        title="Archive"
        onPress={() => {
          onArchive(id);
          setShow(false);
        }}
      />
    </Menu>
  );
}
