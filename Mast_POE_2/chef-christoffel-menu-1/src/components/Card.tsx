import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Dish } from "../types"; // Assuming you have a types file for Dish type
import { courseColor } from "../styles/theme"; // Assuming you have a theme file for course colors

interface CardProps {
  item: Dish;
  onQty?: (id: string, d: number) => void;
  onRemove?: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ item, onQty, onRemove }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.strip, { backgroundColor: courseColor(item.course) }]} />
      <Text style={styles.ct}>{item.name}</Text>
      <Text style={styles.cc}>{item.course}</Text>
      {item.description ? <Text style={styles.cd}>{item.description}</Text> : null}
      <View style={styles.cf}>
        <Text style={styles.cp}>R{item.price.toFixed(2)}</Text>
        <View style={styles.row}>
          {onQty ? (
            <>
              <TouchableOpacity onPress={() => onQty(item.id, -1)} style={styles.q}>
                <Text style={styles.qt}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onQty(item.id, +1)} style={styles.q}>
                <Text style={styles.qt}>+</Text>
              </TouchableOpacity>
            </>
          ) : null}
          {onRemove ? (
            <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.rm}>
              <Text style={styles.rmt}>Remove</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 6,
    minWidth: 140,
    maxWidth: "48%",
    elevation: 3,
  },
  strip: {
    height: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  ct: {
    fontWeight: "800",
    color: "#1F2937",
  },
  cc: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  cd: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 8,
    minHeight: 36,
  },
  cf: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cp: {
    fontWeight: "900",
    color: "#1F2937",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  q: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 6,
  },
  qt: {
    fontWeight: "900",
  },
  rm: {
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#FF6B6B",
  },
  rmt: {
    color: "#fff",
    fontWeight: "800",
  },
});

export default Card;