import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { withTheme, Portal, Modal } from "react-native-paper";
import { color } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function TagInput({ items, onSelect, multiple, theme }) {
  // console.log("theme", theme);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [focus, setFocus] = React.useState(false);
  const getSelectedItems = () => {
    return selectedItems.map(({ name }) => {
      <Text>name</Text>;
    });
  };
  const wrapperView = React.useRef();
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setFocus(true);
        }}
      >
        <View
          style={{
            minWidth: 200,
            flexDirection: "row",
            padding: 5,
            backgroundColor: theme.colors.background,
            borderRadius: theme.roundness,
          }}
        >
          {getSelectedItems()}
          <Icon
            style={{ marginLeft: "auto" }}
            color={theme.colors.primary}
            name="chevron-down"
            size={20}
          />
        </View>
      </TouchableOpacity>
      <Portal>
        <Modal
          visible={true}
          onDismiss={() => {
            setFocus(false);
          }}
          style={{ zIndex: 2000 }}
          style={{
            display: "flex",
            margin: 0,
            paddingBottom: 500,
          }}
          contentContainerStyle={{
            backgroundColor: theme.colors.surface,
            marginHorizontal: 100,
            padding: 50,
            // position: "absolute",
          }}
        >
          <View
            style={{
              minWidth: 200,
              flexDirection: "row",
              padding: 5,
              backgroundColor: theme.colors.background,
              borderRadius: theme.roundness,
            }}
          >
            <Text>test</Text>
          </View>
        </Modal>
      </Portal>
    </>
  );
}
export default withTheme(TagInput);
