import { useState } from "react";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { LedgerEntry, CampingRecord } from "../types";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ko } from "date-fns/locale";

const CATEGORIES: LedgerEntry["category"][] = ["캠핑장", "식비", "교통", "장비", "기타"];
const CAT_COLORS: Record<string, string> = {
  캠핑장: "bg-forest-100 text-forest-800",
  식비:   "bg-amber-100 text-amber-800",
  교통:   "bg-blue-100 text-blue-800",
  장비:   "bg-purple-100 text-purple-800",
  기타:   "bg-gray-100 text-gray-600",
};

export default function LedgerPage({
  entries,
  records,
}: {
  entries: LedgerEntry[];
  records: CampingRecord[];
}) {
  const [month, setMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "식비" as LedgerEntry["category"],
    description: "",
    amount: "",
  });

  const mStart = startOfMonth(month);
  const mEnd = endOfMonth(month);

  const monthEntries = entries
    .filter((e) => {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start: mStart, end: mEnd });
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const total = monthEntries.reduce((s, e) => s + e.amount, 0);

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    sum: monthEntries.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((x) => x.sum > 0);

  const prevMonth = () => setMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() - 1); return d; });
  const nextMonth = () => setMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() + 1); return d; });

  const save = async () => {
    if (!form.description.trim() || !form.amount) return;
    await addDoc(collection(db, "ledger"), {
      ...form,
      amount: Number(form.amount),
    });
    setShowForm(false);
    setForm({ date: format(new Date(), "yyyy-MM-dd"), category: "식비", description: "", amount: "" });
  };

  const del = async (id: string) => {
    if (!confirm("삭제할까요?")) return;
    await deleteDoc(doc(db, "ledger", id));
  };

  return (
    <div className="flex flex-col pb-6">
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-forest-600 rounded-full active:bg-forest-100">‹</button>
          <span className="text-xl font-medium text-forest-800 mx-1">
            {format(month, "yyyy년 M월", { locale: ko })}
          </span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-forest-600 rounded-full active:bg-forest-100">›</button>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-forest-600 text-white text-sm px-4 py-1.5 rounded-full active:bg-forest-800"
        >
          {showForm ? "취소" : "+ 추가"}
        </button>
      </div>

      {showForm && (
        <div className="mx-5 mb-3 bg-white rounded-2xl p-4 border border-gray-100 flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setForm((f) => ({ ...f, category: c }))}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  form.category === c
                    ? "bg-forest-600 text-white border-forest-600"
                    : "border-gray-200 text-gray-500"
                }`}
              >{c}</button>
            ))}
          </div>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="text-sm text-gray-600 border border-gray-100 rounded-xl px-3 py-2 outline-none bg-forest-50"
          />
          <input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="항목 이름"
            className="text-sm text-gray-700 border border-gray-100 rounded-xl px-3 py-2 outline-none placeholder-gray-300 bg-forest-50"
          />
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="금액"
              className="flex-1 text-sm text-gray-700 border border-gray-100 rounded-xl px-3 py-2 outline-none placeholder-gray-300 bg-forest-50"
            />
            <span className="text-sm text-gray-400">원</span>
          </div>
          <button
            onClick={save}
            className="bg-forest-600 text-white rounded-xl py-2.5 text-sm font-medium active:bg-forest-800"
          >저장</button>
        </div>
      )}

      <div className="px-5 mb-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">이번 달 총 지출</p>
          <p className="text-2xl font-medium text-forest-800">{total.toLocaleString()}원</p>
          {byCategory.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {byCategory.map(({ cat, sum }) => (
                <div key={cat} className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLORS[cat]}`}>{cat}</span>
                  <span className="text-xs text-gray-500">{sum.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-2">
        {monthEntries.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100"
          >
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${CAT_COLORS[e.category]}`}>
              {e.category}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 truncate">{e.description}</p>
              <p className="text-xs text-gray-400">{format(parseISO(e.date), "M월 d일")}</p>
            </div>
            <span className="text-sm font-medium text-gray-700 flex-shrink-0">
              {e.amount.toLocaleString()}
            </span>
            <button
              onClick={() => del(e.id)}
              className="text-gray-200 text-xs active:text-red-400 ml-1"
            >✕</button>
          </div>
        ))}
        {monthEntries.length === 0 && (
          <div className="flex flex-col items-center py-16 text-gray-300">
            <div className="text-5xl mb-3">💰</div>
            <p className="text-sm">이번 달 지출 내역이 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}
