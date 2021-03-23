import React from "react";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { Divider, IconButton, Surface, TextInput } from "react-native-paper";
import { List } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";

export function ListInput({
  items,
  onChange,
  onRemove,
  inputTitle,
  sortFunction,
}) {
  const [newItem, setNewItem] = React.useState();
  const getItems = () => {
    return sortFunction ? items.sort(sortFunction) : items;
  };
  const submit = () => {
    if (newItem) {
      onChange(newItem);
      setNewItem("");
    }
  };
  return (
    <Surface style={{ padding: 40 }}>
      <TextInput
        label={inputTitle}
        value={newItem}
        onChangeText={(text) => {
          setNewItem(text);
        }}
        onSubmitEditing={() => {
          submit();
        }}
        right={
          <TextInput.Icon
            icon={"plus"}
            onPress={() => {
              submit();
            }}
            forceTextInputFocus={false}
          />
        }
        blurOnSubmit={false}
      />
      <ScrollView>
        {getItems().map((item, index) => (
          <View key={uuidv4()}>
            <Divider />
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
          </View>
        ))}
      </ScrollView>
    </Surface>
  );
}
