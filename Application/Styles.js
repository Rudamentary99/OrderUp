import { StyleSheet } from "react-native";

export const CustomStyles = StyleSheet.create({
  container: {
    paddingHorizontal: "20%",
  },
  dialogContainer: {
    marginHorizontal: "20%",
  },
  bottomRightAction: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 50,
  },
  transparentBackground: {
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
  tagWrapper: {
    flexDirection: "row",
  },
  buttonWrapperEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
});
