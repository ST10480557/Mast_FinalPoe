import React, { JSX, useEffect, useMemo, useState, useRef, useEffect as useEff } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, StatusBar, Animated
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Course = "Starters" | "Mains" | "Desserts";
type Dish = { id: string; name: string; description?: string; course: Course; price: number; createdAt: number; };

const STORAGE_KEY = "@chef_menu_items_v2";
const COURSES: Course[] = ["Starters", "Mains", "Desserts"];

const THEMES: Record<string, { primary: string; accent: string; bg: string; card: string; text: string; muted: string; accentAlt?: string }> = {
  Light: { primary: "#246BFD", accent: "#FF6B6B", bg: "#F6F8FB", card: "#FFFFFF", text: "#1F2937", muted: "#6B7280", accentAlt: "#FFD6D6" },
  Dark: { primary: "#0EA5A4", accent: "#F97316", bg: "#0F1724", card: "#061021", text: "#E6EEF8", muted: "#94A3B8", accentAlt: "#1F2937" },
};

const load = async () => { try { const r = await AsyncStorage.getItem(STORAGE_KEY); return r ? (JSON.parse(r) as Dish[]) : []; } catch { return []; } };
const save = async (items: Dish[]) => { try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {} };
const courseColor = (c: Course) => (c === "Starters" ? "#FFB86B" : c === "Mains" ? "#6BB0FF" : "#FF8ACB");

function makeStyles(THEME: { primary: string; accent: string; bg: string; card: string; text: string; muted: string; accentAlt?: string }) {
  return StyleSheet.create({
    h:{padding:16,paddingTop:20,backgroundColor:THEME.primary,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
    hLeft:{flexDirection:"row",alignItems:"center"},
    avatar:{width:52,height:52,borderRadius:26,backgroundColor:THEME.accentAlt || "#FFD6D6",alignItems:"center",justifyContent:"center",marginRight:12,elevation:3},
    avatarTxt:{color:THEME.primary,fontWeight:"900"},
    ht:{color:"#fff",fontSize:20,fontWeight:"800"},
    hs:{color:"#D6E4FF",marginTop:4,opacity:0.95},
    hc:{color:"#fff",marginTop:6,fontWeight:"700"},
    nav:{flexDirection:"row",borderTopWidth:1,borderTopColor:"#eee",backgroundColor:THEME.card},
    tab:{flex:1,padding:12,alignItems:"center"},
    ta:{backgroundColor:THEME.accentAlt || "#F0F6FF"},
    tt:{color:THEME.muted,fontWeight:"800"},
    tta:{color:THEME.primary},
    body:{flex:1,backgroundColor:THEME.bg},
    controls:{padding:14},
    filters:{flexDirection:"row",marginBottom:10},
    pill:{paddingVertical:7,paddingHorizontal:12,borderRadius:20,backgroundColor:THEME.card,marginRight:8,borderWidth:1,borderColor:"#eee"},
    pilla:{borderColor:THEME.primary},
    pt:{color:THEME.muted,fontWeight:"700"},
    pta:{color:THEME.primary},
    search:{flexDirection:"row",alignItems:"center",marginTop:4},
    input:{flex:1,backgroundColor:THEME.card,borderRadius:10,padding:12,borderWidth:1,borderColor:"#eee",color:THEME.text},
    mbtn:{marginLeft:8,backgroundColor:THEME.accent,paddingVertical:10,paddingHorizontal:14,borderRadius:10},
    mbtxt:{color:"#fff",fontWeight:"800"},
    rowWrap:{justifyContent:"space-between"},
    card:{flex:1,backgroundColor:THEME.card,borderRadius:12,padding:12,marginBottom:12,marginHorizontal:6,minWidth:150,maxWidth:"48%",overflow:"hidden"},
    cardShadow:{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 6 },
    strip:{height:6,borderRadius:4,marginBottom:8},
    ct:{fontWeight:"800",color:THEME.text,fontSize:16},
    cc:{color:THEME.muted,fontSize:12,marginTop:6},
    cd:{color:THEME.muted,fontSize:13,marginTop:8,minHeight:36},
    cf:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:10},
    cp:{fontWeight:"900",color:THEME.text},
    row:{flexDirection:"row",alignItems:"center"},
    q:{padding:6,borderRadius:6,backgroundColor:THEME.bg,marginHorizontal:6,borderWidth:1,borderColor:"#eee"},
    qt:{fontWeight:"900",color:THEME.text},
    rm:{marginLeft:8,paddingVertical:6,paddingHorizontal:8,borderRadius:8,backgroundColor:"#FDE8E8"},
    rmt:{color:"#D04545",fontWeight:"800"},
    cart:{position:"absolute",left:12,right:12,bottom:12,backgroundColor:THEME.card,borderRadius:12,padding:12,flexDirection:"row",justifyContent:"space-between",alignItems:"center",elevation:3, ...Platform.select({ios:{shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.06,shadowRadius:8}})},
    cartTxt:{color:THEME.text,fontWeight:"700"},
    primary:{backgroundColor:THEME.primary,paddingVertical:8,paddingHorizontal:12,borderRadius:8},
    pTxt:{color:"#fff",fontWeight:"800"},
    empty:{padding:24,alignItems:"center"},
    emptyTxt:{color:THEME.muted},
    chefTop:{padding:12,backgroundColor:THEME.card,borderBottomWidth:1,borderBottomColor:"#eee"},
    back:{color:THEME.primary,fontWeight:"800",marginBottom:6},
    ctitle:{fontSize:18,fontWeight:"900",color:THEME.text},
    csub:{color:THEME.muted,marginTop:4},
    form:{padding:12,backgroundColor:THEME.card,marginTop:8},
    courseRow:{flexDirection:"row",marginTop:8},
    courseOpt:{flex:1,paddingVertical:10,alignItems:"center",borderRadius:8,borderWidth:1,borderColor:"#eee",backgroundColor:THEME.card,marginRight:8},
    courseOptA:{backgroundColor:THEME.primary},
    courseTxt:{color:THEME.text,fontWeight:"700"},
    courseTxtA:{color:"#fff"},
    formActions:{flexDirection:"row",marginTop:12},
    ghost:{flex:1,borderWidth:1,borderColor:"#eee",padding:12,borderRadius:8,alignItems:"center",marginRight:8},
    ghostTxt:{fontWeight:"800",color:THEME.muted},
    add:{flex:1,backgroundColor:THEME.primary,padding:12,borderRadius:8,alignItems:"center"},
    addTxt:{color:"#fff",fontWeight:"900"},
    list:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:12,backgroundColor:THEME.card,marginBottom:8,borderRadius:8},
    lt:{fontWeight:"800",color:THEME.text},
    lm:{color:THEME.muted,marginTop:4},
    rmBtn:{paddingVertical:8,paddingHorizontal:12,borderRadius:8,backgroundColor:THEME.accent},
    rmBtnTxt:{color:"#fff",fontWeight:"800"},
    themeSw:{position:"absolute",right:12,top:12,flexDirection:"row",alignItems:"center",padding:6,borderRadius:20,backgroundColor:THEME.card,borderWidth:1,borderColor:"#eee"},
    avatarSmall:{width:36,height:36,borderRadius:18,backgroundColor:THEME.accentAlt||"#FFD6D6",alignItems:"center",justifyContent:"center",marginRight:8},
    avatarSmallTxt:{color:THEME.primary,fontWeight:"800"}
  });
}

