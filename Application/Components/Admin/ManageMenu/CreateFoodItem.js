import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, Button, TextInput, HelperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { createFoodItem } from "./foodController";
export default function CreateFoodItem(props) {
  // export default function App() {
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      name: "",
      prepTime: "",
    },
    mode: "onChange",
  });
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.containerStyle}>
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
          pattern: { value: /[0-9]+/, message: "not at number!" },
        }}
        render={({ onChange, value }) => {
          return (
            <View style={styles.controller}>
              <TextInput
                error={errors.prepTime}
                onChangeText={(text) => onChange(text)}
                value={value}
                label="Prep Time"
              />
              <HelperText type="error" visible={errors.prepTime}>
                {errors?.prepTime?.message}
              </HelperText>
            </View>
          );
        }}
      />
      <Button
        onPress={handleSubmit((data) => {
          createFoodItem({ ...data, archived: false })
            .then((result) => {
              // console.log("result", result);
              props.navigation.navigate("main", { ...data, ...result });
            })
            .catch((err) => {
              console.error(err);
            });
        })}
        label="Submit"
      >
        Submit
      </Button>
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
