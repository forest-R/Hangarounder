import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function LoginPage() {
  const login = () => signInWithPopup(auth, googleProvider);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-forest-50 gap-6 px-8">
      <div className="text-center">
        <img
          src="/icons/icon-512.png"
          alt="Hangarounder"
          className="w-64 h-64 mx-auto mb-4 object-contain"
        />
        <p className="text-forest-800 text-base font-medium">포레스트 & 플로우 기록지</p>
      </div>
      <button
        onClick={login}
        className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-2.5 text-xs font-medium text-gray-500 shadow-sm active:scale-95 transition-transform"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          className="w-4 h-4"
          alt=""
        />
        Google로 로그인
      </button>
    </div>
  );
}
