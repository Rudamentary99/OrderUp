import React from "react";
import { View } from "react-native";
import { Chip } from "react-native-paper";

export function TagInput({ selectedItems, onChangeSelection, items, style }) {
  return (
    <View style={{ flexDirection: "row", ...style }}>
      {items.map((tag) => (
        <Chip
          key={tag.id}
          mode="outlined"
          selected={selectedItems?.find(({ id }) => id == tag.id) || false}
          style={{ margin: 5 }}
          onPress={() => {
            if (selectedItems.find(({ id }) => tag.id == id))
              onChangeSelection(selectedItems.filter(({ id }) => tag.id != id));
            else onChangeSelection([...selectedItems, tag]);
          }}
        >
          {tag.name}
        </Chip>
      ))}
    </View>
  );
}
