import { CampingRecord } from "../types";
import { parseISO, format } from "date-fns";

const YEARS = [2026, 2027, 2028, 2029, 2030];
const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

export default function HomePage({ records }: { records: CampingRecord[] }) {
  const total = records.length;

  // 연도별 월별 카운트
  const countByYearMonth = (year: number, month: number) => {
    return records.filter((r) => {
      const d = parseISO(r.id);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  };

  const maxCount = Math.max(
    ...YEARS.flatMap((y) => MONTHS.map((_, m) => countByYearMonth(y, m))),
    1
  );

  return (
    <div className="flex flex-col pb-8">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-medium text-forest-800">우리의 캠핑</h1>
      </div>

      {/* 총 횟수 */}
      <div className="mx-5 mb-5 bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
        <div className="text-4xl">⛺</div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">총 캠핑 횟수</p>
          <p className="text-3xl font-medium text-forest-800">{total}<span className="text-base text-gray-400 ml-1">회</span></p>
        </div>
      </div>

      {/* 연도별 월별 그래프 */}
      {YEARS.map((year) => {
        const yearTotal = records.filter((r) => parseISO(r.id).getFullYear() === year).length;
        if (year > new Date().getFullYear() && yearTotal === 0) return null;
        return (
          <div key={year} className="mx-5 mb-4 bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-forest-700">{year}년</p>
              <p className="text-xs text-gray-400">{yearTotal}회</p>
            </div>
            <div className="flex flex-col gap-2">
              {MONTHS.map((label, m) => {
                const count = countByYearMonth(year, m);
                const barWidth = count === 0 ? 0 : Math.max((count / maxCount) * 100, 8);
                return (
                  <div key={m} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-6 flex-shrink-0">{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      {count > 0 && (
                        <div
                          className="h-full rounded-full bg-forest-200 flex items-center justify-end pr-1.5 transition-all"
                          style={{ width: `${barWidth}%` }}
                        >
                          <span style={{ fontSize: "10px" }} className="text-forest-800 font-medium">{count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
