import React, { JSX, useEffect, useMemo, useState, useRef, useEffect as useEff } from "react";
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

const THEMES: Record<string, { primary: string; accent: string; bg: string; card: string; text: string; muted: string; accentAlt?: string }> = {
  Light: { primary: "#246BFD", accent: "#FF6B6B", bg: "#F6F8FB", card: "#FFFFFF", text: "#1F2937", muted: "#6B7280", accentAlt: "#FFD6D6" },
  Dark: { primary: "#0EA5A4", accent: "#F97316", bg: "#0F1724", card: "#061021", text: "#E6EEF8", muted: "#94A3B8", accentAlt: "#1F2937" },
};

const load = async () => { try { const r = await AsyncStorage.getItem(STORAGE_KEY); return r ? (JSON.parse(r) as Dish[]) : []; } catch { return []; } };
const save = async (items: Dish[]) => { try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {} };
const loadCart = async () => { try { const r = await AsyncStorage.getItem(CART_KEY); return r ? (JSON.parse(r) as Record<string, number>) : {}; } catch { return {}; } };
const saveCart = async (cart: Record<string, number>) => { try { await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} };

const courseColor = (c: Course) => (c === "Starters" ? "#FFB86B" : c === "Mains" ? "#6BB0FF" : "#FF8ACB");

