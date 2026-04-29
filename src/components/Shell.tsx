import { Tab } from "../App";

const tabs: { id: Tab; label: string }[] = [
  { id: "calendar",  label: "캘린더" },
  { id: "record",    label: "기록" },
  { id: "equipment", label: "장비" },
  { id: "ledger",    label: "가계부" },
  { id: "profile",   label: "프로필" },
];

export default function Shell({
  children,
  tab,
  setTab,
}: {
  children: React.ReactNode;
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  return (
    <div className="flex flex-col h-dvh max-w-md mx-auto bg-forest-50">
      <main className="flex-1 overflow-y-auto">{children}</main>
      <nav className="flex border-t border-gray-200 bg-white">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
            className={`flex-1 flex flex-col items-center pt-2 pb-2 text-xs transition-colors ${
              tab === t.id ? "text-forest-800 font-medium" : "text-gray-400"
            }`}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
