import React from "react";
import { Card, Modal, Title, List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
function navigate(route) {
  useNavigation().navigate(route);
}
export default class Floor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: null,
      viewDetails: this.props.isEditing,
    };
  }

  render() {
    const { name, tables, isActive } = this.props;
    const { viewDetails } = this.state;

    return (
      <Card
        onPress={() => {
          navigate("temp");
        }}
        style={{
          width: 250,
          height: 250,
          margin: 20,
        }}
      >
        <Card.Title title={name} subtitle="Card Subtitle" />
        <Card.Content></Card.Content>
        <Modal
          visible={viewDetails}
          onDismiss={() => {
            this.setState({ viewDetails: false });
          }}
        >
          <Title>{name}</Title>
          {/* <List>
            {tables.map((table) => {
              return <List.Item title={table.name}></List.Item>;
            })}
          </List> */}
        </Modal>
      </Card>
    );
  }
}
