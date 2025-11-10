import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../styles/theme";

const themes = [
  { name: "Light", colors: { primary: "#246BFD", background: "#F6F8FB", text: "#1F2937" } },
  { name: "Dark", colors: { primary: "#1F2937", background: "#2D2D2D", text: "#FFFFFF" } },
  { name: "Colorful", colors: { primary: "#FF6B6B", background: "#FFFAF0", text: "#1F2937" } },
];

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Theme</Text>
      {themes.map((theme) => (
        <TouchableOpacity
          key={theme.name}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => setTheme(theme.colors)}
        >
          <Text style={styles.buttonText}>{theme.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default ThemeSwitcher;