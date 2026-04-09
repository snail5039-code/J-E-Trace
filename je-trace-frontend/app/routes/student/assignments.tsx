import { Link } from "react-router";
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
};

export default function AssignmentsPage() {
  const studentName = typeof window !== "undefined" ? localStorage.getItem("studentName") ?? "" : "";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!studentName) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/student/tasks", {
          params: { studentName },
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
  }, [studentName]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">과제 목록</h1>
            <p className="text-slate-500 mt-2">
              진행 중인 과제를 확인하고 제출 상태를 관리하세요.
            </p>
          </div>

          <Link
            to="/student"
            className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-blue-600 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            학생 페이지
          </Link>
        </div>

        {!studentName && (
          <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
            먼저 학생 로그인부터 해라.
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
            불러오는 중...
          </div>
        )}

        {!loading && studentName && (
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
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.submitted
                            ? "bg-green-100 text-green-600"
                            : isUrgent
                            ? "bg-red-100 text-red-500"
                            : "bg-blue-100 text-blue-500"
                        }`}
                      >
                        {task.submitted ? "제출 완료" : isUrgent ? "마감 임박" : "진행 중"}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition">
                      {task.title}
                    </h2>

                    <p className="mt-3 text-sm text-slate-500 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="mt-6 flex justify-between items-center text-sm">
                      <span className="text-slate-400">마감일</span>
                      <span className="font-medium text-slate-700">
                        {task.dueDate}
                      </span>
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