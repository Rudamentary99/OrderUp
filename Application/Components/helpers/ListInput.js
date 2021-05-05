import React from "react";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import {
  Divider,
  HelperText,
  IconButton,
  Surface,
  TextInput,
} from "react-native-paper";
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
  const [errorMessage, setErrorMessage] = React.useState("");
  const getItems = () => {
    return sortFunction ? items.sort(sortFunction) : items;
  };
  const submit = () => {
    if (newItem && !errorMessage) {
      onChange(newItem);
      setNewItem("");
    }
  };
  return (
    <Surface style={{ padding: 40 }}>
      <TextInput
        label={inputTitle}
        value={newItem}
        error={Boolean(errorMessage)}
        onChangeText={(text) => {
          if (items.find((item) => item == text)) {
            setErrorMessage("This ingredient already exists.");
          } else {
            setErrorMessage("");
          }
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
      <HelperText type="error" visible={Boolean(errorMessage)}>
        {errorMessage}
      </HelperText>
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
                    // console.log(`index`, index);
                    onRemove({ index: index, item: item });
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
