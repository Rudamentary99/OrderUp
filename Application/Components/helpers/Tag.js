import React from "react";
import { View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

export function TagInput({
  selectedItems,
  onChangeSelection,
  items,
  style,
  tagMode,
}) {
  return (
    <View style={{ flexDirection: "row", ...style }}>
      {items.map((tag) => (
        <Chip
          key={tag.id}
          mode={tagMode || "outlined"}
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
export function TagChip({ tag, emphasized, style }) {
  const theme = useTheme();
  const colorStyle = emphasized
    ? {
        backgroundColor: theme.colors.accent,
      }
    : {};
  return (
    <Chip mode="outlined" style={{ ...style, ...colorStyle }}>
      {tag.name}
    </Chip>
  );
}
