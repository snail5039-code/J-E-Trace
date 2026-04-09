import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import api from "~/lib/axios";

type LoginResponse = {
  success: boolean;
  message: string;
  loginId: string | null;
  name: string | null;
  role: string | null;
  approved: boolean;
  className: string | null;
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = useMemo(() => {
    const value = searchParams.get("mode");
    return value === "TEACHER" ? "TEACHER" : "STUDENT";
  }, [searchParams]);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const modeLabel = mode === "TEACHER" ? "교사" : "학생";

  const handleLogin = async () => {
    if (!loginId.trim()) {
      alert("아이디를 입력하세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<LoginResponse>("/auth/login", {
        loginId,
        password,
      });

      const data = response.data;

      if (!data.success) {
        alert(data.message || "로그인에 실패했습니다.");
        return;
      }

      if (data.role !== mode) {
        alert(`${modeLabel} 계정이 아닙니다.`);
        return;
      }

      localStorage.setItem("loginId", data.loginId ?? "");
      localStorage.setItem("loginName", data.name ?? "");
      localStorage.setItem("loginRole", data.role ?? "");
      localStorage.setItem("className", data.className ?? "");

      if (data.role === "TEACHER") {
        navigate("/teacher");
      } else {
        navigate("/student/assignments");
      }
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[28px] border-4 border-slate-900 bg-white p-8">
          <h1 className="text-4xl font-extrabold text-slate-900">
            {modeLabel} 로그인
          </h1>
          <p className="mt-3 text-slate-500">
            {modeLabel} 계정으로 로그인하세요.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                아이디
              </label>
              <input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                placeholder="아이디 입력"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                placeholder="비밀번호 입력"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-5 py-3 text-white disabled:opacity-60"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <div className="flex gap-3">
              <Link
                to={mode === "STUDENT" ? "/signup?mode=STUDENT" : "/signup?mode=TEACHER"}
                className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800"
              >
                회원가입
              </Link>
              <Link
                to="/"
                className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}