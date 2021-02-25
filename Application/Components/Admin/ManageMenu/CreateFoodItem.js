import React from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { Text, Button, TextInput, HelperText } from "react-native-paper";
import FormBuilder from "react-native-paper-form-builder";
import { useForm, Controller } from "react-hook-form";
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
          <TextInput
            error={errors.name}
            errorText={errors?.name?.message}
            onChangeText={(text) => onChange(text)}
            value={value}
            label="Name"
          />
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
            <>
              <TextInput
                error={errors.prepTime}
                onChangeText={(text) => onChange(text)}
                value={value}
                label="Prep Time"
              />
              <HelperText type="error" visible={errors.prepTime}>
                {errors?.prepTime?.message}
              </HelperText>
            </>
          );
        }}
      />
      <Button
        onPress={handleSubmit((data) => {
          console.log(data, "data");
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
    flex: 1,
  },

  scrollViewStyle: {
    flex: 1,

    padding: 15,

    justifyContent: "center",
  },

  headingStyle: {
    fontSize: 30,

    textAlign: "center",

    marginBottom: 40,
  },
});
