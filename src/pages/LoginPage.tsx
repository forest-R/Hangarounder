import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function LoginPage() {
  const login = () => signInWithPopup(auth, googleProvider);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-forest-50 gap-8 px-8">
      <div className="text-center">
        <img
          src="/icons/icon-512.png"
          alt="Hangarounder"
          className="w-40 h-40 mx-auto mb-4 object-contain"
        />
        <h1 className="text-3xl font-medium text-forest-800 tracking-tight">Hangarounder</h1>
        <p className="text-forest-600 mt-2 text-sm">포레스트 & 플로우 기록지</p>
      </div>
      <button
        onClick={login}
        className="w-full max-w-xs flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-3.5 text-sm font-medium text-gray-700 shadow-sm active:scale-95 transition-transform"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          className="w-5 h-5"
          alt=""
        />
        Google로 로그인
      </button>
    </div>
  );
}
