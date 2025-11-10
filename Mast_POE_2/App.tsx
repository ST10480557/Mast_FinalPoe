import React, { JSX, useEffect, useMemo, useState, useRef } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, StatusBar, Animated,
  Modal, Pressable, ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Course = "Starters" | "Mains" | "Desserts";
type Dish = { id: string; name: string; description?: string; course: Course; price: number; createdAt: number; };

const STORAGE_KEY = "@chef_menu_items_v2";
const CART_KEY = "@chef_menu_cart_v1";
const COURSES: Course[] = ["Starters", "Mains", "Desserts"];

const THEMES = {
  Light: { primary: "#246BFD", accent: "#FF6B6B", bg: "#F6F8FB", card: "#fff", text: "#1F2937", muted: "#6B7280", accentAlt: "#FFD6D6" },
  Dark:  { primary: "#0EA5A4", accent: "#F97316", bg: "#0F1724", card: "#061021", text: "#E6EEF8", muted: "#94A3B8", accentAlt: "#1F2937" },
} as const;

const load = async (): Promise<Dish[]> => { try { const r = await AsyncStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; } catch { return []; } };
const save = async (items: Dish[]) => { try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {} };
const loadCart = async () => { try { const r = await AsyncStorage.getItem(CART_KEY); return r ? JSON.parse(r) as Record<string,number> : {}; } catch { return {}; } };
const saveCart = async (c: Record<string,number>) => { try { await AsyncStorage.setItem(CART_KEY, JSON.stringify(c)); } catch {} };

const courseColor = (c: Course) => c === "Starters" ? "#FFB86B" : c === "Mains" ? "#6BB0FF" : "#FF8ACB";

const makeStyles = (t: typeof THEMES[keyof typeof THEMES]) => StyleSheet.create({
  root:{flex:1,backgroundColor:t.bg},
  header:{padding:16,paddingTop:28,backgroundColor:t.primary,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomLeftRadius:14,borderBottomRightRadius:14},
  headerLeft:{flexDirection:"row",alignItems:"center"},
  avatar:{width:48,height:48,borderRadius:24,backgroundColor:t.accentAlt,alignItems:"center",justifyContent:"center",marginRight:12},
  title:{color:"#fff",fontWeight:"800"},
  sub:{color:"#D6E4FF"},
  body:{flex:1,padding:12},
  search:{flexDirection:"row",alignItems:"center",marginBottom:10},
  input:{flex:1,backgroundColor:t.card,padding:10,borderRadius:10,color:t.text},
  btn:{marginLeft:8,backgroundColor:t.accent,padding:10,borderRadius:10},
  pill:{paddingVertical:8,paddingHorizontal:12,borderRadius:20,backgroundColor:t.card,marginRight:8},
  card:{backgroundColor:t.card,borderRadius:12,padding:12,margin:6,flex:1},
  name:{fontWeight:"800",color:t.text},
  meta:{color:t.muted,fontSize:12},
  footerCart:{position:"absolute",left:12,right:12,bottom:12,backgroundColor:t.card,borderRadius:12,padding:12,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  primary:{backgroundColor:t.primary,padding:8,borderRadius:10},
});

function Header({ title, sub, count, styles, themeName, onSwitchTheme }: any) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatar}><Text style={{fontWeight:900,color:THEMES.Light.primary}}>{title.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase()}</Text></View>
        <View>
          <Text style={styles.title}>{title}</Text>
          {sub ? <Text style={styles.sub}>{sub}</Text> : null}
          {typeof count === "number" ? <Text style={[styles.sub,{marginTop:4}]}>{count} dishes</Text> : null}
        </View>
      </View>
      <TouchableOpacity onPress={onSwitchTheme}><Text style={{color:"#fff",fontWeight:800}}>{themeName}</Text></TouchableOpacity>
    </View>
  );
}

