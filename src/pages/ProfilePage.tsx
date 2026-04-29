import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { User } from "firebase/auth";

export default function ProfilePage({ user }: { user: User }) {
  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-medium text-forest-800">프로필</h1>
      </div>
      <div className="px-5 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
          {user.photoURL && (
            <img src={user.photoURL} className="w-10 h-10 rounded-full" alt="" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-800">{user.displayName}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="bg-white border border-gray-200 text-gray-500 rounded-2xl py-3 text-sm active:bg-gray-50"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
