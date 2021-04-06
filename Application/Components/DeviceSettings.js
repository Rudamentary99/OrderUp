import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Headline, Subheading, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { getData, storeData } from "../Storage";
import { CustomStyles } from "../Styles";

function DefaultEnvironment(props) {
  const [editDefaultEnvironment, setEditDefaultEnvironment] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [defaultEnvironment, setDefaultEnvironment] = useState("");
  const loadData = () => {
    getData("defaultEnvironment")
      .then((result) => {
        setDefaultEnvironment(result || "");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <View>
      <Headline>Default Environment</Headline>
      {editDefaultEnvironment ? (
        <View>
          <DropDown
            value={defaultEnvironment}
            setValue={setDefaultEnvironment}
            visible={showDropdown}
            showDropDown={() => {
              setShowDropdown(true);
            }}
            onDismiss={() => {
              setShowDropdown(false);
            }}
            list={[
              { value: "Management", label: "Management" },
              { value: "Waiter", label: "Waiter" },
              { value: "Kitchen", label: "Kitchen" },
            ]}
          />
        </View>
      ) : (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Subheading>Default Environment:</Subheading>
          <Subheading>{defaultEnvironment}</Subheading>
        </View>
      )}
    </View>
  );
}

function ServerInfo(props) {
  const [editServerInfo, setEditServerInfo] = useState(false);
  const [serverInfo, setServerInfo] = useState({});
  const loadData = () => {
    getData("serverInfo")
      .then((result) => {
        // console.log(`result`, result);

        setServerInfo(result || {});
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    loadData();
  });

  return (
    <View>
      <Headline>Server info</Headline>
      {editServerInfo ? (
        <View>
          <TextInput
            label="Host"
            value={serverInfo.host}
            onChangeText={(text) => {
              setServerInfo({ ...serverInfo, host: text });
            }}
          />
          <TextInput
            label="Port"
            value={serverInfo.port}
            onChangeText={(text) => {
              setServerInfo({ ...serverInfo, port: text });
            }}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              onPress={() => {
                setEditServerInfo(false);
                loadData();
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                storeData("serverInfo", serverInfo);
                setEditServerInfo(false);
              }}
            >
              Save
            </Button>
          </View>
        </View>
      ) : (
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Subheading>Host:</Subheading>
            <Subheading>{serverInfo.host || "Not Given"}</Subheading>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Subheading>Port:</Subheading>
            <Subheading>{serverInfo.port || "Not Given"}</Subheading>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              onPress={() => {
                setEditServerInfo(true);
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

function SettingsView() {
  return (
    <View
      style={[StyleSheet.absoluteFill, CustomStyles.container, { padding: 50 }]}
    >
      <ServerInfo />
    </View>
  );
}

export function DeviceSettings(props) {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Device Settings" component={SettingsView} />
    </Stack.Navigator>
  );
}
