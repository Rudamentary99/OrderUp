import React from "react";

import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  KeyboardAvoidingViewBase,
  TextInput as PlainInput,
} from "react-native";
import {
  Text,
  Button,
  TextInput,
  HelperText,
  List,
  IconButton,
} from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import {
  createFoodItem,
  updateFoodItem,
  getFoodTypes,
} from "../../../DB/foodController";
import DropDown from "react-native-paper-dropdown";
import { ListInput } from "../../helpers/ListInput";
export function ManageFoodItem(props) {
  const [selectingFoodType, setSelectingFoodType] = React.useState(false);
  const [foodTypes, setFoodTypes] = React.useState([]);
  const [tempIngredient, setTempIngredient] = React.useState("");
  React.useEffect(() => {
    if (!foodTypes.length)
      getFoodTypes()
        .then((result) => {
          setFoodTypes(result);
        })
        .catch((err) => {
          console.error(err);
        });
  });
  // export default function App() {
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      name: "",
      price: "",
      foodType: "",
      ingredients: [],
      ...props.route.params, //override if editing
      prepTime: props.route.params.prepTime
        ? props.route.params.prepTime / 60 / 1000 //convert to minutes from ms
        : "",
    },
    mode: "onChange",
  });
  return (
    <KeyboardAvoidingView
      // contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={useHeaderHeight() + 10}
      behavior="padding"
      style={[styles.containerStyle, { flex: 1 }]}
    >
      <ScrollView contentContainerStyle={{ justifyContent: "flex-end" }}>
        {/* <Text style={styles.headingStyle}>Form Builder Basic Demo</Text> */}
        <Controller
          name="name"
          control={control}
          rules={{
            required: { value: true, message: "Name is required" },
          }}
          render={({ onChange, value }) => (
            <View style={styles.controller}>
              <TextInput
                error={errors.name}
                errorText={errors?.name?.message}
                onChangeText={(text) => onChange(text)}
                value={value}
                label="Name"
              />
              <HelperText type="error" visible={errors.name}>
                {errors?.name?.message}
              </HelperText>
            </View>
          )}
        />
        <Controller
          name="prepTime"
          error={errors.prepTime}
          control={control}
          rules={{
            required: { value: true, message: "Prep Time is required" },
            pattern: { value: /^\d+$/, message: "not a number!" },
          }}
          render={({ onChange, value }) => {
            return (
              <View style={styles.controller}>
                <TextInput
                  error={errors.prepTime}
                  onChangeText={(text) => onChange(text)}
                  value={String(value)}
                  label="Prep Time (min)"
                />
                <HelperText type="error" visible={errors.prepTime}>
                  {errors?.prepTime?.message}
                </HelperText>
              </View>
            );
          }}
        />
        <Controller
          name="price"
          error={errors.price}
          control={control}
          rules={{
            required: { value: true, message: "price is required" },
            pattern: { value: /^\d+\.?\d+$/, message: "not at number!" },
          }}
          render={({ onChange, value }) => {
            return (
              <View style={styles.controller}>
                <TextInput
                  error={errors.price}
                  onChangeText={(text) => onChange(text)}
                  value={value}
                  label="Price ($)"
                />
                <HelperText type="error" visible={Boolean(errors.price)}>
                  {errors.price?.message}
                </HelperText>
              </View>
            );
          }}
        />
        <Controller
          name="foodType"
          control={control}
          rules={{
            required: { value: true, message: "Food Type is required" },
          }}
          render={({ onChange, value }) => {
            return (
              <>
                <DropDown
                  label="Food Type"
                  value={value}
                  setValue={(value) => {
                    onChange(value);
                  }}
                  visible={selectingFoodType}
                  onDismiss={() => {
                    setSelectingFoodType(false);
                  }}
                  showDropDown={() => {
                    setSelectingFoodType(true);
                  }}
                  inputProps={{ error: errors?.foodType }}
                  list={foodTypes.map((foodType) => {
                    return { value: foodType.name, label: foodType.name };
                  })}
                />

                <HelperText type="error" visible={errors?.foodType}>
                  {errors?.foodType?.message}
                </HelperText>
              </>
            );
          }}
        />
        <Controller
          name="ingredients"
          control={control}
          render={({ onChange, value }) => {
            return (
              <ListInput
                listTitle="Ingredients"
                inputTitle="New Ingredient"
                items={value}
                onChange={(newIngredient) => {
                  onChange([...value, newIngredient]);
                }}
                onRemove={(index) => {
                  let temp = value;
                  temp.splice(index);
                  onChange([...temp]);
                }}
                sortFunction={(a, b) => a.localeCompare(b)}
              />
            );
          }}
        />
        <Button
          onPress={handleSubmit((data) => {
            if (Boolean(props.route.params?.name)) {
              const newItem = {
                ...data,
                id: props.route.params.id,
                prepTime: data.prepTime * 60 * 1000,
              };
              updateFoodItem(newItem)
                .then((success) => {
                  // console.log("result", result);
                  if (success)
                    props.navigation.navigate(
                      "Food Details",
                      props.route.params
                    );
                  else
                    console.error(
                      "something went wrong. could not update FoodItem"
                    );
                })
                .catch((err) => {
                  console.error(err);
                });
            } else {
              createFoodItem({ ...data, archived: false })
                .then((result) => {
                  // console.log("result", result);
                  props.navigation.navigate("Food Items");
                })
                .catch((err) => {
                  console.error(err);
                });
            }
          })}
          label="Submit"
        >
          {Boolean(props.route.params?.name) ? "Save Changes" : "Save"}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    padding: 50,
  },
  controller: {
    marginVertical: 10,
  },
});