function makeStyles(THEME: { primary: string; accent: string; bg: string; card: string; text: string; muted: string; accentAlt?: string }) {
  return StyleSheet.create({
    h:{padding:16,paddingTop:28,backgroundColor:THEME.primary,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomLeftRadius:18,borderBottomRightRadius:18},
    hLeft:{flexDirection:"row",alignItems:"center"},
    avatar:{width:56,height:56,borderRadius:28,backgroundColor:THEME.accentAlt || "#FFD6D6",alignItems:"center",justifyContent:"center",marginRight:12,elevation:6},
    avatarTxt:{color:THEME.primary,fontWeight:"900"},
    ht:{color:"#fff",fontSize:20,fontWeight:"900"},
    hs:{color:"#D6E4FF",marginTop:4,opacity:0.95},
    hc:{color:"#fff",marginTop:6,fontWeight:"700"},
    nav:{flexDirection:"row",borderTopWidth:1,borderTopColor:"#eee",backgroundColor:THEME.card},
    tab:{flex:1,padding:12,alignItems:"center"},
    ta:{backgroundColor:THEME.accentAlt || "#F0F6FF"},
    tt:{color:THEME.muted,fontWeight:"800"},
    tta:{color:THEME.primary},
    body:{flex:1,backgroundColor:THEME.bg,paddingBottom:18},
    controls:{padding:14},
    filters:{flexDirection:"row",marginBottom:10},
    pill:{paddingVertical:8,paddingHorizontal:14,borderRadius:22,backgroundColor:THEME.card,marginRight:8,borderWidth:1,borderColor:"#eee"},
    pilla:{borderColor:THEME.primary, shadowColor: THEME.primary, shadowOpacity: 0.12, shadowOffset:{width:0,height:6}, shadowRadius:8, elevation:3},
    pt:{color:THEME.muted,fontWeight:"700"},
    pta:{color:THEME.primary},
    search:{flexDirection:"row",alignItems:"center",marginTop:4},
    input:{flex:1,backgroundColor:THEME.card,borderRadius:12,padding:12,borderWidth:0,color:THEME.text},
    mbtn:{marginLeft:8,backgroundColor:THEME.accent,paddingVertical:10,paddingHorizontal:14,borderRadius:12,elevation:3},
    mbtxt:{color:"#fff",fontWeight:"800"},
    rowWrap:{justifyContent:"space-between"},
    card:{flex:1,backgroundColor:THEME.card,borderRadius:14,padding:14,marginBottom:14,marginHorizontal:6,minWidth:150,maxWidth:"48%",overflow:"hidden"},
    cardShadow:{ shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 8 },
    strip:{height:6,borderRadius:4,marginBottom:8},
    ct:{fontWeight:"900",color:THEME.text,fontSize:16},
    cc:{color:THEME.muted,fontSize:12,marginTop:6},
    cd:{color:THEME.muted,fontSize:13,marginTop:8,minHeight:36},
    cf:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:10},
    cp:{fontWeight:"900",color:THEME.text},
    row:{flexDirection:"row",alignItems:"center"},
    q:{padding:6,borderRadius:8,backgroundColor:THEME.bg,marginHorizontal:6,borderWidth:1,borderColor:"#eee"},
    qt:{fontWeight:"900",color:THEME.text},
    rm:{marginLeft:8,paddingVertical:6,paddingHorizontal:8,borderRadius:8,backgroundColor:"#FDE8E8"},
    rmt:{color:"#D04545",fontWeight:"800"},
    cart:{position:"absolute",left:12,right:12,bottom:12,backgroundColor:THEME.card,borderRadius:14,padding:12,flexDirection:"row",justifyContent:"space-between",alignItems:"center",elevation:6,shadowColor:'#000',shadowOffset:{width:0,height:8},shadowOpacity:0.06,shadowRadius:12},
    cartTxt:{color:THEME.text,fontWeight:"800"},
    primary:{backgroundColor:THEME.primary,paddingVertical:8,paddingHorizontal:12,borderRadius:12},
    pTxt:{color:"#fff",fontWeight:"900"},
    empty:{padding:24,alignItems:"center"},
    emptyTxt:{color:THEME.muted},
    chefTop:{padding:14,backgroundColor:THEME.card,borderBottomWidth:1,borderBottomColor:"#eee"},
    back:{color:THEME.primary,fontWeight:"800",marginBottom:6},
    ctitle:{fontSize:18,fontWeight:"900",color:THEME.text},
    csub:{color:THEME.muted,marginTop:4},
    form:{padding:12,backgroundColor:THEME.card,marginTop:8},
    courseRow:{flexDirection:"row",marginTop:8},
    courseOpt:{flex:1,paddingVertical:12,alignItems:"center",borderRadius:10,borderWidth:1,borderColor:"#eee",backgroundColor:THEME.card,marginRight:8},
    courseOptA:{backgroundColor:THEME.primary, shadowColor: THEME.primary, shadowOpacity: 0.12, shadowOffset:{width:0,height:6}, shadowRadius:8, elevation:3},
    courseTxt:{color:THEME.text,fontWeight:"700"},
    courseTxtA:{color:"#fff"},
    formActions:{flexDirection:"row",marginTop:12},
    ghost:{flex:1,borderWidth:1,borderColor:"#eee",padding:12,borderRadius:10,alignItems:"center",marginRight:8},
    ghostTxt:{fontWeight:"800",color:THEME.muted},
    add:{flex:1,backgroundColor:THEME.primary,padding:12,borderRadius:10,alignItems:"center"},
    addTxt:{color:"#fff",fontWeight:"900"},
    addSmall:{backgroundColor:THEME.accent,paddingVertical:6,paddingHorizontal:10,borderRadius:10},
    priceBadge:{position:'absolute',right:10,top:8,backgroundColor:THEME.primary,paddingVertical:6,paddingHorizontal:8,borderRadius:10,elevation:4},
    priceBadgeTxt:{color:'#fff',fontWeight:'900'},
    list:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:12,backgroundColor:THEME.card,marginBottom:8,borderRadius:10},
    lt:{fontWeight:"800",color:THEME.text},
    lm:{color:THEME.muted,marginTop:4},
    rmBtn:{paddingVertical:8,paddingHorizontal:12,borderRadius:8,backgroundColor:THEME.accent},
    rmBtnTxt:{color:"#fff",fontWeight:"800"},
    themeSw:{position:"absolute",right:12,top:12,flexDirection:"row",alignItems:"center",padding:6,borderRadius:20,backgroundColor:THEME.card,borderWidth:1,borderColor:"#eee"},
    avatarSmall:{width:40,height:40,borderRadius:20,backgroundColor:THEME.accentAlt||"#FFD6D6",alignItems:"center",justifyContent:"center",marginRight:8},
    avatarSmallTxt:{color:THEME.primary,fontWeight:"900"},
    headerActions:{flexDirection:'row',alignItems:'center'}
  });
}

