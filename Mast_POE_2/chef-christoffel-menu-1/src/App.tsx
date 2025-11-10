import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Customer from "./screens/Customer";
import Chef from "./screens/Chef";
import { load, save } from "./utils/storage";
import { Dish } from "./types";
import { THEME } from "./styles/theme";

const STORAGE_KEY = "@chef_menu_items_v2";

export default function App(): JSX.Element {
  const [menu, setMenu] = useState<Dish[]>([]);
  const [screen, setScreen] = useState<"customer" | "chef">("customer");

  useEffect(() => {
    (async () => {
      const m = await load(STORAGE_KEY);
      setMenu(m);
    })();
  }, []);

  const persist = async (items: Dish[]) => {
    setMenu(items);
    await save(STORAGE_KEY, items);
  };

  const addDish = (dish: Omit<Dish, "id" | "createdAt">) => {
    const newDish = { ...dish, id: String(Date.now()), createdAt: Date.now() };
    persist([...menu, newDish]);
  };

  const removeDish = (id: string) => {
    const updatedMenu = menu.filter((dish) => dish.id !== id);
    persist(updatedMenu);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar backgroundColor={THEME.primary} barStyle="light-content" />
      <Header title="Chef Christoffel" sub="Fresh menu — always up to date" count={menu.length} />
      <View style={{ flex: 1 }}>
        {screen === "customer" ? (
          <Customer menu={menu} openManager={() => setScreen("chef")} />
        ) : (
          <Chef menu={menu} add={addDish} remove={removeDish} back={() => setScreen("customer")} />
        )}
      </View>
      <Nav screen={screen} setScreen={setScreen} />
    </SafeAreaView>
  );
}