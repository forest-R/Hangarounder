import { Tab } from "../App";

function IconCalendar({ active }: { active: boolean }) {
  const c = active ? "#3B6D11" : "#9ca3af";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function IconRecord({ active }: { active: boolean }) {
  const c = active ? "#3B6D11" : "#9ca3af";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="12" y2="17"/>
    </svg>
  );
}

function IconGear({ active }: { active: boolean }) {
  const c = active ? "#3B6D11" : "#9ca3af";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function IconLedger({ active }: { active: boolean }) {
  const c = active ? "#3B6D11" : "#9ca3af";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

function IconProfile({ active }: { active: boolean }) {
  const c = active ? "#3B6D11" : "#9ca3af";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

const tabs: { id: Tab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
  { id: "calendar",  label: "캘린더", Icon: IconCalendar },
  { id: "record",    label: "기록",   Icon: IconRecord },
  { id: "equipment", label: "장비",   Icon: IconGear },
  { id: "ledger",    label: "가계부", Icon: IconLedger },
  { id: "profile",   label: "프로필", Icon: IconProfile },
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
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
            className={`flex-1 flex flex-col items-center gap-0.5 pt-2 text-xs transition-colors ${
              tab === id ? "text-forest-800 font-medium" : "text-gray-400"
            }`}
          >
            <Icon active={tab === id} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
