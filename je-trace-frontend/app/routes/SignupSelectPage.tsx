import { Link } from "react-router";

export default function SignupSelectPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 text-center">회원가입 선택</h1>

        <div className="mt-6 space-y-3">
          <Link
            to="/signup/student"
            className="block rounded-xl bg-slate-900 px-4 py-3 text-center text-white"
          >
            학생 회원가입
          </Link>

          <Link
            to="/"
            className="block rounded-xl bg-slate-100 px-4 py-3 text-center text-slate-700"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}