function Header({ title, sub, count, s, themeName, cycleTheme }: { title: string; sub?: string; count?: number; s: any; themeName: string; cycleTheme: ()=>void }) {
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
      <TouchableOpacity onPress={cycleTheme} style={s.themeSw}><Text style={{color:'#555',fontWeight:'700'}}>{themeName}</Text></TouchableOpacity>
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

const Card = ({ item, onQty, onRemove, s }: { item: Dish; onQty?: (id: string, d: number) => void; onRemove?: (id: string) => void; s: any }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEff(()=> { Animated.timing(anim, { toValue: 1, duration: 320, useNativeDriver: true }).start(); }, []);
  const initials = item.name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
  return (
    <Animated.View style={[s.card, s.cardShadow, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0,1], outputRange: [0.98,1] }) }] }]}>
      <View style={[s.strip, { backgroundColor: courseColor(item.course) }]} />
      <View style={{flexDirection:"row",alignItems:"center"}}>
        <View style={s.avatarSmall}><Text style={s.avatarSmallTxt}>{initials}</Text></View>
        <View style={{flex:1}}>
          <Text style={s.ct}>{item.name}</Text>
          <Text style={s.cc}>{item.course}</Text>
        </View>
      </View>
      {item.description ? <Text style={s.cd}>{item.description}</Text> : null}
      <View style={s.cf}>
        <Text style={s.cp}>R{item.price.toFixed(2)}</Text>
        <View style={s.row}>
          {onQty ? <>
            <TouchableOpacity onPress={() => onQty(item.id, -1)} style={s.q}><Text style={s.qt}>−</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => onQty(item.id, +1)} style={s.q}><Text style={s.qt}>+</Text></TouchableOpacity>
          </> : null}
          {onRemove ? <TouchableOpacity onPress={() => onRemove(item.id)} style={s.rm}><Text style={s.rmt}>Remove</Text></TouchableOpacity> : null}
        </View>
      </View>
    </Animated.View>
  );
};

