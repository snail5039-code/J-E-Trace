import {
  BookOpen,
  ClipboardList,
  LogOut,
  UserCircle,
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
              과제 목록 조회와 최근 학습 기록, 제출 현황 확인이 가능합니다.
            </p>

            <div className="mt-8">
              <Link
                to="/student/assignments"
                className="block rounded-2xl bg-slate-900 px-5 py-5 text-white"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={22} />
                  <span className="text-lg font-bold">과제 목록 조회</span>
                </div>
                <p className="mt-3 text-sm text-slate-200">
                  현재 반에 해당하는 과제를 확인합니다.
                </p>
              </Link>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-300 bg-slate-50 px-5 py-5">
              <h3 className="text-lg font-bold text-slate-900">안내</h3>

              {!isLoggedIn ? (
                <p className="mt-2 text-slate-600">
                  로그인 후 최근 학습 기록과 제출 현황이 표시됩니다.
                </p>
              ) : summaryLoading ? (
                <p className="mt-2 text-slate-600">불러오는 중...</p>
              ) : (
                <div className="mt-4 space-y-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white px-4 py-4">
                      <p className="text-sm font-semibold text-slate-500">
                        제출 완료 개수
                      </p>
                      <p className="mt-2 text-2xl font-extrabold text-slate-900">
                        {summary.submittedCount}개
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-4">
                      <p className="text-sm font-semibold text-slate-500">
                        미제출 과제 수
                      </p>
                      <p className="mt-2 text-2xl font-extrabold text-slate-900">
                        {summary.notSubmittedCount}개
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      최근 학습 기록
                    </p>

                    {summary.recentLogs.length === 0 ? (
                      <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-sm text-slate-500">
                        아직 학습 기록이 없습니다.
                      </div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {summary.recentLogs.map((log) => (
                          <div
                            key={log.id}
                            className="rounded-2xl bg-white px-4 py-4"
                          >
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                              <p className="font-semibold text-slate-900">
                                {log.question}
                              </p>
                              <span className="text-xs text-slate-500">
                                {log.createdAt || "-"}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600 line-clamp-2">
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