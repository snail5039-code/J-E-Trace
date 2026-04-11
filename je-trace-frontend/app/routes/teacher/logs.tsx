import { ClipboardList, Search, Sparkles, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type Task = {
    id: number;
    title: string;
    className: string;
};

type TaskSubmission = {
    id: number;
    taskId: number;
    studentName: string;
    submitted: boolean;
    submittedAt: string | null;
    aiUsed: boolean;
    result: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

type AiLog = {
    id: number;
    taskId: number;
    studentName: string;
    question: string;
    answer: string;
    createdAt: string;
    status: "정상" | "주의";
};

export default function TeacherLogsPage() {
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
    const [students, setStudents] = useState<TaskSubmission[]>([]);
    const [logs, setLogs] = useState<AiLog[]>([]);

    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [selectedStudentName, setSelectedStudentName] = useState("");

    const [taskLoading, setTaskLoading] = useState(true);
    const [studentLoading, setStudentLoading] = useState(false);
    const [logLoading, setLogLoading] = useState(false);

    const [expandedQuestionIds, setExpandedQuestionIds] = useState<number[]>([]);
    const [expandedAnswerIds, setExpandedAnswerIds] = useState<number[]>([]);

    const [teacherName, setTeacherName] = useState(
        typeof window !== "undefined" ? localStorage.getItem("loginName") ?? "" : ""
    );
    const [teacherSubject, setTeacherSubject] = useState(
        typeof window !== "undefined" ? localStorage.getItem("subject") ?? "" : ""
    );
    useEffect(() => {
        const fetchTeacherProfile = async () => {
            if (!loginId || loginRole !== "TEACHER") return;

            try {
                const response = await axios.get("http://localhost:8080/teacher/profile", {
                    params: { loginId },
                });

                const data = response.data;
                setTeacherName(data?.name ?? "");
                setTeacherSubject(data?.subject ?? "");

                localStorage.setItem("loginName", data?.name ?? "");
                localStorage.setItem("subject", data?.subject ?? "");
            } catch (error) {
                console.error("교사 프로필 조회 실패:", error);
            }
        };

        fetchTeacherProfile();
    }, [loginId, loginRole]);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/teacher/tasks", {
                    params: { loginId },
                });
                setTasks(response.data);
            } catch (error) {
                console.error("과제 목록 조회 실패:", error);
            } finally {
                setTaskLoading(false);
            }
        };

        fetchTasks();
    }, [loginId]);

    useEffect(() => {
        if (!selectedTaskId) {
            setStudents([]);
            setSelectedStudentName("");
            setLogs([]);
            return;
        }

        const fetchStudents = async () => {
            setStudentLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/teacher/tasks/${selectedTaskId}/taskSubmissions`,
                    { params: { loginId } }
                );
                setStudents(response.data);
                setSelectedStudentName("");
                setLogs([]);
                setExpandedQuestionIds([]);
                setExpandedAnswerIds([]);
            } catch (error) {
                console.error("학생 목록 조회 실패:", error);
                setStudents([]);
            } finally {
                setStudentLoading(false);
            }
        };

        fetchStudents();
    }, [selectedTaskId, loginId]);

    useEffect(() => {
        if (!selectedTaskId || !selectedStudentName) {
            setLogs([]);
            return;
        }

        const fetchLogs = async () => {
            setLogLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/teacher/tasks/${selectedTaskId}/logs`,
                    {
                        params: {
                            loginId,
                            studentName: selectedStudentName,
                        },
                    }
                );
                setLogs(response.data);
                setExpandedQuestionIds([]);
                setExpandedAnswerIds([]);
            } catch (error) {
                console.error("AI 로그 조회 실패:", error);
                setLogs([]);
            } finally {
                setLogLoading(false);
            }
        };

        fetchLogs();
    }, [selectedTaskId, selectedStudentName, loginId]);

    const selectedTask = tasks.find((task) => String(task.id) === selectedTaskId);

    const toggleQuestionExpand = (id: number) => {
        setExpandedQuestionIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleAnswerExpand = (id: number) => {
        setExpandedAnswerIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const isQuestionExpanded = (id: number) => expandedQuestionIds.includes(id);
    const isAnswerExpanded = (id: number) => expandedAnswerIds.includes(id);

    const shouldShowMoreButton = (text: string, limit = 28) => {
        return text.length > limit;
    };

    const shortenText = (text: string, limit = 28) => {
        if (text.length <= limit) return text;
        return `${text.slice(0, limit)}...`;
    };

    return (
        <div className="min-h-screen bg-[#f5f7fb] px-5 py-6 md:px-8 text-slate-900">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* ✅ 헤더 */}
                <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-[0.25em] text-slate-400">
                            TEACHER DASHBOARD
                        </p>
                        <h1 className="mt-2 text-3xl font-black text-slate-900">
                            AI 로그 관리
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            학생 질문 및 AI 응답 기록 확인
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/teacher")}
                        className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                        과제 목록
                    </button>
                </section>

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

                    {/* ✅ 사이드바 */}
                    <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
                        <div className="text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-xl font-bold">
                                T
                            </div>
                            <p className="mt-4 font-semibold text-slate-900">
                                {teacherName || "교사"}
                            </p>
                            <p className="text-sm text-slate-500">
                                {teacherSubject || "과목 미설정"}
                            </p>
                        </div>

                        <div className="mt-6 space-y-2">
                            <button
                                onClick={() => navigate("/teacher")}
                                className="w-full rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
                            >
                                과제 관리
                            </button>

                            <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm text-white">
                                AI 로그
                            </button>

                            <button
                                onClick={() => navigate("/teacher/similarity")}
                                className="w-full rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
                            >
                                유사도 분석
                            </button>

                            <button
                                onClick={() => navigate("/teacher/students")}
                                className="w-full rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
                            >
                                학생 관리
                            </button>
                        </div>
                    </aside>

                    {/* ✅ 메인 */}
                    <main className="space-y-6">

                        {/* 🔍 필터 */}
                        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">조회 조건</h2>

                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <select
                                    value={selectedTaskId}
                                    onChange={(e) => setSelectedTaskId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                >
                                    <option value="">과제 선택</option>
                                    {tasks.map((task) => (
                                        <option key={task.id} value={task.id}>
                                            {task.title} ({task.className})
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedStudentName}
                                    onChange={(e) => setSelectedStudentName(e.target.value)}
                                    disabled={!selectedTaskId || studentLoading}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-100"
                                >
                                    <option value="">학생 선택</option>
                                    {students.map((s) => (
                                        <option key={s.id} value={s.studentName}>
                                            {s.studentName}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => {
                                        setSelectedTaskId("");
                                        setSelectedStudentName("");
                                        setStudents([]);
                                        setLogs([]);
                                        setExpandedQuestionIds([]);
                                        setExpandedAnswerIds([]);
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    초기화
                                </button>
                            </div>
                        </section>

                        {/* 📊 요약 */}
                        <section className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm text-slate-500">선택 과제</p>
                                <p className="mt-2 font-semibold text-slate-900">
                                    {selectedTask ? selectedTask.title : "-"}
                                </p>
                            </div>

                            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm text-slate-500">선택 학생</p>
                                <p className="mt-2 font-semibold text-slate-900">
                                    {selectedStudentName || "-"}
                                </p>
                            </div>

                            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm text-slate-500">로그 수</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {logs.length}개
                                </p>
                            </div>
                        </section>

                        {/* 📋 테이블 */}
                        <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="border-b px-6 py-4 bg-slate-50">
                                <h2 className="font-bold text-slate-900">AI 로그 목록</h2>
                            </div>

                            <div className="overflow-auto max-h-[600px]">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">번호</th>
                                            <th className="px-4 py-3 text-left font-medium">학생</th>
                                            <th className="px-4 py-3 text-left font-medium">질문</th>
                                            <th className="px-4 py-3 text-left font-medium">응답</th>
                                            <th className="px-4 py-3 text-left font-medium">시간</th>
                                            <th className="px-4 py-3 text-left font-medium">상태</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y">
                                        {logs.map((log, index) => (
                                            <tr key={log.id} className="hover:bg-slate-50 transition">
                                                <td className="px-4 py-4 text-slate-500">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-4 font-semibold text-slate-900">
                                                    {log.studentName}
                                                </td>

                                                <td className="px-4 py-4 text-slate-700">
                                                    {isQuestionExpanded(log.id)
                                                        ? log.question
                                                        : shortenText(log.question, 30)}
                                                </td>

                                                <td className="px-4 py-4 text-slate-700">
                                                    {isAnswerExpanded(log.id)
                                                        ? log.answer
                                                        : shortenText(log.answer, 40)}
                                                </td>

                                                <td className="px-4 py-4 text-slate-400 text-xs">
                                                    {log.createdAt?.replace("T", " ").slice(0, 16)}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${log.status === "주의"
                                                                ? "bg-rose-100 text-rose-600"
                                                                : "bg-emerald-100 text-emerald-600"
                                                            }`}
                                                    >
                                                        {log.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
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