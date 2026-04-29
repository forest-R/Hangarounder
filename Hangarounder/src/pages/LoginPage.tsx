import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function LoginPage() {
  const login = () => signInWithPopup(auth, googleProvider);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-forest-50 gap-8 px-8">
      <div className="text-center">
        <div className="text-7xl mb-5">⛺</div>
        <h1 className="text-3xl font-medium text-forest-800 tracking-tight">Hangarounder</h1>
        <p className="text-forest-600 mt-2 text-sm">우리만의 캠핑 기록</p>
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
