import React, { useEffect } from "react";
import {
  Keyboard,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { withTheme, Portal, Modal, Menu, Chip } from "react-native-paper";
import { color } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function TagInput({ items, itemsKey, itemsTitle, onSelect, multiple, theme }) {
  // console.log("theme", theme);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [focus, setFocus] = React.useState(false);
  console.log("selectedItems", selectedItems);
  const getSelectedItems = () => {
    return selectedItems.map(({ name }) => {
      <Text>name</Text>;
    });
  };
  const input = React.useRef(null);
  const getOptions = () => {
    return items.map((option) => (
      <Chip
        onPress={() => {
          setSelectedItems([...selectedItems, option]);
        }}
        key={option[itemsKey]}
      >
        {option[itemsTitle]}
      </Chip>
    ));
  };
  return (
    <KeyboardAvoidingView>
      <Menu
        onDismiss={() => {
          setFocus(false);
        }}
        visible={focus}
        style={{ marginTop: 30 }}
        anchor={
          <TouchableOpacity
            onPress={() => {
              setFocus(true);
              input.current.focus();
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
              <TextInput
                style={{ width: 0, height: 0 }}
                ref={input}
              ></TextInput>
              <Icon
                style={{ marginLeft: "auto" }}
                color={theme.colors.primary}
                name="chevron-down"
                size={20}
              />
            </View>
          </TouchableOpacity>
        }
      >
        {getOptions()}
      </Menu>
      {/* <Portal>
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
      </Portal> */}
    </KeyboardAvoidingView>
  );
}
export default withTheme(TagInput);
