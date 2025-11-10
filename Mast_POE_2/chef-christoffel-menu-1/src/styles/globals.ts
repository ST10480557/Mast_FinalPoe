import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    padding: 16,
  },
  text: {
    color: "#1F2937",
    fontSize: 16,
    fontFamily: "Arial",
  },
  button: {
    backgroundColor: "#246BFD",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default globalStyles;