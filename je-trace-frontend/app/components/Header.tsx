import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-blue-600"
        >
          JETRACE
        </Link>

        {/* ✅ 회원가입 버튼 */}
        <Link
          to="/signup"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          회원가입
        </Link>

      </div>
    </header>
  );
}