import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Headline,
  Portal,
  Snackbar,
  Subheading,
  TextInput,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { getData, storeData } from "../Storage";
import { CustomStyles } from "../Styles";

function DefaultEnvironment({ onSave }) {
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
  useEffect(() => {
    loadData();
  });
  return (
    <View>
      <Headline>Default Environment</Headline>
      {editDefaultEnvironment ? (
        <View>
          <View style={{ marginBottom: 20 }}>
            <DropDown
              label="Default Environment"
              placeholder="Not Set"
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
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              onPress={() => {
                setEditDefaultEnvironment(false);
                loadData();
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                storeData("defaultEnvironment", defaultEnvironment)
                  .then((result) => {
                    onSave("Default environment has been saved!");
                  })
                  .catch((err) => {
                    console.error(err);
                  });
                setEditDefaultEnvironment(false);
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
            <Subheading>Default Environment:</Subheading>
            <Subheading>{defaultEnvironment || "Not Set"}</Subheading>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              onPress={() => {
                setEditDefaultEnvironment(true);
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

function ServerInfo({ onSave }) {
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
                storeData("serverInfo", serverInfo)
                  .then((result) => {
                    onSave("Server Info has been saved!");
                  })
                  .catch((err) => {});
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
  const [snackMessage, setSnackMessage] = useState("");
  return (
    <View
      style={[StyleSheet.absoluteFill, CustomStyles.container, { padding: 50 }]}
    >
      <DefaultEnvironment
        onSave={(message) => {
          setSnackMessage(message);
        }}
      />
      <ServerInfo
        onSave={(message) => {
          setSnackMessage(message);
        }}
      />
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

export function DeviceSettings(props) {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Device Settings" component={SettingsView} />
    </Stack.Navigator>
  );
}
