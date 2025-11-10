import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type NavProps = {
  screen: "customer" | "chef";
  setScreen: (screen: "customer" | "chef") => void;
};

const Nav: React.FC<NavProps> = ({ screen, setScreen }) => {
  return (
    <View style={styles.nav}>
      <TouchableOpacity
        style={[styles.tab, screen === "customer" && styles.activeTab]}
        onPress={() => setScreen("customer")}
      >
        <Text style={[styles.tabText, screen === "customer" && styles.activeTabText]}>Customer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, screen === "chef" && styles.activeTab]}
        onPress={() => setScreen("chef")}
      >
        <Text style={[styles.tabText, screen === "chef" && styles.activeTabText]}>Manager</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    elevation: 5,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#F0F6FF",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#246BFD",
  },
  tabText: {
    color: "#6B7280",
    fontWeight: "700",
  },
  activeTabText: {
    color: "#246BFD",
    fontWeight: "800",
  },
});

export default Nav;