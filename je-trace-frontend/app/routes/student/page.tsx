import { BookOpen, ClipboardList, LogOut, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginRole, setLoginRole] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => {
    setLoginId(localStorage.getItem("loginId") ?? "");
    setLoginName(localStorage.getItem("loginName") ?? "");
    setLoginRole(localStorage.getItem("loginRole") ?? "");
    setClassName(localStorage.getItem("className") ?? "");
  }, []);

  const isLoggedIn = useMemo(() => {
    return !!loginId && loginRole === "STUDENT";
  }, [loginId, loginRole]);

  const handleLogout = () => {
    localStorage.removeItem("loginId");
    localStorage.removeItem("loginName");
    localStorage.removeItem("loginRole");
    localStorage.removeItem("className");

    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-200 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[32px] border-4 border-slate-900 bg-white px-8 py-10">
          <p className="inline-block rounded-full border border-slate-300 px-4 py-1 text-sm font-semibold tracking-[0.3em] text-slate-500">
            STUDENT MY PAGE
          </p>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">
                학생 마이페이지
              </h1>
              <p className="mt-3 text-lg text-slate-500">
                내 정보와 과제, 학습 기록을 확인할 수 있습니다.
              </p>
            </div>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white"
              >
                <LogOut size={18} />
                로그아웃
              </button>
            ) : (
              <Link
                to="/auth?mode=STUDENT"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-white"
              >
                로그인하러 가기
              </Link>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border-4 border-slate-900 bg-white p-8 md:col-span-1">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 text-slate-600">
              <UserCircle size={32} />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">프로필</h2>

            {isLoggedIn ? (
              <div className="mt-6 space-y-4 text-slate-700">
                <div className="rounded-2xl bg-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-500">이름</p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {loginName || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-500">아이디</p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {loginId || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-500">반</p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {className || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-slate-100 px-4 py-5">
                <p className="text-slate-600">
                  로그인 후 학생 정보가 표시됩니다.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border-4 border-slate-900 bg-white p-8 md:col-span-2">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 text-slate-600">
              <ClipboardList size={32} />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              과제 / 학습 메뉴
            </h2>
            <p className="mt-3 text-slate-500">
              과제 목록 조회, 제출 내역 확인, 학습 기록 확인이 가능합니다.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Link
                to="/student/assignments"
                className="rounded-2xl bg-slate-900 px-5 py-5 text-white"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={22} />
                  <span className="text-lg font-bold">과제 목록 조회</span>
                </div>
                <p className="mt-3 text-sm text-slate-200">
                  현재 반에 해당하는 과제를 확인합니다.
                </p>
              </Link>

              <Link
                to="/student/assignments"
                className="rounded-2xl bg-slate-100 px-5 py-5 text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <ClipboardList size={22} />
                  <span className="text-lg font-bold">내 제출 현황</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  제출한 과제와 진행 중인 과제를 확인합니다.
                </p>
              </Link>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-300 bg-slate-50 px-5 py-5">
              <h3 className="text-lg font-bold text-slate-900">안내</h3>
              <p className="mt-2 text-slate-600">
                추후 여기에서 최근 학습 기록, 제출 완료 개수, 미제출 과제 수도
                함께 보여줄 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}