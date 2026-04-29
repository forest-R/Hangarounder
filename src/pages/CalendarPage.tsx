import { useState } from "react";
import { CampingRecord } from "../types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { ko } from "date-fns/locale";

const COLORS = [
  "#C8E6C0",
  "#B8D4E8",
  "#F5C9A0",
  "#D4BEE8",
  "#F5C0C0",
  "#B8E8D4",
];

function getDayRecords(records: CampingRecord[], date: Date): CampingRecord[] {
  return records.filter((r) => {
    const start = parseISO(r.id);
    const end = r.endDate ? parseISO(r.endDate) : start;
    return isWithinInterval(date, { start, end });
  });
}

export default function CalendarPage({
  records,
  onSelectDate,
}: {
  records: CampingRecord[];
  onSelectDate: (date: string) => void;
}) {
  const [month, setMonth] = useState(new Date());

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  // 레코드 시작일 기준 정렬 후 색상 고정
  const sortedRecords = [...records].sort((a, b) => a.id.localeCompare(b.id));
  const colorMap = new Map<string, string>();
  sortedRecords.forEach((r, i) => colorMap.set(r.id, COLORS[i % COLORS.length]));

  const thisMonthRecords = sortedRecords.filter((r) => {
    const start = parseISO(r.id);
    const end = r.endDate ? parseISO(r.endDate) : start;
    return (
      isWithinInterval(monthStart, { start, end }) ||
      isWithinInterval(monthEnd, { start, end }) ||
      (start >= monthStart && start <= monthEnd)
    );
  });

  return (
    <div className="flex flex-col pb-4">
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-xl font-medium text-forest-800">
          {format(month, "yyyy년 M월", { locale: ko })}
        </h1>
        <div className="flex gap-1">
          <button onClick={() => setMonth((m) => subMonths(m, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full text-forest-600 active:bg-white">‹</button>
          <button onClick={() => setMonth(new Date())}
            className="px-3 h-8 flex items-center justify-center rounded-full text-xs text-forest-600 border border-forest-200 active:bg-white">오늘</button>
          <button onClick={() => setMonth((m) => addMonths(m, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full text-forest-600 active:bg-white">›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 px-3">
        {["일","월","화","수","목","금","토"].map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1 font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 px-3">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} className="flex flex-col items-center py-2" style={{ minHeight: "56px" }}>
            <span className="w-7 h-7" />
            <div className="flex flex-col gap-0.5 w-full px-1 mt-1">
              <div className="h-1.5 w-full opacity-0" />
              <div className="h-1.5 w-full opacity-0" />
            </div>
          </div>
        ))}
        {days.map((day) => {
          const dayRecords = getDayRecords(sortedRecords, day);
          const isToday = isSameDay(day, new Date());
          const dateStr = format(day, "yyyy-MM-dd");
          const slots = [dayRecords[0] ?? null, dayRecords[1] ?? null];

          return (
            <div key={dateStr} className="flex flex-col items-center py-2 rounded-xl" style={{ minHeight: "56px" }}>
              <span
                onClick={() => onSelectDate(dayRecords[0] ? dayRecords[0].id : dateStr)}
                className={`text-sm w-7 h-7 flex items-center justify-center rounded-full font-medium cursor-pointer active:opacity-70 ${
                  isToday ? "bg-forest-600 text-white" : "text-gray-700"
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-col gap-0.5 w-full px-1 mt-1">
                {slots.map((r, idx) => (
                  <div
                    key={idx}
                    onClick={() => r && onSelectDate(r.id)}
                    className="h-1.5 rounded-full w-full cursor-pointer active:opacity-70"
                    style={{ background: r ? colorMap.get(r.id) : "transparent" }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {thisMonthRecords.length > 0 && (
        <div className="px-5 mt-4">
          <p className="text-xs text-gray-400 font-medium mb-2">이번 달 캠핑</p>
          <div className="flex flex-col gap-2">
            {thisMonthRecords.map((r) => {
              const nights = r.endDate
                ? Math.round((parseISO(r.endDate).getTime() - parseISO(r.id).getTime()) / 86400000)
                : 0;
              const label = nights === 0 ? "당일" : `${nights}박 ${nights + 1}일`;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectDate(r.id)}
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100 active:bg-gray-50 text-left"
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colorMap.get(r.id) }} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.title || "제목 없음"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(parseISO(r.id), "M월 d일")}
                      {r.endDate && ` – ${format(parseISO(r.endDate), "d일")}`}
                      {" · "}{label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {thisMonthRecords.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-300">
          <div className="text-5xl mb-3">⛺</div>
          <p className="text-sm">이번 달 캠핑 기록이 없어요</p>
        </div>
      )}
    </div>
  );
}
