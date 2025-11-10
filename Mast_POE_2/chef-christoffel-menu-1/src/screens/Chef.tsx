import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Dish, Course } from "../types"; // Assuming you have a types file for shared types
import { COURSES } from "../styles/theme"; // Import courses from theme
import { save, load } from "../utils/storage"; // Import storage functions

const Chef = ({ menu, add, remove, back }: { menu: Dish[]; add: (d: Omit<Dish, "id" | "createdAt">) => void; remove: (id: string) => void; back: () => void }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [course, setCourse] = useState<Course>("Mains");
  const [price, setPrice] = useState("");

  const submit = () => {
    if (!name.trim()) return Alert.alert("Validation", "Enter dish name.");
    const p = parseFloat(price);
    if (Number.isNaN(p) || p < 0) return Alert.alert("Validation", "Enter valid price.");
    add({ name: name.trim(), description: desc.trim(), course, price: p });
    setName("");
    setDesc("");
    setCourse("Mains");
    setPrice("");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={back}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Manager — Add / Remove</Text>
        <Text style={styles.subtitle}>Total {menu.length} dishes</Text>
      </View>

      <View style={styles.form}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={[styles.input, { height: 80 }]} multiline />
        <View style={styles.courseRow}>
          {COURSES.map(c => (
            <TouchableOpacity key={c} onPress={() => setCourse(c)} style={[styles.courseOption, course === c && styles.selectedCourse]}>
              <Text style={[styles.courseText, course === c && styles.selectedCourseText]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput placeholder="Price e.g. 120.00" value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={styles.input} />
        <View style={styles.formActions}>
          <TouchableOpacity onPress={() => { setName(""); setDesc(""); setCourse("Mains"); setPrice(""); }} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={submit} style={styles.addButton}>
            <Text style={styles.addText}>Add Dish</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={menu}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.listItemName}>{item.name}</Text>
              <Text style={styles.listItemDetails}>{item.course} • R{item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => remove(item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>No dishes yet.</Text></View>}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FB", padding: 16 },
  header: { marginBottom: 16 },
  backButton: { color: "#246BFD", fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "700", color: "#1F2937" },
  subtitle: { color: "#6B7280", marginTop: 4 },
  form: { backgroundColor: "#FFF", borderRadius: 8, padding: 16, marginBottom: 16 },
  input: { backgroundColor: "#F9FAFB", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 12 },
  courseRow: { flexDirection: "row", marginBottom: 12 },
  courseOption: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FFF", marginRight: 8 },
  selectedCourse: { backgroundColor: "#246BFD" },
  courseText: { color: "#1F2937", fontWeight: "700" },
  selectedCourseText: { color: "#FFF" },
  formActions: { flexDirection: "row", justifyContent: "space-between" },
  resetButton: { flex: 1, borderWidth: 1, borderColor: "#E5E7EB", padding: 12, borderRadius: 8, alignItems: "center", marginRight: 8 },
  resetText: { fontWeight: "700", color: "#6B7280" },
  addButton: { flex: 1, backgroundColor: "#246BFD", padding: 12, borderRadius: 8, alignItems: "center" },
  addText: { color: "#FFF", fontWeight: "700" },
  listItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: "#FFF", marginBottom: 8, borderRadius: 8 },
  listItemName: { fontWeight: "700", color: "#1F2937" },
  listItemDetails: { color: "#6B7280", marginTop: 4 },
  removeButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#FF6B6B" },
  removeButtonText: { color: "#FFF", fontWeight: "700" },
  empty: { padding: 24, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default Chef;