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
        <h1 className="text-xl font-medium text-forest-800">E Q U I P  L I S T</h1>
       // <p className="text-sm text-gray-400 mt-1">카테고리별로 장비를 관리해요</p>
      </div>

      <div className="px-5 flex gap-2 my-3">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="새 카테고리"
          style={{ fontSize: "13px" }}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 outline-none placeholder-gray-300 bg-white text-gray-700"
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
                <p style={{ fontSize: "13px" }} className="font-medium text-forest-700">{cat.name}</p>
                <button
                  onClick={() => deleteDoc(doc(db, "categories", cat.id))}
                  style={{ fontSize: "13px" }}
                  className="text-gray-300 active:text-red-400"
                >삭제</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1 bg-forest-50 px-3 py-1 rounded-full"
                  >
                    <span style={{ fontSize: "13px" }} className="text-forest-700">{item.name}</span>
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
                  style={{ fontSize: "13px" }}
                  className="flex-1 border border-gray-100 rounded-xl px-3 py-1.5 outline-none placeholder-gray-300 bg-forest-50 text-gray-700"
                />
                <button
                  onClick={() => addItem(cat.id)}
                  style={{ fontSize: "13px" }}
                  className="text-forest-600 px-2 active:text-forest-800"
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
