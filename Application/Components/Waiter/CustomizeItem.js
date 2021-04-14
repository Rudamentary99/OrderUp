import { useHeaderHeight } from "@react-navigation/stack";
import React from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import {
  Button,
  Headline,
  List,
  Subheading,
  TextInput,
} from "react-native-paper";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { CustomStyles } from "../../Styles";
import { TagInput } from "../helpers/Tag";
import { getTags } from "../../DB/SettingsController";
export function customizeItem({
  navigation,
  route: {
    params: { item, onSubmit },
  },
}) {
  // console.log(
  //   ` navigation.dangerouslyGetState()`,
  //   navigation.dangerouslyGetState().routes
  // );
  //const [item, setItem] = React.useState(params.item);
  const [ingredientOpen, setIngredientOpen] = React.useState(true);
  const [excludedIngredients, setExcludedIngredients] = React.useState(
    item?.customization?.excludedIngredients || []
  );
  const [customTags, setCustomTags] = React.useState(
    item?.customization?.customTags || item?.tags || []
  );
  const [tags, setTags] = React.useState([]);
  const [notes, setNotes] = React.useState(item?.customization?.notes || "");
  React.useEffect(() => {
    if (!tags.length)
      getTags()
        .then((result) => {
          setTags(result);
        })
        .catch((err) => {
          console.error(err);
        });
  });

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={useHeaderHeight() + 10}
      behavior="padding"
      style={{ padding: 50, flex: 1, ...CustomStyles.container }}
    >
      <Headline>{item.name}</Headline>
      <ScrollView contentContainerStyle={{ justifyContent: "flex-end" }}>
        <View style={{ marginBottom: 20 }}>
          <List.Accordion
            title="Ingredients"
            expanded={ingredientOpen}
            onPress={() => {
              setIngredientOpen(!ingredientOpen);
            }}
          >
            {item?.ingredients?.length ? (
              item?.ingredients.map((ingredient) => (
                <List.Item
                  key={uuidv4()}
                  title={ingredient}
                  left={() => (
                    <List.Icon
                      style={{ opacity: 0.5 }}
                      icon={
                        excludedIngredients?.find((ei) => ei == ingredient)
                          ? "checkbox-blank-circle-outline"
                          : "checkbox-marked-circle-outline"
                      }
                    />
                  )}
                  onPress={() => {
                    //if ingredient is already excluded
                    let tempExcludedIngredients = excludedIngredients.find(
                      (ei) => ei == ingredient
                    )
                      ? //remove it
                        excludedIngredients.filter((ei) => ei != ingredient)
                      : //otherwise add it
                        [...excludedIngredients, ingredient];
                    setExcludedIngredients(tempExcludedIngredients);
                  }}
                />
              ))
            ) : (
              <List.Item title="This item has no ingredients." />
            )}
          </List.Accordion>
        </View>
        <TextInput
          label="Notes"
          value={notes}
          onChangeText={(text) => {
            setNotes(text);
          }}
          mode="outlined"
          multiline={true}
        />
        <TagInput
          items={tags.map(({ name }) => name)}
          selectedItems={customTags}
          style={{ padding: 30 }}
          onChangeSelection={(newTags) => {
            setCustomTags(newTags);
          }}
        />
        <Button
          onPress={() => {
            onSubmit({
              ...item,
              customization: {
                notes: notes,
                excludedIngredients: excludedIngredients,
                customTags: customTags,
              },
            });
            navigation.goBack();
          }}
        >
          Submit
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
