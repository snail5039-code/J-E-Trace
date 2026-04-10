import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../lib/axios";

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  submitted: boolean;
  aiAllowed: boolean;
  score: number | null;
};

export default function AssignmentsPage() {
  const navigate = useNavigate();

  const loginId = typeof window !== "undefined" ? localStorage.getItem("loginId") ?? "" : "";
  const loginRole = typeof window !== "undefined" ? localStorage.getItem("loginRole") ?? "" : "";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loginId) {
      alert("로그인이 필요합니다.");
      navigate("/auth?mode=STUDENT");
      return;
    }

    if (loginRole !== "STUDENT") {
      alert("학생 계정만 접근할 수 있습니다.");
      navigate("/");
      return;
    }
  }, [loginId, loginRole, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!loginId || loginRole !== "STUDENT") {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/student/tasks", {
          params: { loginId },
        });
        setTasks(res.data);
      } catch (error) {
        console.error(error);
        alert("과제 목록 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [loginId, loginRole]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">과제 목록</h1>
            <p className="text-slate-500 mt-2">진행 중인 과제를 확인하고 제출 상태를 관리하세요.</p>
          </div>

          <Link
            to="/student"
            className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            학생 페이지
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
            불러오는 중...
          </div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {tasks.map((task) => {
              const dueTime = new Date(task.dueDate).getTime();
              const isUrgent = dueTime - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;

              return (
                <Link key={task.id} to={`/student/assignment/${task.id}`}>
                  <div className="group h-full rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-medium text-slate-400">과제</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${task.submitted
                            ? "bg-green-100 text-green-600"
                            : isUrgent
                              ? "bg-red-100 text-red-500"
                              : "bg-blue-100 text-blue-500"
                          }`}
                      >
                        {task.submitted ? "제출 완료" : isUrgent ? "마감 임박" : "진행 중"}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900">{task.title}</h2>
                    <div className="mt-2 text-sm text-slate-500">
                      점수: {task.score == null ? "미입력" : `${task.score}점`}
                    </div>

                    <div className="mt-6 flex justify-between items-center text-sm">
                      <span className="text-slate-400">마감일</span>
                      <span className="font-medium text-slate-700">{task.dueDate}</span>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      AI 사용: {task.aiAllowed ? "허용" : "금지"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}