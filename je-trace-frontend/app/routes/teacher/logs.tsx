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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/teacher/tasks");
                setTasks(response.data);
            } catch (error) {
                console.error("과제 목록 조회 실패:", error);
            } finally {
                setTaskLoading(false);
            }
        };

        fetchTasks();
    }, []);

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
                    `http://localhost:8080/teacher/tasks/${selectedTaskId}/taskSubmissions`
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
    }, [selectedTaskId]);

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
    }, [selectedTaskId, selectedStudentName]);

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
        <div className="min-h-screen bg-[#eef1f5] text-slate-800">
            <div className="border-b border-slate-300 bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 text-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/80">교사용 관리 시스템</p>
                        <h1 className="mt-1 text-2xl font-bold">AI 로그 확인</h1>
                    </div>

                    <button
                        onClick={() => navigate("/teacher")}
                        className="rounded-sm bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        과제 목록
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
                            <button
                                onClick={() => navigate("/teacher")}
                                className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                <ClipboardList size={18} />
                                과제 관리
                            </button>

                            <button className="flex w-full items-center gap-3 rounded-sm bg-white/10 px-4 py-3 text-left text-sm font-medium text-white">
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
                                <h2 className="text-lg font-semibold text-slate-900">로그 조회 조건</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        과제 선택
                                    </label>
                                    <select
                                        value={selectedTaskId}
                                        onChange={(e) => {
                                            setSelectedTaskId(e.target.value);
                                        }}
                                        className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                                    >
                                        <option value="">과제를 선택하세요</option>
                                        {tasks.map((task) => (
                                            <option key={task.id} value={task.id}>
                                                {task.title} ({task.className})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        학생 선택
                                    </label>
                                    <select
                                        value={selectedStudentName}
                                        onChange={(e) => setSelectedStudentName(e.target.value)}
                                        disabled={!selectedTaskId || studentLoading}
                                        className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 disabled:bg-slate-100"
                                    >
                                        <option value="">
                                            {!selectedTaskId
                                                ? "먼저 과제를 선택하세요"
                                                : studentLoading
                                                    ? "학생 목록 불러오는 중..."
                                                    : "학생을 선택하세요"}
                                        </option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.studentName}>
                                                {student.studentName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setSelectedTaskId("");
                                            setSelectedStudentName("");
                                            setStudents([]);
                                            setLogs([]);
                                            setExpandedQuestionIds([]);
                                            setExpandedAnswerIds([]);
                                        }}
                                        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        필터 초기화
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                                <div className="border-b border-slate-200 bg-[#f7f2c8] px-4 py-3 text-sm font-semibold">
                                    선택 과제
                                </div>
                                <div className="px-4 py-5 text-base font-semibold text-slate-900">
                                    {selectedTask ? selectedTask.title : taskLoading ? "불러오는 중..." : "-"}
                                </div>
                            </div>

                            <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                                <div className="border-b border-slate-200 bg-[#dff3ea] px-4 py-3 text-sm font-semibold">
                                    선택 학생
                                </div>
                                <div className="px-4 py-5 text-base font-semibold text-slate-900">
                                    {selectedStudentName || "-"}
                                </div>
                            </div>

                            <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                                <div className="border-b border-slate-200 bg-[#e5ecff] px-4 py-3 text-sm font-semibold">
                                    조회 로그 수
                                </div>
                                <div className="px-4 py-5 text-2xl font-bold text-slate-900">
                                    {selectedTaskId && selectedStudentName ? `${logs.length}개` : "-"}
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                            <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                <h2 className="text-lg font-semibold text-slate-900">AI 로그 목록</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700">
                                            <th className="w-[70px] whitespace-nowrap border border-slate-300 px-4 py-3 text-center font-semibold">
                                                번호
                                            </th>
                                            <th className="w-[120px] whitespace-nowrap border border-slate-300 px-4 py-3 text-center font-semibold">
                                                학생명
                                            </th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                                                질문
                                            </th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">
                                                응답
                                            </th>
                                            <th className="w-[150px] whitespace-nowrap border border-slate-300 px-4 py-3 text-center font-semibold">
                                                질문 시각
                                            </th>
                                            <th className="w-[90px] whitespace-nowrap border border-slate-300 px-4 py-3 text-center font-semibold">
                                                상태
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {!selectedTaskId ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="border border-slate-300 px-4 py-8 text-center text-slate-500"
                                                >
                                                    과제를 먼저 선택하세요.
                                                </td>
                                            </tr>
                                        ) : !selectedStudentName ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="border border-slate-300 px-4 py-8 text-center text-slate-500"
                                                >
                                                    학생을 선택하세요.
                                                </td>
                                            </tr>
                                        ) : logLoading ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="border border-slate-300 px-4 py-8 text-center text-slate-500"
                                                >
                                                    AI 로그 불러오는 중...
                                                </td>
                                            </tr>
                                        ) : logs.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="border border-slate-300 px-4 py-8 text-center text-slate-500"
                                                >
                                                    조회된 로그가 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map((log, index) => {
                                                const questionExpanded = isQuestionExpanded(log.id);
                                                const answerExpanded = isAnswerExpanded(log.id);

                                                return (
                                                    <tr key={log.id} className="align-top hover:bg-slate-50">
                                                        <td className="w-[70px] whitespace-nowrap border border-slate-300 px-4 py-4 text-center">
                                                            {index + 1}
                                                        </td>

                                                        <td className="w-[120px] whitespace-nowrap border border-slate-300 px-4 py-4 text-center font-medium text-slate-900">
                                                            {log.studentName}
                                                        </td>

                                                        <td className="border border-slate-300 px-4 py-4 text-left text-slate-700">
                                                            <div className="max-w-[260px] whitespace-normal break-words leading-6">
                                                                {questionExpanded ? log.question : shortenText(log.question, 26)}
                                                            </div>
                                                            {shouldShowMoreButton(log.question, 26) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleQuestionExpand(log.id)}
                                                                    className="mt-2 text-xs font-semibold text-teal-700 hover:underline"
                                                                >
                                                                    {questionExpanded ? "접기" : "더보기"}
                                                                </button>
                                                            )}
                                                        </td>

                                                        <td className="border border-slate-300 px-4 py-4 text-left text-slate-700">
                                                            <div className="max-w-[360px] whitespace-normal break-words leading-6">
                                                                {answerExpanded ? log.answer : shortenText(log.answer, 40)}
                                                            </div>
                                                            {shouldShowMoreButton(log.answer, 40) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleAnswerExpand(log.id)}
                                                                    className="mt-2 text-xs font-semibold text-teal-700 hover:underline"
                                                                >
                                                                    {answerExpanded ? "접기" : "더보기"}
                                                                </button>
                                                            )}
                                                        </td>

                                                        <td className="w-[150px] whitespace-nowrap border border-slate-300 px-4 py-4 text-center text-slate-700">
                                                            {log.createdAt?.replace("T", " ").slice(0, 16)}
                                                        </td>

                                                        <td className="w-[90px] whitespace-nowrap border border-slate-300 px-4 py-4 text-center">
                                                            <span
                                                                className={`inline-block rounded-sm px-3 py-1 text-xs font-semibold ${log.status === "주의"
                                                                        ? "bg-rose-50 text-rose-700"
                                                                        : "bg-emerald-50 text-emerald-700"
                                                                    }`}
                                                            >
                                                                {log.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
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