function Nav({ screen, setScreen, styles }: any) {
  return (
    <View style={{flexDirection:"row",backgroundColor:styles.card ? undefined : undefined}}>
      <TouchableOpacity style={{flex:1,padding:12,alignItems:"center"}} onPress={()=>setScreen("customer")}><Text style={{fontWeight:"800"}}>Customer</Text></TouchableOpacity>
      <TouchableOpacity style={{flex:1,padding:12,alignItems:"center"}} onPress={()=>setScreen("chef")}><Text style={{fontWeight:"800"}}>Manager</Text></TouchableOpacity>
    </View>
  );
}

const Card = ({ item, onAdd, onRemove, onQty, styles }: any) => (
  <View style={styles.card}>
    <View style={{height:6,backgroundColor:courseColor(item.course),borderRadius:4,marginBottom:8}} />
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.meta}>{item.course}</Text>
    {item.description ? <Text style={[styles.meta,{marginTop:6}]}>{item.description}</Text> : null}
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
      <Text style={{fontWeight:"800"}}>R{item.price.toFixed(2)}</Text>
      <View style={{flexDirection:"row",alignItems:"center"}}>
        {onQty && <>
          <TouchableOpacity onPress={()=>onQty(item.id,-1)} style={{padding:6}}><Text>-</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>onQty(item.id,1)} style={{padding:6}}><Text>+</Text></TouchableOpacity>
        </>}
        {onAdd ? <TouchableOpacity onPress={()=>onAdd(item.id)} style={{backgroundColor:styles.primary.backgroundColor,paddingHorizontal:10,paddingVertical:6,borderRadius:8,marginLeft:8}}><Text style={{color:"#fff",fontWeight:"800"}}>Add</Text></TouchableOpacity> : null}
        {onRemove ? <TouchableOpacity onPress={()=>onRemove(item.id)} style={{marginLeft:8,backgroundColor:'#FDE8E8',padding:6,borderRadius:8}}><Text style={{color:'#D04545'}}>Remove</Text></TouchableOpacity> : null}
      </View>
    </View>
  </View>
);

function Customer({ menu, openManager, styles, addToCart, filter, openFilter }: any) {
  const [q, setQ] = useState("");
  const visible = useMemo(()=> {
    const base = filter === "All" ? menu : menu.filter((m:Dish)=>m.course===filter);
    const Q = q.trim().toLowerCase();
    return Q ? base.filter((i:Dish)=> i.name.toLowerCase().includes(Q) || (i.description||"").toLowerCase().includes(Q)) : base;
  }, [menu, filter, q]);

  const averages = useMemo(()=> {
    const out: Record<string,{avg:number,count:number}> = {};
    for (const c of COURSES) {
      const items = menu.filter(m=>m.course===c);
      const sum = items.reduce((s,i)=>s+i.price,0); out[c] = { avg: items.length ? sum/items.length : 0, count: items.length };
    }
    return out;
  }, [menu]);

  return (
    <View style={styles.body}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <TouchableOpacity onPress={openFilter} style={styles.pill}><Text>Filters: {filter}</Text></TouchableOpacity>
        <TouchableOpacity onPress={openManager} style={styles.btn}><Text style={{color:"#fff"}}>Manager</Text></TouchableOpacity>
      </View>

      <View style={styles.search}><TextInput placeholder="Search..." value={q} onChangeText={setQ} style={styles.input} /></View>

      <View style={{flexDirection:'row',marginBottom:10}}>
        {COURSES.map(c=> (
          <View key={c} style={{flex:1,backgroundColor:styles.card.borderRadius?styles.card.backgroundColor:styles.card,padding:8,marginRight:8,borderRadius:8,alignItems:'center'}}>
            <Text style={{fontWeight:"800"}}>{c}</Text>
            <Text style={{marginTop:6,fontWeight:'700'}}>{averages[c].count ? `R${averages[c].avg.toFixed(2)}` : "—"}</Text>
            <Text style={{fontSize:11,color:'#777',marginTop:4}}>{averages[c].count} items</Text>
          </View>
        ))}
      </View>

      <FlatList data={visible} keyExtractor={(i:any)=>i.id} numColumns={2} columnWrapperStyle={{justifyContent:"space-between"}} renderItem={({item})=> <Card item={item} styles={styles} onAdd={addToCart} />} ListEmptyComponent={<View style={{padding:24,alignItems:'center'}}><Text style={{color:styles.meta}}>No dishes.</Text></View>} />
    </View>
  );
}

