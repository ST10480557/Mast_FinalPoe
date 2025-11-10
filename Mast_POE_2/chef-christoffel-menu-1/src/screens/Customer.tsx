import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Card from "../components/Card";
import { Course, Dish } from "../types"; // Assuming you have a types file for shared types

const COURSES: Course[] = ["Starters", "Mains", "Desserts"];

const Customer = ({ menu, openManager }: { menu: Dish[]; openManager: () => void }) => {
  const [filter, setFilter] = useState<"All" | Course>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = useMemo(() => {
    let items = filter === "All" ? menu : menu.filter(dish => dish.course === filter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(dish => dish.name.toLowerCase().includes(query) || (dish.description || "").toLowerCase().includes(query));
    }
    return items;
  }, [menu, filter, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => setFilter("All")} style={[styles.filterButton, filter === "All" && styles.activeFilter]}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          {COURSES.map(course => (
            <TouchableOpacity key={course} onPress={() => setFilter(course)} style={[styles.filterButton, filter === course && styles.activeFilter]}>
              <Text style={styles.filterText}>{course}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={openManager} style={styles.managerButton}>
          <Text style={styles.managerButtonText}>Manager</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMenu}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Card item={item} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>No dishes found.</Text></View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F6F8FB",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeFilter: {
    backgroundColor: "#246BFD",
  },
  filterText: {
    color: "#1F2937",
    fontWeight: "600",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  managerButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  managerButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  empty: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
  },
});

export default Customer;