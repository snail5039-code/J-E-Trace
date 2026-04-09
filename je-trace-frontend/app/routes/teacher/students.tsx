import { ClipboardList, Search, Sparkles, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type StudentRequest = {
    id: number;
    studentName: string;
    className: string;
    status: string;
    requestedAt: string;
    processedAt: string | null;
};

type Student = {
    id: number;
    studentName: string;
    className: string;
    finalScore: number;
    totalTasks: number;
    submittedTasks: number;
    notSubmittedTasks: number;
    aiLogCount: number;
    cautionLogCount: number;
    approvedAt: string;
};

type StudentTaskScore = {
    id: number;
    taskId: number;
    taskTitle: string;
    className: string;
    submitted: boolean;
    submittedAt: string | null;
    score: number;
};

type Notice = {
    type: "success" | "error" | "info";
    text: string;
} | null;

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            fallback
        );
    }

    if (error instanceof Error) return error.message;
    return fallback;
}

function formatDateTime(value: string | null | undefined) {
    if (!value) return "-";
    return value.replace("T", " ").slice(0, 16);
}

export default function TeacherStudentsPage() {
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
    const [requests, setRequests] = useState<StudentRequest[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [studentDetail, setStudentDetail] = useState<Student | null>(null);
    const [taskScores, setTaskScores] = useState<StudentTaskScore[]>([]);

    const [requestLoading, setRequestLoading] = useState(true);
    const [studentLoading, setStudentLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [scoreLoading, setScoreLoading] = useState(false);

    const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);

    const [editForm, setEditForm] = useState({
        studentName: "",
        className: "",
    });

    const [savingInfo, setSavingInfo] = useState(false);
    const [savingScoreId, setSavingScoreId] = useState<number | null>(null);
    const [notice, setNotice] = useState<Notice>(null);

    const fetchRequests = async () => {
        try {
            const response = await axios.get("http://localhost:8080/teacher/tasks/studentRequests");
            setRequests(response.data);
        } catch (error) {
            console.error("학생 신청 목록 조회 실패:", error);
            setNotice({
                type: "error",
                text: getErrorMessage(error, "학생 신청 목록 조회 실패"),
            });
        } finally {
            setRequestLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/teacher/tasks/students");
            setStudents(response.data);
        } catch (error) {
            console.error("학생 목록 조회 실패:", error);
            setNotice({
                type: "error",
                text: getErrorMessage(error, "학생 목록 조회 실패"),
            });
        } finally {
            setStudentLoading(false);
        }
    };

    const fetchStudentDetail = async (studentId: number) => {
        setDetailLoading(true);

        try {
            const response = await axios.get(`http://localhost:8080/teacher/tasks/students/${studentId}`);
            const data = response.data;

            setStudentDetail(data);
            setEditForm({
                studentName: data.studentName ?? "",
                className: data.className ?? "",
            });
        } catch (error) {
            console.error("학생 상세 조회 실패:", error);
            setStudentDetail(null);
            setNotice({
                type: "error",
                text: getErrorMessage(error, "학생 상세 조회 실패"),
            });
        } finally {
            setDetailLoading(false);
        }
    };

    const fetchStudentTaskScores = async (studentId: number) => {
        setScoreLoading(true);

        try {
            const response = await axios.get(`http://localhost:8080/teacher/tasks/students/${studentId}/taskScores`);
            setTaskScores(response.data);
        } catch (error) {
            console.error("학생 과제별 점수 조회 실패:", error);
            setTaskScores([]);
            setNotice({
                type: "error",
                text: getErrorMessage(error, "학생 과제별 점수 조회 실패"),
            });
        } finally {
            setScoreLoading(false);
        }
    };

    const refreshSelectedStudent = async (studentId: number) => {
        await Promise.all([
            fetchStudentDetail(studentId),
            fetchStudentTaskScores(studentId),
            fetchStudents(),
            fetchRequests(),
        ]);
    };

    useEffect(() => {
        fetchRequests();
        fetchStudents();
    }, []);

    useEffect(() => {
        if (!selectedStudentId) {
            setStudentDetail(null);
            setTaskScores([]);
            return;
        }

        fetchStudentDetail(selectedStudentId);
        fetchStudentTaskScores(selectedStudentId);
    }, [selectedStudentId]);

    const handleApprove = async (requestId: number) => {
        setProcessingRequestId(requestId);
        setNotice({ type: "info", text: "학생 신청 승인 중..." });

        try {
            await axios.post(`http://localhost:8080/teacher/tasks/studentRequests/${requestId}/approve`);
            await Promise.all([fetchRequests(), fetchStudents()]);

            setNotice({
                type: "success",
                text: "학생 신청 승인 완료",
            });
        } catch (error) {
            console.error("학생 신청 승인 실패:", error);
            setNotice({
                type: "error",
                text: getErrorMessage(error, "학생 신청 승인 실패"),
            });
        } finally {
            setProcessingRequestId(null);
        }
    };

    const handleReject = async (requestId: number) => {
        setProcessingRequestId(requestId);
        setNotice({ type: "info", text: "학생 신청 거절 처리 중..." });

        try {
            await axios.post(`http://localhost:8080/teacher/tasks/studentRequests/${requestId}/reject`);
            await fetchRequests();

            setNotice({
                type: "success",
                text: "학생 신청 거절 완료",
            });
        } catch (error) {
            console.error("학생 신청 거절 실패:", error);
            setNotice({
                type: "error",
                text: getErrorMessage(error, "학생 신청 거절 실패"),
            });
        } finally {
            setProcessingRequestId(null);
        }
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateStudentInfo = async () => {
        if (!selectedStudentId) return;

        if (!editForm.studentName.trim()) {
            setNotice({ type: "error", text: "학생명을 입력해주세요." });
            return;
        }

        if (!editForm.className.trim()) {
            setNotice({ type: "error", text: "반 정보를 입력해주세요." });
            return;
        }

        setSavingInfo(true);
        setNotice({ type: "info", text: "학생 정보 저장 중..." });

        try {
            await axios.put(
                `http://localhost:8080/teacher/tasks/students/${selectedStudentId}`,
                {
                    studentName: editForm.studentName.trim(),
                    className: editForm.className.trim(),
                }
            );

            await refreshSelectedStudent(selectedStudentId);

            setNotice({
                type: "success",
                text: "학생 정보 수정 완료",
            });
        } catch (error) {
            console.error("학생 정보 수정 실패:", error);
            setNotice({
                type: "error",
                text: getErrorMessage(error, "학생 정보 수정 실패"),
            });
        } finally {
            setSavingInfo(false);
        }
    };

    const handleScoreChange = (submissionId: number, value: string) => {
        if (value === "") {
            setTaskScores((prev) =>
                prev.map((item) => (item.id === submissionId ? { ...item, score: 0 } : item))
            );
            return;
        }

        const nextScore = Number(value);

        setTaskScores((prev) =>
            prev.map((item) =>
                item.id === submissionId ? { ...item, score: Number.isNaN(nextScore) ? 0 : nextScore } : item
            )
        );
    };

    const handleUpdateTaskScore = async (submissionId: number, score: number) => {
        if (!selectedStudentId) return;

        if (Number.isNaN(score) || score < 0 || score > 100) {
            setNotice({ type: "error", text: "점수는 0점 이상 100점 이하만 가능합니다." });
            return;
        }

        setSavingScoreId(submissionId);
        setNotice({ type: "info", text: "과제 점수 저장 중..." });

        try {
            await axios.put(
                `http://localhost:8080/teacher/tasks/students/${selectedStudentId}/taskScores/${submissionId}`,
                { score }
            );

            await refreshSelectedStudent(selectedStudentId);

            setNotice({
                type: "success",
                text: "과제 점수 수정 완료",
            });
        } catch (error) {
            console.error("과제 점수 수정 실패:", error);
            setNotice({
                type: "error",
                text: getErrorMessage(error, "과제 점수 수정 실패"),
            });
        } finally {
            setSavingScoreId(null);
        }
    };

    const selectedStudent = useMemo(
        () => students.find((student) => student.id === selectedStudentId) ?? null,
        [students, selectedStudentId]
    );

    const noticeClassName = useMemo(() => {
        if (!notice) return "";
        if (notice.type === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
        if (notice.type === "error") return "border-rose-200 bg-rose-50 text-rose-700";
        return "border-sky-200 bg-sky-50 text-sky-700";
    }, [notice]);

    return (
        <div className="min-h-screen bg-[#eef1f5] text-slate-800">
            <div className="border-b border-slate-300 bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 text-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/80">교사용 관리 시스템</p>
                        <h1 className="mt-1 text-2xl font-bold">학생 관리</h1>
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
                {notice && (
                    <div className={`mb-5 rounded-sm border px-4 py-3 text-sm font-medium ${noticeClassName}`}>
                        {notice.text}
                    </div>
                )}

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

                            <button className="flex w-full items-center gap-3 rounded-sm bg-white/10 px-4 py-3 text-left text-sm font-medium text-white">
                                <UserRound size={18} />
                                학생 관리
                            </button>
                        </div>
                    </aside>

                    <main className="space-y-5">
                        <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                            <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                <h2 className="text-lg font-semibold text-slate-900">승인 대기 신청</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700">
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">학생명</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">반</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">신청 시각</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">관리</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {requestLoading ? (
                                            <tr>
                                                <td colSpan={4} className="border border-slate-300 px-4 py-8 text-center text-slate-500">
                                                    학생 신청 목록 불러오는 중...
                                                </td>
                                            </tr>
                                        ) : requests.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="border border-slate-300 px-4 py-8 text-center text-slate-500">
                                                    승인 대기 학생 신청이 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            requests.map((request) => (
                                                <tr key={request.id} className="hover:bg-slate-50">
                                                    <td className="border border-slate-300 px-4 py-4 text-center">{request.studentName}</td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">{request.className}</td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">
                                                        {formatDateTime(request.requestedAt)}
                                                    </td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleApprove(request.id)}
                                                                disabled={processingRequestId === request.id}
                                                                className="rounded-sm bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {processingRequestId === request.id ? "처리 중..." : "승인"}
                                                            </button>

                                                            <button
                                                                onClick={() => handleReject(request.id)}
                                                                disabled={processingRequestId === request.id}
                                                                className="rounded-sm bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {processingRequestId === request.id ? "처리 중..." : "거절"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                            <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                <h2 className="text-lg font-semibold text-slate-900">승인된 학생 목록</h2>
                            </div>

                            <div className="grid gap-6 p-5 lg:grid-cols-[380px_minmax(0,1fr)]">
                                <div className="overflow-hidden rounded-sm border border-slate-300">
                                    <div className="border-b border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                                        학생 목록
                                    </div>

                                    <div className="max-h-[760px] overflow-y-auto">
                                        {studentLoading ? (
                                            <div className="px-4 py-8 text-center text-sm text-slate-500">
                                                학생 목록 불러오는 중...
                                            </div>
                                        ) : students.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-sm text-slate-500">
                                                승인된 학생이 없습니다.
                                            </div>
                                        ) : (
                                            students.map((student) => {
                                                const isSelected = student.id === selectedStudentId;

                                                return (
                                                    <button
                                                        key={student.id}
                                                        onClick={() => setSelectedStudentId(student.id)}
                                                        className={`block w-full border-b border-slate-200 px-4 py-4 text-left transition ${isSelected ? "bg-teal-50" : "bg-white hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{student.studentName}</p>
                                                                <p className="mt-1 text-xs text-slate-500">{student.className}</p>
                                                            </div>

                                                            <div className="whitespace-nowrap rounded-sm bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                                                                평균 {student.finalScore}점
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                            <p>제출 {student.submittedTasks}/{student.totalTasks}</p>
                                                            <p>주의 로그 {student.cautionLogCount}건</p>
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-sm border border-slate-300 bg-slate-50">
                                    <div className="border-b border-slate-300 bg-slate-100 px-5 py-4">
                                        <h3 className="text-base font-semibold text-slate-900">학생 상세 / 수정</h3>
                                        {selectedStudent && (
                                            <p className="mt-1 text-sm text-slate-500">
                                                선택 학생: {selectedStudent.studentName} / {selectedStudent.className}
                                            </p>
                                        )}
                                    </div>

                                    {detailLoading ? (
                                        <div className="px-5 py-8 text-center text-slate-500">학생 상세 정보를 불러오는 중...</div>
                                    ) : !studentDetail ? (
                                        <div className="px-5 py-8 text-center text-slate-500">학생을 선택하세요.</div>
                                    ) : (
                                        <div className="p-5">
                                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                                                <div className="rounded-sm border border-slate-300 bg-white">
                                                    <div className="border-b border-slate-200 bg-[#f7f2c8] px-4 py-3 text-sm font-semibold">
                                                        기본 정보 수정
                                                    </div>

                                                    <div className="space-y-3 px-4 py-4 text-sm">
                                                        <div>
                                                            <label className="mb-1 block text-xs font-semibold text-slate-600">학생명</label>
                                                            <input
                                                                name="studentName"
                                                                value={editForm.studentName}
                                                                onChange={handleEditFormChange}
                                                                className="w-full rounded-sm border border-slate-300 px-3 py-2"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 block text-xs font-semibold text-slate-600">반</label>
                                                            <input
                                                                name="className"
                                                                value={editForm.className}
                                                                onChange={handleEditFormChange}
                                                                className="w-full rounded-sm border border-slate-300 px-3 py-2"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 block text-xs font-semibold text-slate-600">승인일</label>
                                                            <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                                                                {studentDetail.approvedAt?.replace("T", " ").slice(0, 10)}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={handleUpdateStudentInfo}
                                                            disabled={savingInfo}
                                                            className="w-full whitespace-nowrap rounded-sm bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {savingInfo ? "저장 중..." : "학생 정보 저장"}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="rounded-sm border border-slate-300 bg-white">
                                                    <div className="border-b border-slate-200 bg-[#dff3ea] px-4 py-3 text-sm font-semibold">
                                                        성적 / 과제 현황
                                                    </div>

                                                    <div className="space-y-3 px-4 py-4 text-sm">
                                                        <p>최종 성적(평균): {studentDetail.finalScore}점</p>
                                                        <p>총 과제 수: {studentDetail.totalTasks}개</p>
                                                        <p>제출 완료: {studentDetail.submittedTasks}개</p>
                                                        <p>미제출: {studentDetail.notSubmittedTasks}개</p>
                                                    </div>
                                                </div>

                                                <div className="rounded-sm border border-slate-300 bg-white">
                                                    <div className="border-b border-slate-200 bg-[#e5ecff] px-4 py-3 text-sm font-semibold">
                                                        AI 이용 현황
                                                    </div>

                                                    <div className="space-y-3 px-4 py-4 text-sm">
                                                        <p>AI 로그 수: {studentDetail.aiLogCount}개</p>
                                                        <p>주의 로그 수: {studentDetail.cautionLogCount}개</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                            <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                <h2 className="text-lg font-semibold text-slate-900">과제별 점수</h2>
                            </div>

                            {!selectedStudentId ? (
                                <div className="px-5 py-8 text-center text-slate-500">
                                    학생을 선택하면 과제별 점수가 표시됩니다.
                                </div>
                            ) : (
                                <div className="p-5">
                                    <table className="w-full table-fixed border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-100 text-slate-700">
                                                <th className="w-[34%] whitespace-nowrap border border-slate-300 px-4 py-3 text-center font-semibold">
                                                    과제명
                                                </th>
                                                <th className="w-[14%] whitespace-nowrap border border-slate-300 px-4 py-3 text-center font-semibold">
                                                    반
                                                </th>
                                                <th className="w-[14%] whitespace-nowrap border border-slate-300 px-4 py-3 text-center font-semibold">
                                                    제출 여부
                                                </th>
                                                <th className="w-[20%] whitespace-nowrap border border-slate-300 px-4 py-3 text-center font-semibold">
                                                    제출 시각
                                                </th>
                                                <th className="w-[9%] whitespace-nowrap border border-slate-300 px-3 py-3 text-center font-semibold">
                                                    점수
                                                </th>
                                                <th className="w-[12%] whitespace-nowrap border border-slate-300 px-3 py-3 text-center font-semibold">
                                                    관리
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {scoreLoading ? (
                                                <tr>
                                                    <td colSpan={6} className="border border-slate-300 px-4 py-8 text-center text-slate-500">
                                                        과제별 점수 불러오는 중...
                                                    </td>
                                                </tr>
                                            ) : taskScores.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="border border-slate-300 px-4 py-8 text-center text-slate-500">
                                                        등록된 과제 점수가 없습니다.
                                                    </td>
                                                </tr>
                                            ) : (
                                                taskScores.map((taskScore) => (
                                                    <tr key={taskScore.id} className="hover:bg-slate-50">
                                                        <td
                                                            className="border border-slate-300 px-4 py-4 text-center"
                                                            title={taskScore.taskTitle}
                                                        >
                                                            <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {taskScore.taskTitle}
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap border border-slate-300 px-3 py-4 text-center">
                                                            {taskScore.className}
                                                        </td>

                                                        <td className="whitespace-nowrap border border-slate-300 px-3 py-4 text-center">
                                                            {taskScore.submitted ? "제출 완료" : "미제출"}
                                                        </td>

                                                        <td className="whitespace-nowrap border border-slate-300 px-3 py-4 text-center text-[13px]">
                                                            {formatDateTime(taskScore.submittedAt)}
                                                        </td>

                                                        <td className="whitespace-nowrap border border-slate-300 px-3 py-4 text-center">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={100}
                                                                value={taskScore.score}
                                                                onChange={(e) => handleScoreChange(taskScore.id, e.target.value)}
                                                                className="mx-auto h-9 w-[65px] rounded-sm border border-slate-300 px-2 py-2 text-center"
                                                            />
                                                        </td>

                                                        <td className="whitespace-nowrap border border-slate-300 px-3 py-4 text-center">
                                                            <button
                                                                onClick={() => handleUpdateTaskScore(taskScore.id, taskScore.score)}
                                                                disabled={savingScoreId === taskScore.id}
                                                                className="inline-flex h-9 min-w-[68px] items-center justify-center whitespace-nowrap rounded-sm bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {savingScoreId === taskScore.id ? "저장중" : "저장"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}