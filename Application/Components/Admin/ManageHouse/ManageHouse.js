import React from "react";
import { Text, BottomNavigation } from "react-native-paper";
import ManageFloor from "./ManageFloor/ManageFloor";
import ManageWaiters from "./ManageWaiters/ManageWaiters";

const ManageHouse = (props) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "manageWaiters", title: "Manage Servers", icon: "account-multiple" },
    { key: "manageFloors", title: "Manage Floors", icon: "table-furniture" },
  ]);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={BottomNavigation.SceneMap({
        manageWaiters: ManageWaiters,
        manageFloors: ManageFloor,
      })}
      shifting
    />
  );
};
export default ManageHouse;
