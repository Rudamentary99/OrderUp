import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeData(key, value) {
  try {
    const JSONValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, JSONValue);
  } catch (err) {
    console.error(err);
  }
}

export async function getData(key) {
  try {
    const result = await AsyncStorage.getItem(key);
    return result != null ? JSON.parse(result) : null;
  } catch (err) {
    console.error(err);
  }
}
