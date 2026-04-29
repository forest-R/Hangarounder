export type CampingRecord = {
  id: string;           // "yyyy-MM-dd"
  endDate?: string;     // 멀티데이면 마지막 날 "yyyy-MM-dd"
  title: string;        // 캠핑장 이름
  location: string;     // 상세 위치
  weather?: string;
  memos: Record<string, string>;  // { "yyyy-MM-dd": "메모내용" }
  checkedItems: string[];          // 장비 체크
  createdAt: number;
};

export type EquipmentCategory = {
  id: string;
  name: string;
  order: number;
};

export type EquipmentItem = {
  id: string;
  categoryId: string;
  name: string;
  order: number;
};

export type LedgerEntry = {
  id: string;
  date: string;          // "yyyy-MM-dd"
  category: "캠핑장" | "식비" | "교통" | "장비" | "기타";
  description: string;
  amount: number;
  recordId?: string;     // 연결된 캠핑 기록 id (선택)
};
