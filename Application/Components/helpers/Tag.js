import React from "react";
import { View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
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
          key={uuidv4()}
          mode={tagMode || "outlined"}
          selected={
            selectedItems?.find((selectedTag) => selectedTag == tag) || false
          }
          style={{ margin: 5 }}
          onPress={() => {
            if (selectedItems?.find((selectedTag) => selectedTag == tag))
              onChangeSelection(selectedItems.filter((st) => st != tag));
            else onChangeSelection([...selectedItems, tag]);
          }}
        >
          {tag}
        </Chip>
      ))}
    </View>
  );
}
export function TagChip({ tag, emphasized, style, mode }) {
  const theme = useTheme();
  const colorStyle = emphasized
    ? {
        backgroundColor: theme.colors.accent,
      }
    : {};
  return (
    <Chip mode={mode} style={{ marginLeft: 3, ...style, ...colorStyle }}>
      {tag}
    </Chip>
  );
}
