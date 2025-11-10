import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { THEME } from "../styles/theme";

interface HeaderProps {
  title: string;
  sub?: string;
  count?: number;
}

const Header: React.FC<HeaderProps> = ({ title, sub, count }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      {sub && <Text style={styles.subtitle}>{sub}</Text>}
      {typeof count === "number" && <Text style={styles.count}>{count} dishes</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: THEME.primary,
    borderBottomWidth: 2,
    borderBottomColor: THEME.accent,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#D6E4FF",
    marginTop: 4,
    fontSize: 16,
  },
  count: {
    color: "#fff",
    marginTop: 6,
    fontWeight: "700",
  },
});

export default Header;