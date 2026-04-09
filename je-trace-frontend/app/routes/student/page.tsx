import { BookOpen, Clock3, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";

type TaskItem = {
  id: number;
  title: string;
  submitted: boolean;
};

export default function StudentPage() {
  const studentName = typeof window !== "undefined" ? localStorage.getItem("studentName") ?? "" : "";
  const className = typeof window !== "undefined" ? localStorage.getItem("studentClassName") ?? "" : "";

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentName) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await api.get("/student/tasks", {
          params: { studentName },
        });
        setTasks(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [studentName]);

  const summary = useMemo(() => {
    const submitted = tasks.filter((task) => task.submitted).length;
    const pending = tasks.length - submitted;
    return { submitted, pending };
  }, [tasks]);

  const recentTask = tasks[0];

  const cards = [
    {
      title: "과제 목록",
      desc: "진행 중인 과제와 제출 상태를 확인합니다.",
      icon: <MessageCircle className="h-8 w-8" />,
      path: "/student/assignments",
    },
    {
      title: "회원가입",
      desc: "학생 계정을 새로 생성합니다.",
      icon: <BookOpen className="h-8 w-8" />,
      path: "/signup/student",
    },
    {
      title: "로그인",
      desc: "학생 계정으로 로그인합니다.",
      icon: <Clock3 className="h-8 w-8" />,
      path: "/login/student",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-7">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            STUDENT MODE
          </p>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">학생 대시보드</h1>

          <p className="mt-3 text-slate-500">
            {studentName
              ? `${studentName}${className ? ` · ${className}` : ""}`
              : "로그인 후 과제를 확인하세요."}
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              to="/"
              className="rounded-xl bg-white px-5 py-2.5 text-sm text-slate-600 shadow-sm hover:bg-slate-100"
            >
              홈으로
            </Link>
            {!studentName && (
              <Link
                to="/login/student"
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                학생 로그인
              </Link>
            )}
          </div>

          {!className && studentName && (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
              아직 교사 승인 전입니다. 승인되면 과제가 표시됩니다.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500">진행 중 과제</p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? "-" : summary.pending}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500">완료 과제</p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? "-" : summary.submitted}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500">최근 과제</p>
            <p className="text-sm font-medium text-slate-700">
              {recentTask ? recentTask.title : "표시할 과제가 없습니다."}
            </p>
          </div>
        </div>

        {recentTask && (
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">최근 학습</h2>

            <p className="text-sm text-slate-600">
              {recentTask.title} 과제를 이어서 진행할 수 있습니다.
            </p>

            <Link
              to={`/student/assignment/${recentTask.id}`}
              className="inline-block mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              이어서 학습 →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link to={card.path} key={card.title}>
              <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-3 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                  {card.icon}
                </div>

                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                  {card.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">{card.desc}</p>

                <div className="mt-4 text-sm text-slate-400 group-hover:text-blue-600">
                  이동하기 →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}