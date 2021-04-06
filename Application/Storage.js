import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeData(key, value) {
  try {
    let storeVal = value;
    if (typeof value == "object") storeVal = JSON.stringify(value);
    await AsyncStorage.setItem(key, storeVal);
  } catch (err) {
    console.error(err);
  }
}

export async function getData(key) {
  try {
    const result = await AsyncStorage.getItem(key);
    //const jsonRes = JSON.parse(result);
    if (result.includes("{")) return result != null ? JSON.parse(result) : null;
    else return result;
  } catch (err) {
    console.error(err);
  }
}
