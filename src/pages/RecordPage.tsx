import { useState, useEffect } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CampingRecord, EquipmentCategory, EquipmentItem } from "../types";
import { User } from "firebase/auth";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale";

const WEATHER_OPTIONS = [
  { label: "맑음", emoji: "☀️" },
  { label: "구름", emoji: "⛅" },
  { label: "비", emoji: "🌧" },
  { label: "눈", emoji: "❄️" },
  { label: "바람", emoji: "💨" },
];

export default function RecordPage({
  records, categories, items, initialDate, user,
}: {
  records: CampingRecord[];
  categories: EquipmentCategory[];
  items: EquipmentItem[];
  initialDate: string | null;
  user: User;
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [dateId, setDateId] = useState(initialDate ?? today);
  const existing = records.find((r) => r.id === dateId);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weather, setWeather] = useState("");
  const [tempLow, setTempLow] = useState("");
  const [tempHigh, setTempHigh] = useState("");
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [gearOpen, setGearOpen] = useState(true);
  const [activeMemoDt, setActiveMemoDt] = useState(dateId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title ?? "");
      setLocation(existing.location ?? "");
      setEndDate(existing.endDate ?? "");
      setWeather(existing.weather ?? "");
      setTempLow(existing.tempLow?.toString() ?? "");
      setTempHigh(existing.tempHigh?.toString() ?? "");
      setMemos(existing.memos ?? {});
      setCheckedItems(existing.checkedItems ?? []);
      setActiveMemoDt(existing.id);
    } else {
      setTitle(""); setLocation(""); setEndDate(""); setWeather("");
      setTempLow(""); setTempHigh("");
      setMemos({}); setCheckedItems([]); setActiveMemoDt(dateId);
    }
  }, [dateId]);

  const memoDates =
    endDate && endDate > dateId
      ? eachDayOfInterval({ start: parseISO(dateId), end: parseISO(endDate) }).map(
          (d) => format(d, "yyyy-MM-dd")
        )
      : [dateId];

  const save = async () => {
    setSaving(true);
    const data: Omit<CampingRecord, "id"> = {
      title, location, weather,
      ...(tempLow !== "" ? { tempLow: Number(tempLow) } : {}),
      ...(tempHigh !== "" ? { tempHigh: Number(tempHigh) } : {}),
      memos, checkedItems,
      createdAt: existing?.createdAt ?? Date.now(),
      ...(endDate && endDate > dateId ? { endDate } : {}),
    };
    await setDoc(doc(db, "records", dateId), data);
    setSaving(false);
  };

  const deleteRecord = async () => {
    if (!existing) return;
    if (!confirm("이 기록을 삭제할까요?")) return;
    await deleteDoc(doc(db, "records", dateId));
    setTitle(""); setLocation(""); setEndDate(""); setWeather("");
    setTempLow(""); setTempHigh("");
    setMemos({}); setCheckedItems([]);
  };

  const toggleItem = (name: string) => {
    setCheckedItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col pb-8">
      <div className="px-5 pt-6 pb-3">
        <input
          type="date"
          value={dateId}
          onChange={(e) => setDateId(e.target.value)}
          className="text-xs text-gray-400 bg-transparent border-none outline-none mb-1"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="캠핑장 이름"
          className="text-2xl font-medium text-forest-800 bg-transparent border-none outline-none w-full placeholder-gray-300"
        />
      </div>

      <div className="px-5 flex flex-col gap-3">
        {/* 기간 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-forest-600 font-medium uppercase tracking-wide mb-2">기간</p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="text-gray-600">{format(parseISO(dateId), "M월 d일 (eee)", { locale: ko })}</span>
            <span className="text-gray-300">–</span>
            <input
              type="date" value={endDate} min={dateId}
              onChange={(e) => { setEndDate(e.target.value); setActiveMemoDt(dateId); }}
              className="text-gray-500 bg-transparent border-none outline-none text-sm"
            />
            {endDate && (
              <button onClick={() => setEndDate("")} className="text-gray-300 text-xs">✕</button>
            )}
          </div>
        </div>

        {/* 장소 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-forest-600 font-medium uppercase tracking-wide mb-2">장소</p>
          <input
            value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="상세 주소나 사이트 번호"
            className="w-full text-sm text-gray-700 bg-transparent border-none outline-none placeholder-gray-300"
          />
        </div>

        {/* 날씨 + 기온 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-forest-600 font-medium uppercase tracking-wide mb-2">날씨</p>
          <div className="flex gap-2 flex-wrap mb-3">
            {WEATHER_OPTIONS.map((w) => (
              <button
                key={w.label}
                onClick={() => setWeather(weather === w.label ? "" : w.label)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  weather === w.label
                    ? "bg-forest-600 text-white border-forest-600"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {w.emoji} {w.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">최저</span>
            <input
              type="number" value={tempLow}
              onChange={(e) => setTempLow(e.target.value)}
              placeholder="0"
              className="w-16 text-sm text-gray-700 border border-gray-200 rounded-xl px-2 py-1 outline-none text-center bg-forest-50"
            />
            <span className="text-xs text-gray-400">°C</span>
            <span className="text-xs text-gray-400 ml-2">최고</span>
            <input
              type="number" value={tempHigh}
              onChange={(e) => setTempHigh(e.target.value)}
              placeholder="0"
              className="w-16 text-sm text-gray-700 border border-gray-200 rounded-xl px-2 py-1 outline-none text-center bg-forest-50"
            />
            <span className="text-xs text-gray-400">°C</span>
          </div>
        </div>

        {/* 날짜별 메모 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-forest-600 font-medium uppercase tracking-wide mb-2">메모</p>
          {memoDates.length > 1 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {memoDates.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveMemoDt(d)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs border transition-colors ${
                    activeMemoDt === d
                      ? "bg-forest-600 text-white border-forest-600"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  {format(parseISO(d), "d일")}
                </button>
              ))}
            </div>
          )}
          <textarea
            value={memos[activeMemoDt] ?? ""}
            onChange={(e) => setMemos((prev) => ({ ...prev, [activeMemoDt]: e.target.value }))}
            placeholder="오늘의 기록..."
            rows={4}
            className="w-full text-sm text-gray-700 bg-forest-50 rounded-xl px-3 py-2.5 border-none outline-none resize-none placeholder-gray-300"
          />
        </div>

        {/* 캠핑 장비 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setGearOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-forest-50"
          >
            <p className="text-xs text-forest-600 font-medium uppercase tracking-wide">Camping Gear</p>
            <span className="text-gray-400 text-sm">{gearOpen ? "▲" : "▼"}</span>
          </button>
          {gearOpen && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              {sortedCategories.length === 0 && (
                <p className="text-xs text-gray-300">장비 탭에서 장비를 추가해주세요</p>
              )}
              {sortedCategories.map((cat) => {
                const catItems = items
                  .filter((i) => i.categoryId === cat.id)
                  .sort((a, b) => a.order - b.order);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <p className="text-xs text-gray-400 mb-1.5">{cat.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {catItems.map((item) => {
                        const checked = checkedItems.includes(item.name);
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleItem(item.name)}
                            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                              checked
                                ? "bg-forest-100 text-forest-800 border-forest-200"
                                : "border-gray-200 text-gray-400"
                            }`}
                          >
                            {checked ? "✓ " : ""}{item.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 저장/삭제 */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={save} disabled={saving}
            className="flex-1 bg-forest-600 text-white rounded-2xl py-3 text-sm font-medium active:bg-forest-800 transition-colors disabled:opacity-50"
          >
            {saving ? "저장 중..." : existing ? "수정 저장" : "기록 저장"}
          </button>
          {existing && (
            <button
              onClick={deleteRecord}
              className="px-5 bg-white border border-gray-200 text-gray-400 rounded-2xl py-3 text-sm active:bg-gray-50"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
