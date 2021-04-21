import { useNavigation } from "@react-navigation/native";
import react from "react";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Subheading, Surface, Text } from "react-native-paper";
import { getTags } from "../../DB/SettingsController";
import { CustomStyles } from "../../Styles";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { TagChip, TagInput } from "../helpers/Tag";
import { getData, removeData, storeData } from "../../Storage";

function DeviceFilter(props) {
  const [tags, setTags] = React.useState([]);
  const [editTags, setEditTags] = React.useState(false);
  const [filterTags, setFilterTags] = React.useState([]);
  const navigation = useNavigation();
  const loadData = () => {
    getTags()
      .then((result) => {
        if (result?.length) setTags(result);
      })
      .catch((err) => {
        console.error(err);
      });
    getData("filterTags")
      .then((result) => {
        if (result) {
          setFilterTags(result);
        } else {
          setFilterTags([]);
        }
        console.log(`result`, result);
      })
      .catch((err) => console.error(err));
  };
  React.useEffect((params) => {
    const focusListener = navigation.addListener("focus", loadData);
    return focusListener;
  });
  return (
    <View style={CustomStyles.container}>
      <Subheading>Filter</Subheading>
      {/* <View style={CustomStyles.tagWrapper}>
        <Text>test</Text>
      </View> */}
      {editTags ? (
        <View>
          <Surface style={{ padding: 10 }}>
            <TagInput
              items={tags.map(({ name }) => name)}
              tagMode="flat"
              onChangeSelection={setFilterTags}
              selectedItems={filterTags}
            />
          </Surface>
          <View style={CustomStyles.buttonWrapperEnd}>
            <Button
              onPress={() => {
                loadData();

                setEditTags(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                // removeData("filterTags");
                storeData("filterTags", filterTags);
                setEditTags(false);
                loadData();
              }}
            >
              Save
            </Button>
          </View>
        </View>
      ) : (
        <View>
          <View style={CustomStyles.tagWrapper}>
            {tags?.map((tag) => (
              <Chip
                key={uuidv4()}
                mode="outlined"
                selected={filterTags.find((ft) => ft == tag.name)}
                style={{ marginRight: 3 }}
              >
                {tag.name}
              </Chip>
            ))}
          </View>
          <View style={CustomStyles.buttonWrapperEnd}>
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
    </View>
  );
}
export function KitchenSettings(props) {
  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, CustomStyles.container, { padding: 50 }]}
    >
      <DeviceFilter />
    </ScrollView>
  );
}
