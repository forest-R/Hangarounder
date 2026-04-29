export type CampingRecord = {
  id: string;
  endDate?: string;
  title: string;
  location: string;
  weather?: string;
  tempLow?: number;
  tempHigh?: number;
  memos: Record<string, string>;
  checkedItems: string[];
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
  date: string;
  category: "캠핑장" | "식비" | "교통" | "장비" | "기타";
  description: string;
  amount: number;
  recordId?: string;
};
