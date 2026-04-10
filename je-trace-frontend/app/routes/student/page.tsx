import {
  BookOpen,
  ClipboardList,
  LogOut,
  UserCircle,
  Sparkles,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";

type RecentLog = {
  id: number;
  taskId: number;
  studentName: string;
  question: string;
  answer: string;
  createdAt: string;
  status: string;
};

type MyPageSummary = {
  submittedCount: number;
  notSubmittedCount: number;
  recentLogs: RecentLog[];
};

export default function HomePage() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginRole, setLoginRole] = useState("");
  const [className, setClassName] = useState("");
  const [summary, setSummary] = useState<MyPageSummary>({
    submittedCount: 0,
    notSubmittedCount: 0,
    recentLogs: [],
  });
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    setLoginId(localStorage.getItem("loginId") ?? "");
    setLoginName(localStorage.getItem("loginName") ?? "");
    setLoginRole(localStorage.getItem("loginRole") ?? "");
    setClassName(localStorage.getItem("className") ?? "");
  }, []);

  const isLoggedIn = useMemo(() => {
    return !!loginId && loginRole === "STUDENT";
  }, [loginId, loginRole]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!loginId || loginRole !== "STUDENT") {
        setSummary({
          submittedCount: 0,
          notSubmittedCount: 0,
          recentLogs: [],
        });
        return;
      }

      try {
        setSummaryLoading(true);
        const res = await api.get("/student/tasks/summary", {
          params: { loginId },
        });

        setSummary({
          submittedCount: res.data?.submittedCount ?? 0,
          notSubmittedCount: res.data?.notSubmittedCount ?? 0,
          recentLogs: res.data?.recentLogs ?? [],
        });
      } catch (error) {
        console.error(error);
        setSummary({
          submittedCount: 0,
          notSubmittedCount: 0,
          recentLogs: [],
        });
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-[#f8fafc] to-blue-50 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="relative px-6 py-8 md:px-10 md:py-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-slate-200/70 blur-3xl" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  <Sparkles size={16} />
                  STUDENT MY PAGE
                </div>

                <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                  학생 마이페이지
                </h1>

                <p className="mt-4 text-sm leading-7 text-slate-600 md:text-lg">
                  내 정보, 과제 제출 현황, 최근 학습 기록을 한눈에 확인할 수
                  있습니다.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                    <GraduationCap size={16} />
                    학습 관리
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                    <ClipboardList size={16} />
                    제출 현황 확인
                  </div>
                </div>
              </div>

              <div className="relative">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    <LogOut size={18} />
                    로그아웃
                  </button>
                ) : (
                  <Link
                    to="/auth?mode=STUDENT"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    로그인하러 가기
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 text-slate-700 ring-1 ring-slate-200">
                <UserCircle size={30} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  MY PROFILE
                </p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  프로필
                </h2>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="mt-7 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                  <p className="text-sm font-semibold text-slate-400">이름</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {loginName || "-"}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                  <p className="text-sm font-semibold text-slate-400">아이디</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {loginId || "-"}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                  <p className="text-sm font-semibold text-slate-400">반</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {className || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-7 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="text-sm leading-6 text-slate-600">
                  로그인 후 학생 정보가 표시됩니다.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 text-slate-700 ring-1 ring-slate-200">
                <ClipboardList size={28} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  TASK & LEARNING
                </p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  과제 / 학습 메뉴
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              과제 목록 조회와 최근 학습 기록, 제출 현황을 확인할 수 있습니다.
            </p>

            <div className="mt-7">
              <Link
                to="/student/assignments"
                className="group relative block overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-1"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 right-0 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                        <BookOpen size={22} />
                      </div>
                      <span className="text-xl font-bold">과제 목록 조회</span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-200">
                      현재 반에 해당하는 과제를 확인하고 학습을 이어갈 수
                      있습니다.
                    </p>
                  </div>

                  <div className="mt-1 text-white/80 transition group-hover:translate-x-1">
                    <ChevronRight size={22} />
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-900">학습 안내</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                  SUMMARY
                </span>
              </div>

              {!isLoggedIn ? (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  로그인 후 최근 학습 기록과 제출 현황이 표시됩니다.
                </p>
              ) : summaryLoading ? (
                <div className="mt-4 rounded-2xl bg-white px-4 py-5 text-sm text-slate-600 ring-1 ring-slate-200">
                  불러오는 중...
                </div>
              ) : (
                <div className="mt-5 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                      <p className="text-sm font-semibold text-slate-400">
                        제출 완료 개수
                      </p>
                      <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                        {summary.submittedCount}
                        <span className="ml-1 text-xl font-bold text-blue-600">
                          개
                        </span>
                      </p>
                    </div>

                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                      <p className="text-sm font-semibold text-slate-400">
                        미제출 과제 수
                      </p>
                      <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                        {summary.notSubmittedCount}
                        <span className="ml-1 text-xl font-bold text-rose-500">
                          개
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-700">
                        최근 학습 기록
                      </p>
                    </div>

                    {summary.recentLogs.length === 0 ? (
                      <div className="rounded-3xl bg-white px-5 py-5 text-sm text-slate-500 ring-1 ring-slate-200">
                        아직 학습 기록이 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {summary.recentLogs.map((log) => (
                          <div
                            key={log.id}
                            className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                          >
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                              <p className="pr-0 text-base font-bold leading-7 text-slate-900 md:pr-6">
                                {log.question}
                              </p>
                              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                {log.createdAt || "-"}
                              </span>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-2">
                              {log.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}