function Header({ title, sub, count, s, themeName, cycleTheme, cartCount, openCart }: { title: string; sub?: string; count?: number; s: any; themeName: string; cycleTheme: ()=>void; cartCount?: number; openCart?: ()=>void }) {
  return (
    <View style={s.h}>
      <View style={s.hLeft}>
        <View style={s.avatar}><Text style={s.avatarTxt}>{title.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase()}</Text></View>
        <View>
          <Text style={s.ht}>{title}</Text>
          {sub ? <Text style={s.hs}>{sub}</Text> : null}
          {typeof count === "number" ? <Text style={s.hc}>{count} dishes</Text> : null}
        </View>
      </View>

      <View style={s.headerActions}>
        {typeof cartCount === "number" && openCart ? (
          <TouchableOpacity onPress={openCart} style={{marginRight:10,alignItems:'center'}}>
            <View style={{backgroundColor:'#fff',padding:6,borderRadius:18}}>
              <Text style={{fontWeight:'800',color:'#333'}}>{cartCount}</Text>
            </View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={cycleTheme} style={s.themeSw}><Text style={{color:'#555',fontWeight:'700'}}>{themeName}</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function Nav({ screen, setScreen, s }: { screen: "customer" | "chef"; setScreen: (s: any) => void; s: any }) {
  return (
    <View style={s.nav}>
      <TouchableOpacity style={[s.tab, screen === "customer" && s.ta]} onPress={() => setScreen("customer")}><Text style={[s.tt, screen === "customer" && s.tta]}>Customer</Text></TouchableOpacity>
      <TouchableOpacity style={[s.tab, screen === "chef" && s.ta]} onPress={() => setScreen("chef")}><Text style={[s.tt, screen === "chef" && s.tta]}>Manager</Text></TouchableOpacity>
    </View>
  );
}

const Card = ({ item, onQty, onRemove, onAdd, s }: { item: Dish; onQty?: (id: string, d: number) => void; onRemove?: (id: string) => void; onAdd?: (id: string)=>void; s: any }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEff(()=> { Animated.timing(anim, { toValue: 1, duration: 320, useNativeDriver: true }).start(); }, []);
  const initials = item.name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
  return (
    <Animated.View style={[s.card, s.cardShadow, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0,1], outputRange: [0.98,1] }) }] }]}>
      <View style={[s.strip, { backgroundColor: courseColor(item.course) }]} />
      <View style={{position:'relative'}}>
        <View style={{flexDirection:"row",alignItems:"center"}}>
          <View style={s.avatarSmall}><Text style={s.avatarSmallTxt}>{initials}</Text></View>
          <View style={{flex:1}}>
            <Text style={s.ct}>{item.name}</Text>
            <Text style={s.cc}>{item.course}</Text>
          </View>
        </View>
        <View style={s.priceBadge}><Text style={s.priceBadgeTxt}>R{item.price.toFixed(0)}</Text></View>
      </View>
      {item.description ? <Text style={s.cd}>{item.description}</Text> : null}
      <View style={s.cf}>
        <Text style={s.cp}>R{item.price.toFixed(2)}</Text>
        <View style={s.row}>
          {onQty ? <>
            <TouchableOpacity onPress={() => onQty(item.id, -1)} style={s.q}><Text style={s.qt}>−</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => onQty(item.id, +1)} style={s.q}><Text style={s.qt}>+</Text></TouchableOpacity>
          </> : null}
          {onAdd ? <TouchableOpacity onPress={() => onAdd(item.id)} style={[s.addSmall,{marginLeft:8}]}><Text style={s.addTxt}>Add</Text></TouchableOpacity> : null}
          {onRemove ? <TouchableOpacity onPress={() => onRemove(item.id)} style={s.rm}><Text style={s.rmt}>Remove</Text></TouchableOpacity> : null}
        </View>
      </View>
    </Animated.View>
  );
};

