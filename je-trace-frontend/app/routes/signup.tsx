import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import api from "~/lib/axios";

const STUDENT_CLASS_OPTIONS = ["선택하세요", "A", "B", "C", "D"];
const TEACHER_CLASS_OPTIONS = ["A", "B", "C", "D"];

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = useMemo(() => {
    const value = searchParams.get("mode");
    return value === "TEACHER" ? "TEACHER" : "STUDENT";
  }, [searchParams]);

  const modeLabel = mode === "TEACHER" ? "교사" : "학생";

  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [className, setClassName] = useState("선택하세요");
  const [subject, setSubject] = useState("");
  const [managedClasses, setManagedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleManagedClass = (value: string) => {
    setManagedClasses((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

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

    if (mode === "STUDENT" && className === "선택하세요") {
      alert("반을 선택하세요.");
      return;
    }

    if (mode === "TEACHER" && !subject.trim()) {
      alert("담당 과목을 입력하세요.");
      return;
    }

    if (mode === "TEACHER" && managedClasses.length === 0) {
      alert("관리 반을 하나 이상 선택하세요.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        loginId,
        email,
        password,
        name,
        role: mode,
        className: mode === "STUDENT" ? className : null,
        subject: mode === "TEACHER" ? subject : null,
        managedClasses: mode === "TEACHER" ? managedClasses.join(",") : null,
      });

      if (mode === "TEACHER") {
        alert("교사 회원가입 완료. 관리자 승인 후 로그인 가능합니다.");
      } else {
        alert("회원가입 완료");
      }

      navigate(`/auth?mode=${mode}`);
    } catch (error: any) {
      console.error(error);
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none"
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none"
                >
                  {STUDENT_CLASS_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "선택하세요"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mode === "TEACHER" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    담당 과목
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none"
                    placeholder="담당 과목 입력"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    관리 반
                  </label>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {TEACHER_CLASS_OPTIONS.map((option) => {
                      const checked = managedClasses.includes(option);

                      return (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition ${checked
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white text-slate-800"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleManagedClass(option)}
                            className="hidden"
                          />
                          {option}반
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
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