import React from "react";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { IconButton, TextInput } from "react-native-paper";
import { List } from "react-native-paper";

export function ListInput({
  items,
  onChange,
  onRemove,
  listTitle,
  inputTitle,
  sortFunction,
}) {
  const [newItem, setNewItem] = React.useState();
  const getItems = () => {
    return sortFunction ? items.sort(sortFunction) : items;
  };
  return (
    <List.Accordion title={listTitle}>
      <TextInput
        label={inputTitle}
        value={newItem}
        onChangeText={(text) => {
          setNewItem(text);
        }}
        onSubmitEditing={() => {
          onChange(newItem);
          setNewItem("");
        }}
      />
      {getItems().map((item, index) => (
        <List.Item
          key={uuidv4()}
          title={item}
          right={() => (
            <IconButton
              icon="close"
              onPress={() => {
                onRemove(index);
              }}
            />
          )}
        />
      ))}
    </List.Accordion>
  );
}