function Customer({ menu, openManager, s }: { menu: Dish[]; openManager: () => void; s: any }) {
  const [filter, setFilter] = useState<"All" | Course>("All");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const visible = useMemo(() => {
    let items = filter === "All" ? menu : menu.filter(m => m.course === filter);
    if (q.trim()) { const Q = q.toLowerCase(); items = items.filter(i => i.name.toLowerCase().includes(Q) || (i.description || "").toLowerCase().includes(Q)); }
    return items;
  }, [menu, filter, q]);

  const changeQty = (id: string, d: number) => setCart(s => { const c = { ...s }; const n = Math.max(0, (c[id]||0)+d); if (n) c[id]=n; else delete c[id]; return c; });
  const totalItems = Object.values(cart).reduce((a,b)=>a+b,0);
  const totalPrice = menu.reduce((sum,m)=> sum + (cart[m.id]||0)*m.price, 0);

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
      </View>

      <FlatList data={visible} keyExtractor={i=>i.id} numColumns={2} columnWrapperStyle={s.rowWrap}
        renderItem={({item})=> <Card item={item} onQty={changeQty} s={s} />} ListEmptyComponent={<View style={s.empty}><Text style={s.emptyTxt}>No dishes.</Text></View>} />

      <View style={s.cart}>
        <Text style={s.cartTxt}>{totalItems} items • R{totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={[s.primary,{paddingVertical:8,paddingHorizontal:14,borderRadius:8}]}><Text style={s.pTxt}>Checkout</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function Chef({ menu, add, remove, back, s }: { menu: Dish[]; add: (d: Omit<Dish,"id"|"createdAt">)=>void; remove: (id:string)=>void; back: ()=>void; s:any }) {
  const [name, setName] = useState(""); const [desc,setDesc]=useState(""); const [course,setCourse]=useState<Course>("Mains"); const [price,setPrice]=useState("");
  const submit = ()=> { if(!name.trim()) return Alert.alert("Validation","Enter dish name."); const p = parseFloat(price); if(Number.isNaN(p)||p<0) return Alert.alert("Validation","Enter valid price."); add({name:name.trim(),description:desc.trim(),course,price:p}); setName(""); setDesc(""); setCourse("Mains"); setPrice(""); };

  return (
    <KeyboardAvoidingView style={s.body} behavior={Platform.OS==="ios"?"padding":undefined}>
      <View style={s.chefTop}><TouchableOpacity onPress={back}><Text style={s.back}>← Back</Text></TouchableOpacity>
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

  useEffect(()=>{ (async()=>{ const m = await load(); setMenu(m); })(); },[]);
  const persist = async (items: Dish[])=>{ setMenu(items); await save(items); };

  const add = (d: Omit<Dish,"id"|"createdAt">)=> persist([{ ...d, id: String(Date.now()), createdAt: Date.now() }, ...menu]);
  const remove = (id: string)=> {
    const del = ()=> persist(menu.filter(m=>m.id!==id));
    if (Platform.OS==="web" && typeof window!=="undefined") { if (window.confirm("Delete this dish?")) del(); return; }
    Alert.alert("Delete","Remove this dish?",[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:del}]);
  };

  const cycleTheme = () => {
    const keys = Object.keys(THEMES);
    const idx = keys.indexOf(themeName as string);
    const next = keys[(idx + 1) % keys.length];
    setThemeName(next as keyof typeof THEMES);
  };

  const currentTheme = useMemo(()=> THEMES[themeName], [themeName]);
  const s = useMemo(()=> makeStyles(currentTheme), [currentTheme]);

  return (
    <SafeAreaView style={{flex:1,backgroundColor:currentTheme.bg}}>
      <StatusBar backgroundColor={currentTheme.primary} barStyle={themeName === "Dark" ? "light-content" : "dark-content"} />
      <Header title="Chef Christoffel" sub="Fresh menu — always up to date" count={menu.length} s={s} themeName={themeName} cycleTheme={cycleTheme} />
      <View style={{flex:1}}>{screen==="customer" ? <Customer menu={menu} openManager={()=>setScreen("chef")} s={s} /> : <Chef menu={menu} add={add} remove={remove} back={()=>setScreen("customer")} s={s} />}</View>
      <Nav screen={screen} setScreen={setScreen} s={s} />
    </SafeAreaView>
  );
}