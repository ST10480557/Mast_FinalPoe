import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dish } from "../types"; // Assuming you have a types file for your Dish type

const STORAGE_KEY = "@chef_menu_items_v2";

export const loadMenuItems = async (): Promise<Dish[]> => {
  try {
    const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error("Failed to load menu items from storage:", error);
    return [];
  }
};

export const saveMenuItems = async (items: Dish[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save menu items to storage:", error);
  }
};