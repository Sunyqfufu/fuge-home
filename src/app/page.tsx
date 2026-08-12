"use client";

import { FormEvent, useMemo, useState } from "react";

type Item = { id: number; name: string; category: string; location: string; quantity: string; expiry?: string; status: string; icon: string; note?: string };

const starterItems: Item[] = [
  { id: 1, name: "创可贴", category: "药品", location: "客厅 · 电视柜 · 右侧第二抽屉", quantity: "2 盒", expiry: "2028-04", status: "未开封", icon: "🩹" },
  { id: 2, name: "洗衣液", category: "清洁", location: "阳台 · 洗衣柜 · 下层", quantity: "2 瓶", expiry: "2027-12", status: "未开封", icon: "🧴" },
  { id: 3, name: "备用电池", category: "数码", location: "玄关 · 玄关柜 · 上层", quantity: "4 节", status: "未开封", icon: "🔋" },
  { id: 4, name: "十字螺丝刀", category: "工具", location: "书房 · 工具箱", quantity: "1 把", status: "在用", icon: "🪛" },
];

const locations = [
  ["客厅", ["电视柜", "茶几收纳格"]],
  ["厨房", ["冰箱", "水槽下柜", "调料抽屉"]],
  ["阳台", ["洗衣柜", "清洁杂物柜"]],
  ["书房", ["书桌抽屉", "工具箱"]],
  ["玄关", ["玄关柜", "鞋柜"]],
];