function Customer({ menu, openManager, s, cart, addToCart }: { menu: Dish[]; openManager: () => void; s: any; cart?: Record<string,number>; addToCart?: (id:string, qty?:number)=>void }) {
  const [filter, setFilter] = useState<"All" | Course>("All");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    let items = filter === "All" ? menu : menu.filter(m => m.course === filter);
    if (q.trim()) { const Q = q.toLowerCase(); items = items.filter(i => i.name.toLowerCase().includes(Q) || (i.description || "").toLowerCase().includes(Q)); }
    return items;
  }, [menu, filter, q]);

  // --- new: compute average prices per course + overall average
  const averages = useMemo(() => {
    type Acc = { avg: number; count: number; sum: number };
    const result: Record<Course, Acc> = {
      Starters: { avg: 0, count: 0, sum: 0 },
      Mains: { avg: 0, count: 0, sum: 0 },
      Desserts: { avg: 0, count: 0, sum: 0 },
    };
    let totalSum = 0;
    let totalCount = 0;
    for (const c of COURSES) {
      const items = menu.filter(m => m.course === c);
      const count = items.length;
      const sum = items.reduce((acc, it) => acc + it.price, 0);
      result[c] = { avg: count ? sum / count : 0, count, sum };
      totalSum += sum;
      totalCount += count;
    }
    return { perCourse: result, overallAvg: totalCount ? totalSum / totalCount : 0, totalCount };
  }, [menu]);
  // --- end new

  return (
    <View style={s.body}>
      <View style={s.controls}>
        <View style={s.filters}>
          <TouchableOpacity onPress={() => setFilter("All")} style={[s.pill, filter==="All"&&s.pilla]}><Text style={[s.pt, filter==="All"&&s.pta]}>All</Text></TouchableOpacity>
          {COURSES.map(c=> <TouchableOpacity key={c} onPress={()=>setFilter(c)} style={[s.pill, filter===c&&s.pilla]}><Text style={[s.pt, filter===c&&s.pta]}>{c}</Text></TouchableOpacity>)}
        </View>
        <View style={s.search}>
          <TextInput placeholder="Search dishes or description..." placeholderTextColor={s.input.color ? undefined : undefined} value={q} onChangeText={setQ} style={s.input} />
          <TouchableOpacity onPress={openManager} style={s.mbtn}><Text style={s.mbtxt}>Manager</Text></TouchableOpacity>
        </View>

        {/* new: averages summary row */}
        <View style={{flexDirection:'row',marginTop:12,justifyContent:'space-between',alignItems:'center'}}>
          {COURSES.map((c, idx) => {
            const info = averages.perCourse[c];
            return (
              <View key={c} style={{flex:1,backgroundColor:s.card,borderRadius:10,padding:8,marginRight: idx < COURSES.length - 1 ? 8 : 0,alignItems:'center'}}>
                <Text style={{fontWeight:800,color:typeof s.ct === 'object' ? undefined : undefined}}>{c}</Text>
                <Text style={{color:s.cc.color ? undefined : undefined, marginTop:4, fontWeight:'700'}}>{info.count ? `R${info.avg.toFixed(2)}` : "—"}</Text>
                <Text style={{color:s.cc.color ? undefined : undefined, fontSize:11, marginTop:4}}>{info.count} items</Text>
              </View>
            );
          })}
        </View>

      </View>

      <FlatList data={visible} keyExtractor={i=>i.id} numColumns={2} columnWrapperStyle={s.rowWrap}
        renderItem={({item})=> <Card item={item} s={s} onAdd={addToCart} />} ListEmptyComponent={<View style={s.empty}><Text style={s.emptyTxt}>No dishes.</Text></View>} />

      {/* cart UI removed from here — cart handled at app level/modal */}
    </View>
  );
}

function Chef({ menu, add, remove, back, s }: { menu: Dish[]; add: (d: Omit<Dish,"id"|"createdAt">)=>void; remove: (id:string)=>void; back: ()=>void; s:any }) {
  const [name, setName] = useState(""); const [desc,setDesc]=useState(""); const [course,setCourse]=useState<Course>("Mains"); const [price,setPrice]=useState("");
  const submit = ()=> { if(!name.trim()) return Alert.alert("Validation","Enter dish name."); const p = parseFloat(price); if(Number.isNaN(p)||p<0) return Alert.alert("Validation","Enter valid price."); add({name:name.trim(),description:desc.trim(),course,price:p}); setName(""); setDesc(""); setCourse("Mains"); setPrice(""); };

  return (
    <KeyboardAvoidingView style={s.body} behavior={Platform.OS==="ios"?"padding":undefined}>
      <View style={s.chefTop}>
        <TouchableOpacity onPress={back}><Text style={s.back}>Back</Text></TouchableOpacity>
        <Text style={s.ctitle}>Manager — Add / Remove</Text>
        <Text style={s.csub}>Total {menu.length} • Starters {menu.filter(m=>m.course==="Starters").length}</Text>
      </View>

      <View style={s.form}>
        <TextInput placeholder="Name" placeholderTextColor={s.input.color ? undefined : undefined} value={name} onChangeText={setName} style={s.input} />
        <TextInput placeholder="Description" placeholderTextColor={s.input.color ? undefined : undefined} value={desc} onChangeText={setDesc} style={[s.input,{height:80}]} multiline />
        <View style={s.courseRow}>{COURSES.map(c=> <TouchableOpacity key={c} onPress={()=>setCourse(c)} style={[s.courseOpt, course===c&&s.courseOptA]}><Text style={[s.courseTxt, course===c&&s.courseTxtA]}>{c}</Text></TouchableOpacity>)}</View>
        <TextInput placeholder="Price e.g. 120.00" placeholderTextColor={s.input.color ? undefined : undefined} value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={s.input} />
        <View style={s.formActions}><TouchableOpacity onPress={()=>{setName("");setDesc("");setCourse("Mains");setPrice("");}} style={s.ghost}><Text style={s.ghostTxt}>Reset</Text></TouchableOpacity>
        <TouchableOpacity onPress={submit} style={s.add}><Text style={s.addTxt}>Add Dish</Text></TouchableOpacity></View>
      </View>

      <FlatList data={menu} keyExtractor={i=>i.id} contentContainerStyle={{padding:12}} renderItem={({item})=>
        <View style={s.list}><View style={{flexDirection:'row',alignItems:'center'}}><View style={s.avatarSmall}><Text style={s.avatarSmallTxt}>{item.name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase()}</Text></View><View><Text style={s.lt}>{item.name}</Text><Text style={s.lm}>{item.course} • R{item.price.toFixed(2)}</Text></View></View>
        <TouchableOpacity onPress={()=>remove(item.id)} style={s.rmBtn}><Text style={s.rmBtnTxt}>Remove</Text></TouchableOpacity></View>
      } ListEmptyComponent={<View style={s.empty}><Text style={s.emptyTxt}>No dishes yet.</Text></View>} />
    </KeyboardAvoidingView>
  );
}

