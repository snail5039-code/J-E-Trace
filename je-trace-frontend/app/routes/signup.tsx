import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import api from "~/lib/axios";

const STUDENT_CLASS_OPTIONS = [
  "1학년 1반",
  "1학년 2반",
  "1학년 3반",
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = useMemo(() => {
    const value = searchParams.get("mode");
    return value === "TEACHER" ? "TEACHER" : "STUDENT";
  }, [searchParams]);

  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [className, setClassName] = useState(STUDENT_CLASS_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  const modeLabel = mode === "TEACHER" ? "교사" : "학생";

  const handleSignup = async () => {
    if (!loginId.trim()) {
      alert("아이디를 입력하세요.");
      return;
    }

    if (!email.trim()) {
      alert("이메일을 입력하세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const payload =
        mode === "TEACHER"
          ? {
              loginId,
              email,
              password,
              name,
              role: "TEACHER",
            }
          : {
              loginId,
              email,
              password,
              name,
              role: "STUDENT",
              className,
            };

      await api.post("/auth/signup", payload);

      if (mode === "TEACHER") {
        alert("교사 회원가입이 완료되었습니다. 관리자 승인 후 로그인할 수 있습니다.");
      } else {
        alert("학생 회원가입이 완료되었습니다.");
      }

      navigate(`/auth?mode=${mode}`);
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      alert(error?.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[28px] border-4 border-slate-900 bg-white p-8">
          <h1 className="text-4xl font-extrabold text-slate-900">
            {modeLabel} 회원가입
          </h1>
          <p className="mt-3 text-slate-500">
            {modeLabel} 계정을 생성하세요.
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
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                placeholder="이메일 입력"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                placeholder="비밀번호 입력"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                이름
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                placeholder="이름 입력"
              />
            </div>

            {mode === "STUDENT" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  반
                </label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none"
                >
                  {STUDENT_CLASS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-5 py-3 text-white disabled:opacity-60"
            >
              {loading ? "처리 중..." : "회원가입"}
            </button>

            <div className="flex gap-3">
              <Link
                to={`/auth?mode=${mode}`}
                className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800"
              >
                로그인으로
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