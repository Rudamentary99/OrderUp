import react from "react";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  Dialog,
  FAB,
  HelperText,
  IconButton,
  List,
  Snackbar,
  Surface,
  Text,
  TextInput,
  Portal,
  useTheme,
  Divider,
} from "react-native-paper";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { getTags, updateTags } from "../../../DB/SettingsController";
export function FoodSettings({ route, navigation }) {
  const [tagList, setTagList] = React.useState([]);
  const [removedTags, setRemovedTags] = React.useState([]);
  const [editTags, setEditTags] = React.useState(false);
  const [createTag, setCreateTag] = React.useState(false);
  const [newTagName, setNewTagName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [snackMessage, setSnackMessage] = React.useState(
    route.params?.snackMessage || ""
  );
  const loadData = () => {
    getTags()
      .then((result) => {
        setTagList(result);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  React.useEffect(() => {
    const focusListener = navigation.addListener("focus", loadData);
    return focusListener;
  });
  const { roundness } = useTheme();
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { padding: 50, paddingLeft: "10%", paddingRight: "10%" },
      ]}
    >
      <List.Section title="Tags">
        {editTags ? (
          <View style={{ alignItems: "center" }}>
            {tagList.map((tag) => (
              <Surface
                style={{
                  maxWidth: 600,
                  width: "100%",
                  borderRadius: roundness,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 20,
                  padding: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 20,
                  }}
                >
                  <Chip>{tag.name}</Chip>
                </View>

                <IconButton
                  icon="close-circle-outline"
                  onPress={() => {
                    if (tag.id) setRemovedTags([...removedTags, tag]);
                    setTagList(tagList.filter(({ name }) => name != tag.name));
                  }}
                ></IconButton>
              </Surface>
            ))}
            <FAB
              label="Create New"
              onPress={() => {
                setCreateTag(true);
              }}
              style={{ width: 300, alignSelf: "center", marginBottom: 20 }}
              small
            />
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  onPress={() => {
                    setEditTags(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    updateTags(tagList, removedTags)
                      .then((result) => {
                        if (result) {
                          setSnackMessage("Tags Updated Successfully!");
                          loadData();
                          setEditTags(false);
                          setRemovedTags([]);
                        }
                        console.log(`result`, result);
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }}
                >
                  Save
                </Button>
              </View>
            </View>
          </View>
        ) : (
          <View>
            {tagList.map((tag) => (
              <View
                style={{
                  maxWidth: 600,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: 5,
                  paddingLeft: 150,
                  marginBottom: 20,
                }}
              >
                <Chip>{tag.name}</Chip>
                <Divider />
              </View>
            ))}
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button
                onPress={() => {
                  setEditTags(true);
                }}
              >
                Edit
              </Button>
            </View>
          </View>
        )}
      </List.Section>

      <Dialog
        visible={createTag}
        onDismiss={() => {
          setCreateTag(false);
        }}
        style={{ marginBottom: 400 }}
      >
        <Dialog.Title label="New Tag">New Tag</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="name"
            value={newTagName}
            error={errorMessage}
            autoFocus
            autoCapitalize="words"
            onChangeText={(text) => {
              if (tagList.find(({ name }) => name == text)) {
                setErrorMessage("Tag already exists!");
              } else {
                setErrorMessage("");
              }
              setNewTagName(text);
            }}
          />
          <HelperText visible={errorMessage}>{errorMessage}</HelperText>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setNewTagName("");
              setErrorMessage("");
              setCreateTag(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={errorMessage}
            onPress={() => {
              setTagList([...tagList, { name: newTagName }]);
              setNewTagName("");
              setCreateTag(false);
            }}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Portal>
        <Snackbar
          visible={snackMessage}
          onDismiss={() => {
            setSnackMessage("");
          }}
        >
          {snackMessage}
        </Snackbar>
      </Portal>
    </View>
  );
}