function Chef({ menu, add, remove, back, styles }: any) {
  const [name,setName]=useState(""); const [desc,setDesc]=useState(""); const [course,setCourse]=useState<Course>("Mains"); const [price,setPrice]=useState("");
  const submit = ()=> {
    if(!name.trim()) return Alert.alert("Validation","Enter dish name.");
    const p = parseFloat(price); if(Number.isNaN(p)||p<0) return Alert.alert("Validation","Enter valid price.");
    add({ name: name.trim(), description: desc.trim(), course, price: p });
    setName(""); setDesc(""); setCourse("Mains"); setPrice("");
  };
  return (
    <KeyboardAvoidingView style={styles.body} behavior={Platform.OS==="ios"?"padding":undefined}>
      <View style={{padding:12,backgroundColor:styles.card.backgroundColor,borderBottomWidth:1,borderBottomColor:'#eee'}}>
        <TouchableOpacity onPress={back}><Text style={{color:styles.title.color}}>Back</Text></TouchableOpacity>
        <Text style={{fontWeight:900,fontSize:18}}>Manager — Add / Remove</Text>
      </View>

      <View style={{padding:12,backgroundColor:styles.card.backgroundColor}}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={[styles.input,{height:80,marginTop:8}]} multiline />
        <View style={{flexDirection:'row',marginTop:8}}>{COURSES.map(c=> <TouchableOpacity key={c} onPress={()=>setCourse(c)} style={{flex:1,marginRight:8,padding:10,backgroundColor: course===c ? styles.primary.backgroundColor : styles.card.backgroundColor,borderRadius:10}}><Text style={{textAlign:'center'}}>{c}</Text></TouchableOpacity>)}</View>
        <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={[styles.input,{marginTop:8}]} />
        <View style={{flexDirection:'row',marginTop:10}}>
          <TouchableOpacity onPress={()=>{setName("");setDesc("");setCourse("Mains");setPrice("");}} style={{flex:1,padding:12,borderRadius:10,borderWidth:1,borderColor:'#eee',marginRight:8}}><Text style={{textAlign:'center'}}>Reset</Text></TouchableOpacity>
          <TouchableOpacity onPress={submit} style={{flex:1,backgroundColor:styles.primary.backgroundColor,padding:12,borderRadius:10}}><Text style={{color:'#fff',textAlign:'center'}}>Add Dish</Text></TouchableOpacity>
        </View>
      </View>

      <FlatList data={menu} keyExtractor={(i:any)=>i.id} contentContainerStyle={{padding:12}} renderItem={({item})=> (
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:12,backgroundColor:styles.card,borderRadius:8,marginBottom:8}}>
          <View style={{flexDirection:'row',alignItems:'center'}}><View style={{width:40,height:40,borderRadius:20,backgroundColor:styles.avatar.backgroundColor,alignItems:'center',justifyContent:'center',marginRight:8}}><Text>{item.name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase()}</Text></View><View><Text style={{fontWeight:800}}>{item.name}</Text><Text style={{color:styles.meta}}>{item.course} • R{item.price.toFixed(2)}</Text></View></View>
          <TouchableOpacity onPress={()=>remove(item.id)} style={{backgroundColor:styles.btn.backgroundColor,padding:8,borderRadius:8}}><Text style={{color:'#fff'}}>Remove</Text></TouchableOpacity>
        </View>
      )} ListEmptyComponent={<View style={{padding:24,alignItems:'center'}}><Text style={{color:styles.meta}}>No dishes yet.</Text></View>} />
    </KeyboardAvoidingView>
  );
}