export default function App(): JSX.Element {
  const [menu, setMenu] = useState<Dish[]>([]);
  const [screen, setScreen] = useState<"customer" | "chef">("customer");
  const [themeName, setThemeName] = useState<keyof typeof THEMES>("Light");

  // cart state (persistent)
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  // footer pulse animation for visual feedback when cart updates
  const cartPulse = useRef(new Animated.Value(1)).current;

  useEffect(()=>{ (async()=>{ const m = await load(); const c = await loadCart(); setMenu(m); setCart(c); })(); },[]);

  const persist = async (items: Dish[])=>{ setMenu(items); await save(items); };
  const persistCart = async (c: Record<string, number>) => { setCart(c); await saveCart(c); };

  const add = (d: Omit<Dish,"id"|"createdAt">)=> persist([{ ...d, id: String(Date.now()), createdAt: Date.now() }, ...menu]);
  const remove = (id: string)=> {
    const del = ()=> persist(menu.filter(m=>m.id!==id));
    if (Platform.OS==="web" && typeof window!=="undefined") { if (window.confirm("Delete this dish?")) del(); return; }
    Alert.alert("Delete","Remove this dish?",[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:del}]);
  };

  // cart handlers (no checkout)
  const addToCart = async (id: string, qty = 1) => {
    const next = { ...cart, [id]: Math.max(0, (cart[id]||0) + qty) };
    if (next[id] === 0) delete next[id];
    await persistCart(next);
    // pulse footer briefly
    Animated.sequence([
      Animated.timing(cartPulse, { toValue: 1.06, duration: 140, useNativeDriver: true }),
      Animated.timing(cartPulse, { toValue: 1, duration: 220, useNativeDriver: true })
    ]).start();
  };
  const updateCartQty = async (id: string, qty: number) => {
    const next = { ...cart };
    if (qty <= 0) delete next[id];
    else next[id] = qty;
    await persistCart(next);
  };
  const removeFromCart = async (id: string) => {
    const next = { ...cart }; delete next[id]; await persistCart(next);
  };
  const clearCart = async () => { await persistCart({}); };

  const cycleTheme = () => {
    const keys = Object.keys(THEMES);
    const idx = keys.indexOf(themeName as string);
    const next = keys[(idx + 1) % keys.length];
    setThemeName(next as keyof typeof THEMES);
  };

  const currentTheme = useMemo(()=> THEMES[themeName], [themeName]);
  const s = useMemo(()=> makeStyles(currentTheme), [currentTheme]);

  // derived cart totals
  const cartItems = menu.filter(m=>cart[m.id]);
  const totalItems = Object.values(cart).reduce((a,b)=>a+b,0);
  const totalPrice = cartItems.reduce((sum,m)=> sum + (cart[m.id]||0)*m.price, 0);

  return (
    <SafeAreaView style={{flex:1,backgroundColor:currentTheme.bg}}>
      <StatusBar backgroundColor={currentTheme.primary} barStyle={themeName === "Dark" ? "light-content" : "dark-content"} />
      <Header title="Chef Christoffel" sub="Fresh menu — always up to date" count={menu.length} s={s} themeName={themeName} cycleTheme={cycleTheme} />
       <View style={{flex:1}}>
         {screen==="customer"
           ? <Customer menu={menu} openManager={()=>setScreen("chef")} s={s} cart={cart} addToCart={addToCart} />
           : <Chef menu={menu} add={add} remove={remove} back={()=>setScreen("customer")} s={s} />
         }
       </View>

      {/* Footer cart preview */}
      {screen === "customer" && (
        <Animated.View style={[s.cart, { bottom: 74, transform:[{ scale: cartPulse }] }]}>
          <View>
            <Text style={s.cartTxt}>{totalItems} items</Text>
            <Text style={{color:currentTheme.muted,fontSize:12}}>R{totalPrice.toFixed(2)}</Text>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity style={[s.primary,{paddingVertical:8,paddingHorizontal:14,borderRadius:10,marginRight:8}]} onPress={()=>setCartOpen(true)}><Text style={s.pTxt}>Cart</Text></TouchableOpacity>
            <TouchableOpacity onPress={clearCart} style={{paddingVertical:8,paddingHorizontal:12,borderRadius:10,backgroundColor:'#F3F4F6'}}><Text style={{fontWeight:'800'}}>Clear</Text></TouchableOpacity>
          </View>
        </Animated.View>
      )}

       <Nav screen={screen} setScreen={setScreen} s={s} />

      {/* Cart modal (no checkout) */}
      <Modal visible={cartOpen} animationType="slide" transparent={true} onRequestClose={()=>setCartOpen(false)}>
        <Pressable style={{flex:1,backgroundColor:'rgba(0,0,0,0.35)'}} onPress={()=>setCartOpen(false)}>
          <View style={{flex:1,justifyContent:'flex-end'}}>
            <View style={{maxHeight:'70%',backgroundColor:currentTheme.card,borderTopLeftRadius:16,borderTopRightRadius:16,padding:12}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <Text style={{fontWeight:'900',color:currentTheme.text}}>Your Cart ({totalItems})</Text>
                <TouchableOpacity onPress={()=>setCartOpen(false)}><Text style={{color:currentTheme.muted,fontWeight:'800'}}>Close</Text></TouchableOpacity>
              </View>
              <ScrollView style={{marginBottom:8}}>
                {cartItems.length === 0 ? <View style={{padding:24,alignItems:'center'}}><Text style={{color:currentTheme.muted}}>Cart is empty</Text></View> : null}
                {cartItems.map(it=>(
                  <View key={it.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#eee'}}>
                    <View style={{flex:1}}>
                      <Text style={{fontWeight:'800',color:currentTheme.text}}>{it.name}</Text>
                      <Text style={{color:currentTheme.muted}}>R{it.price.toFixed(2)} • {it.course}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <TouchableOpacity onPress={()=>updateCartQty(it.id, Math.max(0,(cart[it.id]||0)-1))} style={{padding:8,marginRight:6,backgroundColor:currentTheme.bg,borderRadius:8}}><Text>-</Text></TouchableOpacity>
                      <Text style={{width:28,textAlign:'center',fontWeight:'800'}}>{cart[it.id]}</Text>
                      <TouchableOpacity onPress={()=>updateCartQty(it.id, (cart[it.id]||0)+1)} style={{padding:8,marginLeft:6,backgroundColor:currentTheme.bg,borderRadius:8}}><Text>+</Text></TouchableOpacity>
                      <TouchableOpacity onPress={()=>removeFromCart(it.id)} style={{padding:8,marginLeft:10,backgroundColor:'#FDE8E8',borderRadius:8}}><Text style={{color:'#D04545',fontWeight:'800'}}>Remove</Text></TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                <Text style={{fontWeight:'900',color:currentTheme.text}}>Total: R{totalPrice.toFixed(2)}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <TouchableOpacity onPress={clearCart} style={{marginRight:8,paddingVertical:8,paddingHorizontal:12,borderRadius:8,backgroundColor:'#F3F4F6'}}><Text style={{fontWeight:'800'}}>Clear</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>setCartOpen(false)} style={{paddingVertical:8,paddingHorizontal:14,borderRadius:8,backgroundColor:currentTheme.primary}}><Text style={{color:'#fff',fontWeight:'900'}}>Done</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* sticky cart preview removed (header cart used) */}
    </SafeAreaView>
  );
}