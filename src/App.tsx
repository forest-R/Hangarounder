import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";
import { parseISO, isWithinInterval } from "date-fns";
import { auth, db } from "./lib/firebase";
import { CampingRecord, EquipmentCategory, EquipmentItem, LedgerEntry } from "./types";
import Shell from "./components/Shell";
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";
import RecordPage from "./pages/RecordPage";
import EquipmentPage from "./pages/EquipmentPage";
import LedgerPage from "./pages/LedgerPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";

export type Tab = "home" | "calendar" | "record" | "equipment" | "ledger" | "profile";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("home");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedMemoDate, setSelectedMemoDate] = useState<string | null>(null);

  const [records, setRecords] = useState<CampingRecord[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubs = [
      onSnapshot(query(collection(db, "records")), (snap) =>
        setRecords(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CampingRecord)))),
      onSnapshot(query(collection(db, "categories")), (snap) =>
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EquipmentCategory)))),
      onSnapshot(query(collection(db, "items")), (snap) =>
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EquipmentItem)))),
      onSnapshot(query(collection(db, "ledger")), (snap) =>
        setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LedgerEntry)))),
    ];
    return () => unsubs.forEach((u) => u());
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-forest-50">
      <div className="text-forest-600 text-lg font-medium">Hangarounder</div>
    </div>
  );

  if (!user) return <LoginPage />;

  const openRecord = (date: string) => {
  const clickedDate = parseISO(date);
  
  // 1순위: 클릭한 날짜가 정확히 시작일인 레코드
  const exactMatch = records.find((r) => r.id === date);
  if (exactMatch) {
    setSelectedRecordId(exactMatch.id);
    setSelectedMemoDate(date);
    setTab("record");
    return;
  }

  // 2순위: 클릭한 날짜가 범위 안에 있는 레코드 (시작일 기준 정렬 후 가장 늦은 것)
  const rangeMatches = records.filter((r) => {
    const start = parseISO(r.id);
    const end = r.endDate ? parseISO(r.endDate) : start;
    return isWithinInterval(clickedDate, { start, end });
  }).sort((a, b) => b.id.localeCompare(a.id)); // 시작일 늦은 것 우선

  setSelectedRecordId(rangeMatches.length > 0 ? rangeMatches[0].id : date);
  setSelectedMemoDate(date);
  setTab("record");
};

  return (
    <Shell tab={tab} setTab={setTab}>
      {tab === "home" && (
        <HomePage records={records} />
      )}
      {tab === "calendar" && (
        <CalendarPage records={records} onSelectDate={openRecord} />
      )}
      {tab === "record" && (
       <RecordPage
        key={selectedRecordId}
        records={records}
        categories={categories}
        items={items}
        initialDate={selectedRecordId}
        initialMemoDate={selectedMemoDate}
        user={user}
        onSaved={() => setTab("calendar")}
  />
)}
      {tab === "equipment" && <EquipmentPage categories={categories} items={items} />}
      {tab === "ledger" && <LedgerPage entries={entries} records={records} />}
      {tab === "profile" && <ProfilePage user={user} />}
    </Shell>
  );
}
