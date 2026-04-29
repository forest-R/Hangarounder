import { useState } from "react";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { EquipmentCategory, EquipmentItem } from "../types";

export default function EquipmentPage({
  categories,
  items,
}: {
  categories: EquipmentCategory[];
  items: EquipmentItem[];
}) {
  const [newCat, setNewCat] = useState("");
  const [newItem, setNewItem] = useState<Record<string, string>>({});

  const addCategory = async () => {
    if (!newCat.trim()) return;
    await addDoc(collection(db, "categories"), {
      name: newCat.trim(),
      order: categories.length,
    });
    setNewCat("");
  };

  const addItem = async (catId: string) => {
    const name = newItem[catId]?.trim();
    if (!name) return;
    await addDoc(collection(db, "items"), {
      categoryId: catId,
      name,
      order: items.filter((i) => i.categoryId === catId).length,
    });
    setNewItem((prev) => ({ ...prev, [catId]: "" }));
  };

  const sortedCats = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-medium text-forest-800">캠핑 장비 목록</h1>
        <p className="text-sm text-gray-400 mt-1">카테고리별로 장비를 관리해요</p>
      </div>

      <div className="px-5 flex gap-2 my-3">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="새 카테고리"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none placeholder-gray-300 bg-white"
        />
        <button
          onClick={addCategory}
          className="bg-forest-600 text-white px-4 rounded-xl text-sm active:bg-forest-800"
        >추가</button>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {sortedCats.map((cat) => {
          const catItems = items
            .filter((i) => i.categoryId === cat.id)
            .sort((a, b) => a.order - b.order);
          return (
            <div key={cat.id} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-forest-700">{cat.name}</p>
                <button
                  onClick={() => deleteDoc(doc(db, "categories", cat.id))}
                  className="text-gray-300 text-xs active:text-red-400"
                >삭제</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1 bg-forest-50 px-3 py-1 rounded-full"
                  >
                    <span className="text-xs text-forest-700">{item.name}</span>
                    <button
                      onClick={() => deleteDoc(doc(db, "items", item.id))}
                      className="text-gray-300 text-xs active:text-red-400 ml-1"
                    >✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newItem[cat.id] ?? ""}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, [cat.id]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addItem(cat.id)}
                  placeholder="장비 추가"
                  className="flex-1 border border-gray-100 rounded-xl px-3 py-1.5 text-xs outline-none placeholder-gray-300 bg-forest-50"
                />
                <button
                  onClick={() => addItem(cat.id)}
                  className="text-forest-600 text-xs px-2 active:text-forest-800"
                >추가</button>
              </div>
            </div>
          );
        })}

        {sortedCats.length === 0 && (
          <div className="flex flex-col items-center py-16 text-gray-300">
            <div className="text-5xl mb-3">🎒</div>
            <p className="text-sm">카테고리를 추가해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