export default function Home() {
  const [view, setView] = useState<"home" | "map" | "items" | "add" | "detail">("home");
  const [items, setItems] = useState<Item[]>(starterItems);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Item>(starterItems[0]);
  const [draft, setDraft] = useState("");
  const [category, setCategory] = useState("其他");
  const [location, setLocation] = useState("阳台 · 洗衣柜 · 下层");
  const [message, setMessage] = useState("");

  const shownItems = useMemo(() => items.filter((item) => `${item.name}${item.category}${item.location}`.includes(query.trim())), [items, query]);
  const showDetail = (item: Item) => { setSelected(item); setView("detail"); };
  const saveItem = (event: FormEvent) => {
    event.preventDefault();
    const name = draft.trim() || "未命名物品";
    const item: Item = { id: Date.now(), name, category, location, quantity: "1 件", status: "未开封", icon: "📦", note: "由快速记录创建，等待后续 AI 解析接入。" };
    setItems((current) => [item, ...current]); setSelected(item); setMessage("已保存到家庭物品库"); setDraft(""); setView("detail");
  };

  return <main className="app-shell">
    <header className="topbar"><button className="brand" onClick={() => setView("home")}><span className="brand-cat" /> 福哥的家</button><div className="family-chip"><span className="avatar">D</span> 福哥的家 <span className="chev">⌄</span></div></header>
    <section className="page">
      {view === "home" && <>
        <div className="welcome hero"><div><p className="eyebrow">星期二 · 8 月 12 日</p><h1>家里的每样东西，<br/>大福都记得住。</h1><p>用一句话记下它放在哪里。</p></div><span className="cat-mascot" aria-label="大福猫咪" /></div>
        <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索物品或收纳位置" onFocus={() => setView("items")} /></label>
        <div className="room-strip"><button onClick={() => { setLocation("客厅 · 电视柜"); setView("items"); }}><span>🛋</span>客厅收纳</button><button onClick={() => { setLocation("厨房 · 水槽下柜"); setView("items"); }}><span>🍳</span>厨房收纳</button><button onClick={() => { setLocation("阳台 · 洗衣柜"); setView("items"); }}><span>🧺</span>阳台收纳</button></div>
        <div className="action-grid"><button className="primary-action" onClick={() => setView("items")}><b>⌕</b><span><strong>物品搜索</strong><small>搜索家里的所有物品</small></span></button><button className="primary-action voice-action" onClick={() => setView("add")}><b>♩</b><span><strong>快速录入</strong><small>文字或照片记录物品</small></span></button></div>
        <section className="section"><div className="section-head"><h2>需要留意</h2><button onClick={() => setView("items")}>查看全部</button></div><div className="notice"><span className="notice-icon">◷</span><div><strong>暂无临期物品</strong><p>记录有效期后，会在这里提醒你。</p></div><button onClick={() => setView("add")}>去记录</button></div></section>
        <section className="section"><div className="section-head"><h2>最近记录</h2><button onClick={() => setView("items")}>全部物品</button></div><div className="item-list">{items.slice(0, 3).map((item) => <ItemRow key={item.id} item={item} onClick={() => showDetail(item)} />)}</div></section>
      </>}

      {view === "map" && <><div className="page-title"><div><p className="eyebrow">家庭空间</p><h1>收纳地图</h1><p>从房间到抽屉，记住每个位置。</p></div><button className="round-add" onClick={() => setView("add")}>＋</button></div><div className="map-card">{locations.map(([room, children]) => <div className="location-group" key={room as string}><div className="location-room"><span>⌂</span><strong>{room as string}</strong><small>{(children as string[]).length} 个收纳地点</small></div>{(children as string[]).map((place) => <button key={place} className="location-node" onClick={() => { setLocation(`${room} · ${place}`); setView("items"); }}><span>└</span>{place}<em>›</em></button>)}</div>)}</div><button className="wide-outline" onClick={() => setView("add")}>＋ 添加收纳地点</button></>}

      {view === "items" && <><div className="page-title compact"><div><p className="eyebrow">家庭物品库</p><h1>所有物品</h1></div><button className="round-add" onClick={() => setView("add")}>＋</button></div><label className="search"><span>⌕</span><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索物品、位置或类别" /></label><div className="filters"><button className="active">全部</button><button>按位置</button><button>清洁</button><button>药品</button></div><div className="item-list full">{shownItems.length ? shownItems.map((item) => <ItemRow key={item.id} item={item} onClick={() => showDetail(item)} />) : <div className="empty"><span>⌕</span><strong>没有找到相关物品</strong><p>换个词试试，或添加一条新记录。</p></div>}</div></>}

      {view === "add" && <><button className="back" onClick={() => setView("home")}>‹ 返回</button><div className="page-title compact"><div><p className="eyebrow">快速记录</p><h1>记下新物品</h1><p>先写下来，系统会帮你整理。</p></div></div><form onSubmit={saveItem} className="record-form"><label><span>描述物品</span><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="例如：两瓶洗衣液放在阳台洗衣柜下层，保质期到 2027 年 12 月。" autoFocus /></label><div className="photo-slot"><span>▧</span><strong>添加物品或位置照片</strong><small>第一版原型暂不上传，后续接入图片存储</small></div><label><span>物品类别</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option>其他</option><option>清洁</option><option>药品</option><option>食品</option><option>工具</option><option>数码</option></select></label><label><span>收纳位置</span><select value={location} onChange={(e) => setLocation(e.target.value)}>{locations.flatMap(([room, places]) => (places as string[]).map((place) => <option key={`${room}-${place}`}>{room} · {place}</option>))}</select></label><button className="save" type="submit">确认保存</button><p className="helper">下一阶段会在此接入 AI：自动从描述中建议名称、数量、位置和到期日。</p></form></>}

      {view === "detail" && <><button className="back" onClick={() => setView("items")}>‹ 返回物品库</button><article className="detail"><div className="item-hero"><span>{selected.icon}</span><div><p className="eyebrow">{selected.category}</p><h1>{selected.name}</h1><p>{selected.quantity} · {selected.status}</p></div></div>{message && <p className="toast">✓ {message}</p>}<div className="detail-card"><p className="label">收纳位置</p><strong className="path">{selected.location}</strong><button onClick={() => { setLocation(selected.location); setView("map"); }}>在收纳地图中查看 ›</button></div><div className="detail-card split"><div><p className="label">有效期</p><strong>{selected.expiry || "未记录"}</strong></div><div><p className="label">状态</p><strong>{selected.status}</strong></div></div><div className="detail-card"><p className="label">记录说明</p><p>{selected.note || "这件物品已记录在家庭物品库中。"}</p></div><div className="detail-actions"><button onClick={() => setView("add")}>编辑记录</button><button onClick={() => setLocation(selected.location)}>移动物品</button><button className="danger" onClick={() => { setItems((current) => current.filter((item) => item.id !== selected.id)); setView("items"); }}>归档</button></div></article></>}
    </section>
    <nav className="bottom-nav"><button className={view === "home" ? "selected" : ""} onClick={() => setView("home")}><span>⌂</span>首页</button><button className={view === "map" ? "selected" : ""} onClick={() => setView("map")}><span>⌘</span>地图</button><button className="nav-plus" onClick={() => setView("add")}>＋</button><button className={view === "items" || view === "detail" ? "selected" : ""} onClick={() => setView("items")}><span>▦</span>物品</button><button><span>◉</span>我的</button></nav>
  </main>;
}

function ItemRow({ item, onClick }: { item: Item; onClick: () => void }) { return <button className="item-row" onClick={onClick}><span className="item-icon">{item.icon}</span><span className="item-info"><strong>{item.name}</strong><small>{item.location}</small></span><span className="item-meta"><b>{item.quantity}</b><small>{item.expiry ? `有效期 ${item.expiry}` : item.status}</small></span><span className="arrow">›</span></button>; }
