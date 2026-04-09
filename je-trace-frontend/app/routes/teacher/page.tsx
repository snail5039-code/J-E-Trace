import { ClipboardList, Search, Sparkles, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type Task = {
  id: number;
  title: string;
  className: string;
  description: string;
  dueDate: string;
  aiAllowed: boolean;
  createdAt: string;

  totalStudentCount: number;
  submittedCount: number;
  notSubmittedCount: number;
};

export default function TeacherPage() {
  const navigate = useNavigate();
  const loginId =
    typeof window !== "undefined" ? localStorage.getItem("loginId") ?? "" : "";
  const loginRole =
    typeof window !== "undefined" ? localStorage.getItem("loginRole") ?? "" : "";

  useEffect(() => {
    if (!loginId) {
      alert("로그인이 필요합니다.");
      navigate("/auth?mode=TEACHER");
      return;
    }

    if (loginRole !== "TEACHER") {
      alert("교사 계정만 접근할 수 있습니다.");
      navigate("/");
      return;
    }
  }, [loginId, loginRole, navigate]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/teacher/tasks");
        setTasks(response.data ?? []);
      } catch (error) {
        console.error("과제 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const totalTaskCount = tasks.length;
  const aiAllowedTaskCount = tasks.filter((task) => task.aiAllowed).length;

  const totalSubmittedCount = useMemo(() => {
    return tasks.reduce((sum, task) => sum + (task.submittedCount ?? 0), 0);
  }, [tasks]);

  const totalNotSubmittedCount = useMemo(() => {
    return tasks.reduce((sum, task) => sum + (task.notSubmittedCount ?? 0), 0);
  }, [tasks]);

  const taskRows = useMemo(() => {
    return tasks.map((task) => {
      const totalStudentCount = task.totalStudentCount ?? 0;
      const submittedCount = task.submittedCount ?? 0;
      const notSubmittedCount = task.notSubmittedCount ?? 0;

      return {
        ...task,
        deadlineText: task.dueDate ? String(task.dueDate).slice(0, 10) : "-",
        submissionText: `${submittedCount} / ${totalStudentCount}`,
        submissionRateText:
          totalStudentCount > 0
            ? `${submittedCount} / ${totalStudentCount} (${Math.round(
              (submittedCount / totalStudentCount) * 100
            )}%)`
            : "-",
        statusText: notSubmittedCount === 0 ? "제출 완료" : "진행 중",
        statusClass:
          notSubmittedCount === 0
            ? "inline-block rounded-sm bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
            : "inline-block rounded-sm bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",
      };
    });
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#eef1f5] text-slate-800">
      <div className="border-b border-slate-300 bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">교사용 관리 시스템</p>
            <h1 className="mt-1 text-2xl font-bold">과제 관리 대시보드</h1>
          </div>

          <button
            onClick={() => navigate("/teacher/create-task")}
            className="rounded-sm bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            과제 등록
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-sm border border-slate-300 bg-[#4a4a4a] text-white shadow-sm">
            <div className="border-b border-white/10 px-5 py-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-sm bg-slate-200 text-2xl font-bold text-slate-700">
                T
              </div>
              <p className="mt-4 text-lg font-semibold">박의혁</p>
              <p className="mt-1 text-sm text-white/70">정보처리 수업 담당</p>
            </div>

            <div className="space-y-2 px-3 py-4">
              <button className="flex w-full items-center gap-3 rounded-sm bg-white/10 px-4 py-3 text-left text-sm font-medium text-white">
                <ClipboardList size={18} />
                과제 관리
              </button>

              <button
                onClick={() => navigate("/teacher/logs")}
                className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <Sparkles size={18} />
                AI 로그 확인
              </button>

              <button
                onClick={() => navigate("/teacher/similarity")}
                className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <Search size={18} />
                유사도 분석
              </button>

              <button
                onClick={() => navigate("/teacher/students")}
                className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <UserRound size={18} />
                학생 관리
              </button>
            </div>
          </aside>

          <main className="space-y-5">
            <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">담당 수업 정보</h2>
              </div>

              <div className="grid grid-cols-2 border-t border-slate-200 md:grid-cols-4">
                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600">
                  담당 교사
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm text-slate-800">
                  박의혁
                </div>
                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600">
                  학기
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm text-slate-800">
                  2026년 1학기
                </div>

                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600">
                  담당 과목
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm text-slate-800">
                  국어 / 영어 / 사회
                </div>
                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600">
                  관리 반
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm text-slate-800">
                  1학년 2반, 1학년 3반, 2학년 1반, 2학년 2반
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#f7f2c8] px-4 py-3 text-sm font-semibold">
                  전체 과제 수
                </div>
                <div className="px-4 py-5 text-2xl font-bold text-slate-900">
                  {loading ? "-" : `${totalTaskCount}개`}
                </div>
              </div>

              <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#dff3ea] px-4 py-3 text-sm font-semibold">
                  누적 제출 수
                </div>
                <div className="px-4 py-5 text-2xl font-bold text-slate-900">
                  {loading ? "-" : `${totalSubmittedCount}건`}
                </div>
              </div>

              <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#fbe4e4] px-4 py-3 text-sm font-semibold">
                  미제출 수
                </div>
                <div className="px-4 py-5 text-2xl font-bold text-slate-900">
                  {loading ? "-" : `${totalNotSubmittedCount}건`}
                </div>
              </div>

              <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#e5ecff] px-4 py-3 text-sm font-semibold">
                  AI 허용 과제
                </div>
                <div className="px-4 py-5 text-2xl font-bold text-slate-900">
                  {loading ? "-" : `${aiAllowedTaskCount}개`}
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-300 bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">과제 목록</h2>

                <button
                  onClick={() => navigate("/teacher/create-task")}
                  className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  새 과제 등록
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                        과제명
                      </th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                        반
                      </th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                        마감일
                      </th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                        AI 허용
                      </th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                        제출 현황
                      </th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                        상태
                      </th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                        관리
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="border border-slate-300 px-4 py-8 text-center text-slate-500"
                        >
                          과제 목록 불러오는 중...
                        </td>
                      </tr>
                    ) : taskRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="border border-slate-300 px-4 py-8 text-center text-slate-500"
                        >
                          등록된 과제가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      taskRows.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-50">
                          <td className="border border-slate-300 px-4 py-4 text-center font-medium text-slate-900">
                            {task.title}
                          </td>

                          <td className="border border-slate-300 px-4 py-4 text-center text-slate-700">
                            {task.className}
                          </td>

                          <td className="border border-slate-300 px-4 py-4 text-center text-slate-700">
                            {task.deadlineText}
                          </td>

                          <td className="border border-slate-300 px-4 py-4 text-center">
                            <span
                              className={`inline-block rounded-sm px-3 py-1 text-xs font-semibold ${task.aiAllowed
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              {task.aiAllowed ? "허용" : "비허용"}
                            </span>
                          </td>

                          <td className="border border-slate-300 px-4 py-4 text-center text-slate-700">
                            {task.submissionRateText}
                          </td>

                          <td className="border border-slate-300 px-4 py-4 text-center">
                            <span className={task.statusClass}>{task.statusText}</span>
                          </td>

                          <td className="border border-slate-300 px-4 py-4 text-center">
                            <button
                              onClick={() => navigate(`/teacher/tasks/${task.id}`)}
                              className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              상세 보기
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}