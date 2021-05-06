import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
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
  Subheading,
  Paragraph,
} from "react-native-paper";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { getTags, updateTags } from "../../../DB/SettingsController";
import { getFoodTypes, updateFoodTypes } from "../../../DB/foodController";
import { CustomStyles } from "../../../Styles";

function ManageTags({ route, navigation }) {
  const [tagList, setTagList] = React.useState([]);
  const [removedTags, setRemovedTags] = React.useState([]);
  const [editTags, setEditTags] = React.useState(false);
  const [createTag, setCreateTag] = React.useState(false);
  const [newTagName, setNewTagName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [snackMessage, setSnackMessage] = React.useState("");
  const loadData = () => {
    getTags()
      .then((result) => {
        if (result?.length) setTagList(result);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  React.useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      setSnackMessage(route.params?.snackMessage);
      navigation.setParams({ snackMessage: null });
      loadData();
    });
    return focusListener;
  });
  const { roundness } = useTheme();
  return (
    <View>
      <List.Section title="Tags">
        {editTags ? (
          <View style={{ alignItems: "center" }}>
            {tagList.map((foodType) => (
              <Surface
                key={uuidv4()}
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
                  <Chip>{foodType.name}</Chip>
                </View>

                <IconButton
                  icon="close-circle-outline"
                  onPress={() => {
                    if (foodType.id) setRemovedTags([...removedTags, foodType]);
                    setTagList(
                      tagList.filter(({ name }) => name != foodType.name)
                    );
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
            {tagList.map((foodType) => (
              <View
                key={uuidv4()}
                style={{
                  maxWidth: 600,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: 5,
                  paddingLeft: 25,
                  marginBottom: 20,
                }}
              >
                <Chip mode="outlined">{foodType.name}</Chip>
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
      <Portal>
        <Dialog
          visible={createTag}
          onDismiss={() => {
            setCreateTag(false);
          }}
          style={{ marginBottom: 400, ...CustomStyles.dialogContainer }}
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
      </Portal>

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
function ManageFoodType({ route, navigation }) {
  const [foodTypes, setFoodTypes] = React.useState([]);
  const [removedFoodTypes, setRemovedFoodTypes] = React.useState([]);
  const [editFoodTypes, setEditFoodTypes] = React.useState(false);
  const [updateFoodType, setUpdateFoodType] = React.useState({});
  const [createFoodType, setCreateFoodType] = React.useState(false);
  const [newFoodTypeName, setNewFoodTypeName] = React.useState("");
  const [newFoodTypePriority, setNewFoodTypePriority] = React.useState("0");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [priorityErrorMessage, setPriorityErrorMessage] = React.useState("");
  const [snackMessage, setSnackMessage] = React.useState("");
  const [deleteItem, setDeleteItem] = React.useState(null);
  const loadData = () => {
    getFoodTypes()
      .then((result) => {
        // console.log(`result`, result);
        if (result?.length) {
          setFoodTypes(result);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  React.useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      setSnackMessage(route.params?.snackMessage);
      //  navigation?.setParams({ snackMessage: null });
      loadData();
    });
    return focusListener;
  });
  const { roundness } = useTheme();
  return (
    <View style={{ paddingBottom: 100 }}>
      <List.Section title="Food Types">
        {editFoodTypes ? (
          <View style={{ alignItems: "center" }}>
            {foodTypes
              .sort((a, b) => b.priority - a.priority)
              .map((foodType) => (
                <Surface
                  key={uuidv4()}
                  style={{ maxWidth: 600, width: "100%", marginBottom: 20 }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setUpdateFoodType(foodType);
                    }}
                  >
                    <View
                      style={{
                        borderRadius: roundness,
                        flexDirection: "row",
                        justifyContent: "space-between",

                        padding: 5,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          paddingLeft: 20,
                        }}
                      >
                        <Subheading>{foodType.name}</Subheading>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            paddingRight: "10%",
                          }}
                        >
                          {foodType.priority}
                        </Text>
                        <IconButton
                          icon="close-circle-outline"
                          onPress={() => {
                            if (foodType.id) setDeleteItem(foodType);
                          }}
                        ></IconButton>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Surface>
              ))}
            <FAB
              label="Create New"
              onPress={() => {
                setCreateFoodType(true);
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
                    setEditFoodTypes(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    updateFoodTypes(foodTypes, removedFoodTypes)
                      .then((result) => {
                        if (result) {
                          setSnackMessage("Food Types Updated Successfully!");
                          loadData();
                          setEditFoodTypes(false);
                          setRemovedFoodTypes([]);
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
            {foodTypes
              .sort((a, b) => b.priority - a.priority)
              .map((foodType) => (
                <View
                  key={uuidv4()}
                  style={{
                    maxWidth: 600,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    padding: 5,
                    paddingLeft: 50,
                    justifyContent: "space-between",
                    marginBottom: 20,
                    //backgroundColor: "black",
                  }}
                >
                  <Subheading>{foodType.name}</Subheading>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingRight: "10%",
                      textAlign: "right",
                    }}
                  >
                    {foodType.priority}
                  </Text>
                </View>
              ))}
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button
                onPress={() => {
                  setEditFoodTypes(true);
                }}
              >
                Edit
              </Button>
            </View>
          </View>
        )}
      </List.Section>
      <Portal>
        <Dialog
          visible={createFoodType}
          onDismiss={() => {
            setCreateFoodType(false);
          }}
          style={{ marginBottom: 400, ...CustomStyles.dialogContainer }}
        >
          <Dialog.Title label="New Tag">New Food Type</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name*"
              value={newFoodTypeName}
              error={errorMessage}
              autoFocus
              autoCapitalize="words"
              onChangeText={(text) => {
                if (foodTypes.find(({ name }) => name == text)) {
                  setErrorMessage("Food Type already exists!");
                } else {
                  setErrorMessage("");
                }
                setNewFoodTypeName(text);
              }}
            />
            <HelperText visible={errorMessage}>{errorMessage}</HelperText>
            <TextInput
              label="Priority"
              value={newFoodTypePriority}
              error={priorityErrorMessage}
              onChangeText={(text) => {
                if (isNaN(Number(text)))
                  setPriorityErrorMessage("Value must be a number.");
                else setPriorityErrorMessage("");
                setNewFoodTypePriority(text.replace(/^0+/, ""));
              }}
            />
            <HelperText visible={priorityErrorMessage}>
              {priorityErrorMessage}
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setNewFoodTypeName("");
                setNewFoodTypePriority("0");
                setErrorMessage("");
                setCreateFoodType(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={
                errorMessage || priorityErrorMessage || !newFoodTypeName
              }
              onPress={() => {
                setFoodTypes([
                  ...foodTypes,
                  { name: newFoodTypeName, priority: newFoodTypePriority },
                ]);
                setNewFoodTypeName("");
                setCreateFoodType(false);
              }}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={updateFoodType.name}
          onDismiss={() => {
            setUpdateFoodType({});
          }}
          style={{ marginBottom: 400 }}
        >
          <Dialog.Title label="New Tag">Update Food Type</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name*"
              disabled
              value={updateFoodType.name}
              error={errorMessage}
              autoFocus
              autoCapitalize="words"
              onChangeText={(text) => {
                if (foodTypes.find(({ name }) => name == text)) {
                  setErrorMessage("Food Type already exists!");
                } else {
                  setErrorMessage("");
                }
                setNewFoodTypeName(text);
              }}
            />
            <HelperText visible={errorMessage}>{errorMessage}</HelperText>
            <TextInput
              label="Priority"
              value={updateFoodType.priority}
              error={priorityErrorMessage}
              onChangeText={(text) => {
                if (isNaN(Number(text)))
                  setPriorityErrorMessage("Value must be a number.");
                else setPriorityErrorMessage("");
                setUpdateFoodType({
                  ...updateFoodType,
                  priority: text.replace(/^0+/, ""),
                });
              }}
            />
            <HelperText visible={priorityErrorMessage}>
              {priorityErrorMessage}
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setUpdateFoodType({});
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={errorMessage || priorityErrorMessage}
              onPress={() => {
                setRemovedFoodTypes([...removedFoodTypes, updateFoodType]);
                setFoodTypes(
                  foodTypes.map((item) =>
                    item.id == updateFoodType.id
                      ? { ...updateFoodType, id: undefined }
                      : item
                  )
                );
                setUpdateFoodType({});
              }}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={deleteItem}
          onDismiss={() => {
            setDeleteItem(nulls);
          }}
          style={CustomStyles.dialogContainer}
        >
          <Dialog.Title>
            Are you sure you want to remove food type "{deleteItem?.name}"?
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Deleting this item could cause loss of menu items. Ensure all
              foods of this type have been updated before performing this
              action!
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                if (deleteItem) {
                  setRemovedFoodTypes([...removedFoodTypes, deleteItem]);
                  setFoodTypes(
                    foodTypes.filter(({ name }) => name != deleteItem?.name)
                  );
                  setDeleteItem(null);
                }
              }}
            >
              Proceed
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setDeleteItem(null);
              }}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
export function FoodSettings({ route, navigation }) {
  return (
    <ScrollView
      style={[
        StyleSheet.absoluteFill,
        { padding: 50, ...CustomStyles.container },
      ]}
    >
      <ManageTags route={route} navigation={navigation} />
      <ManageFoodType route={route} navigation={navigation} />
    </ScrollView>
  );
}
