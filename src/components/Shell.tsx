type Tab = "calendar" | "record" | "equipment" | "ledger" | "profile";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "calendar", label: "캘린더", icon: "📅" },
  { id: "record",   label: "기록",   icon: "📝" },
  { id: "equipment",label: "장비",   icon: "🎒" },
  { id: "ledger",   label: "가계부", icon: "💰" },
  { id: "profile",  label: "프로필", icon: "👤" },
];

export default function Shell({
  children, tab, setTab
}: {
  children: React.ReactNode;
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  return (
    <div className="flex flex-col h-dvh max-w-md mx-auto bg-forest-50">
      <main className="flex-1 overflow-y-auto">{children}</main>
      <nav className="flex border-t border-gray-200 bg-white pb-safe">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
              tab === t.id ? "text-forest-800" : "text-gray-400"
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            <span className="font-medium">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