function FilterScreen({ current, setCurrent, back, styles }: any) {
  return (
    <View style={styles.body}>
      <View style={{padding:12,backgroundColor:styles.card.backgroundColor}}><TouchableOpacity onPress={back}><Text style={{color:styles.title.color}}>Back</Text></TouchableOpacity><Text style={{fontWeight:900}}>Filters</Text></View>
      <View style={{padding:12}}>
        <TouchableOpacity onPress={()=>setCurrent("All")} style={{padding:10,backgroundColor: current==="All"?styles.primary.backgroundColor:styles.card.backgroundColor,borderRadius:8,marginBottom:8}}><Text>All</Text></TouchableOpacity>
        {COURSES.map(c=> <TouchableOpacity key={c} onPress={()=>setCurrent(c)} style={{padding:10,backgroundColor: current===c?styles.primary.backgroundColor:styles.card.backgroundColor,borderRadius:8,marginBottom:8}}><Text>{c}</Text></TouchableOpacity>)}
        <TouchableOpacity onPress={back} style={{backgroundColor:styles.primary.backgroundColor,padding:12,borderRadius:10,marginTop:12}}><Text style={{color:'#fff',textAlign:'center'}}>Apply</Text></TouchableOpacity>
      </View>
    </View>
  );
}

export default function App(): JSX.Element {
  const [menu,setMenu]=useState<Dish[]>([]);
  const [screen,setScreen]=useState<"customer"|"chef"|"filter">("customer");
  const [filter,setFilter]=useState<"All"|Course>("All");
  const [themeName,setThemeName]=useState<keyof typeof THEMES>("Light");
  const [cart,setCart]=useState<Record<string,number>>({});
  const [cartOpen,setCartOpen]=useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(()=>{ (async()=>{ setMenu(await load()); setCart(await loadCart()); })(); },[]);

  const styles = useMemo(()=> makeStyles(THEMES[themeName]),[themeName]);

  const persist = async (items: Dish[]) => { setMenu(items); await save(items); };
  const persistCart = async (c: Record<string,number>) => { setCart(c); await saveCart(c); };

  const add = (d: Omit<Dish,"id"|"createdAt">) => persist([{...d, id:String(Date.now()), createdAt: Date.now()}, ...menu]);
  const remove = (id:string) => {
    const del = ()=> persist(menu.filter(m=>m.id!==id));
    if(Platform.OS==="web" && typeof window!=="undefined"){ if(window.confirm("Delete this dish?")) del(); return; }
    Alert.alert("Delete","Remove this dish?",[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:del}]);
  };

  const addToCart = async (id:string, qty=1) => {
    const next = {...cart, [id]: Math.max(0,(cart[id]||0)+qty)}; if(next[id]===0) delete next[id];
    await persistCart(next);
    Animated.sequence([ Animated.timing(pulse,{toValue:1.06,duration:140,useNativeDriver:true}), Animated.timing(pulse,{toValue:1,duration:220,useNativeDriver:true}) ]).start();
  };
  const updateCartQty = async (id:string, qty:number) => { const n = {...cart}; if(qty<=0) delete n[id]; else n[id]=qty; await persistCart(n); };
  const removeFromCart = async (id:string) => { const n={...cart}; delete n[id]; await persistCart(n); };
  const clearCart = async ()=> await persistCart({});

  const cycleTheme = ()=> { const keys = Object.keys(THEMES); const idx = keys.indexOf(themeName as string); setThemeName(keys[(idx+1)%keys.length] as any); };

  const cartItems = menu.filter(m=>cart[m.id]);
  const totalItems = Object.values(cart).reduce((a,b)=>a+b,0);
  const totalPrice = cartItems.reduce((s,m)=>s + (cart[m.id]||0)*m.price, 0);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor={THEMES[themeName].primary} barStyle={themeName==="Dark"?"light-content":"dark-content"} />
      <Header title="Chef Christoffel" sub="Fresh menu — always up to date" count={menu.length} styles={styles} themeName={themeName} onSwitchTheme={cycleTheme} />

      <View style={{flex:1}}>
        {screen==="customer" ? <Customer menu={menu} openManager={()=>setScreen("chef")} styles={styles} addToCart={addToCart} filter={filter} openFilter={()=>setScreen("filter")} />
         : screen==="filter" ? <FilterScreen current={filter} setCurrent={(v:any)=>{ setFilter(v); setScreen("customer"); }} back={()=>setScreen("customer")} styles={styles} />
         : <Chef menu={menu} add={add} remove={remove} back={()=>setScreen("customer")} styles={styles} />}
      </View>

      {screen==="customer" && (
        <Animated.View style={[styles.footerCart,{transform:[{scale:pulse}] }]}>
          <View><Text style={{fontWeight:800}}>{totalItems} items</Text><Text style={{color:THEMES[themeName].muted}}>R{totalPrice.toFixed(2)}</Text></View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity onPress={()=>setCartOpen(true)} style={styles.primary}><Text style={{color:'#fff'}}>Cart</Text></TouchableOpacity>
            <TouchableOpacity onPress={clearCart} style={{marginLeft:8,padding:8,borderRadius:8,backgroundColor:'#F3F4F6'}}><Text>Clear</Text></TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <Nav screen={screen} setScreen={setScreen} styles={styles} />

      <Modal visible={cartOpen} animationType="slide" transparent onRequestClose={()=>setCartOpen(false)}>
        <Pressable style={{flex:1,backgroundColor:'rgba(0,0,0,0.35)'}} onPress={()=>setCartOpen(false)}>
          <View style={{flex:1,justifyContent:'flex-end'}}>
            <View style={{maxHeight:'70%',backgroundColor:THEMES[themeName].card,borderTopLeftRadius:16,borderTopRightRadius:16,padding:12}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <Text style={{fontWeight:'900'}}>Your Cart ({totalItems})</Text>
                <TouchableOpacity onPress={()=>setCartOpen(false)}><Text style={{color:THEMES[themeName].muted}}>Close</Text></TouchableOpacity>
              </View>
              <ScrollView style={{marginBottom:8}}>
                {cartItems.length===0 ? <View style={{padding:24,alignItems:'center'}}><Text style={{color:THEMES[themeName].muted}}>Cart is empty</Text></View> : null}
                {cartItems.map(it=>(
                  <View key={it.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#eee'}}>
                    <View style={{flex:1}}><Text style={{fontWeight:'800'}}>{it.name}</Text><Text style={{color:THEMES[themeName].muted}}>R{it.price.toFixed(2)} • {it.course}</Text></View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <TouchableOpacity onPress={()=>updateCartQty(it.id, Math.max(0,(cart[it.id]||0)-1))} style={{padding:8,marginRight:6}}><Text>-</Text></TouchableOpacity>
                      <Text style={{width:28,textAlign:'center',fontWeight:'800'}}>{cart[it.id]}</Text>
                      <TouchableOpacity onPress={()=>updateCartQty(it.id, (cart[it.id]||0)+1)} style={{padding:8,marginLeft:6}}><Text>+</Text></TouchableOpacity>
                      <TouchableOpacity onPress={()=>removeFromCart(it.id)} style={{padding:8,marginLeft:10,backgroundColor:'#FDE8E8',borderRadius:8}}><Text style={{color:'#D04545'}}>Remove</Text></TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                <Text style={{fontWeight:'900'}}>Total: R{totalPrice.toFixed(2)}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <TouchableOpacity onPress={clearCart} style={{marginRight:8,padding:8,borderRadius:8,backgroundColor:'#F3F4F6'}}><Text>Clear</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>setCartOpen(false)} style={{padding:8,borderRadius:8,backgroundColor:THEMES[themeName].primary}}><Text style={{color:'#fff'}}>Done</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}