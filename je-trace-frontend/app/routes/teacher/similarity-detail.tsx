import { ClipboardList, Search, Sparkles, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

type AiLog = {
    id: number;
    taskId: number;
    studentName: string;
    question: string;
    answer: string;
    createdAt: string;
    status: string;
};

type SimilarityDetail = {
    id: number;
    taskId: number;
    taskTitle: string;
    studentName: string;
    targetName: string;
    comparisonType: "STUDENT_TO_STUDENT" | "STUDENT_TO_AI_LOG";
    similarity: number;
    judge: "정상" | "주의" | "위험";
    reason: string;
    studentContent: string;
    targetContent: string;
    checkedAt: string;
};

export default function TeacherSimilarityDetailPage() {
    const navigate = useNavigate();
    const { similarityId } = useParams();

    const [detail, setDetail] = useState<SimilarityDetail | null>(null);
    const [studentLogs, setStudentLogs] = useState<AiLog[]>([]);
    const [targetLogs, setTargetLogs] = useState<AiLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!similarityId) return;

        const fetchDetail = async () => {
            try {
                const detailResponse = await axios.get(
                    `http://localhost:8080/teacher/tasks/similarity/${similarityId}`
                );

                const detailData = detailResponse.data;
                setDetail(detailData);

                const studentLogResponse = await axios.get(
                    `http://localhost:8080/teacher/tasks/${detailData.taskId}/logs`,
                    { params: { studentName: detailData.studentName } }
                );
                setStudentLogs(studentLogResponse.data);

                if (detailData.comparisonType === "STUDENT_TO_STUDENT") {
                    const targetLogResponse = await axios.get(
                        `http://localhost:8080/teacher/tasks/${detailData.taskId}/logs`,
                        { params: { studentName: detailData.targetName } }
                    );
                    setTargetLogs(targetLogResponse.data);
                } else {
                    setTargetLogs([]);
                }
            } catch (error) {
                console.error("유사도 상세 조회 실패:", error);
                setDetail(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [similarityId]);

    if (loading) {
        return <div className="p-6">유사도 상세 정보를 불러오는 중...</div>;
    }

    if (!detail) {
        return <div className="p-6">유사도 상세 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="min-h-screen bg-[#eef1f5] text-slate-800">
            <div className="border-b border-slate-300 bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 text-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/80">교사용 관리 시스템</p>
                        <h1 className="mt-1 text-2xl font-bold">유사도 분석 상세</h1>
                    </div>

                    <button
                        onClick={() => navigate("/teacher/similarity")}
                        className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        목록으로
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

                            <button
                                onClick={() => navigate("/teacher/logs")}
                                className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                <Sparkles size={18} />
                                AI 로그 확인
                            </button>

                            <button
                                onClick={() => navigate("/teacher/similarity")}
                                className="flex w-full items-center gap-3 rounded-sm bg-white/10 px-4 py-3 text-left text-sm font-medium text-white"
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
                                <h2 className="text-lg font-semibold text-slate-900">분석 기본 정보</h2>
                            </div>

                            <div className="grid grid-cols-2 border-t border-slate-200 md:grid-cols-4">
                                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">과제명</div>
                                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">{detail.taskTitle}</div>

                                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">대상 학생</div>
                                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">{detail.studentName}</div>

                                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">비교 대상</div>
                                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">{detail.targetName}</div>

                                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">분석 유형</div>
                                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                                    {detail.comparisonType === "STUDENT_TO_STUDENT" ? "학생 간 비교" : "AI 로그 비교"}
                                </div>

                                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">유사도</div>
                                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm font-semibold">
                                    {detail.similarity}%
                                </div>

                                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">판정</div>
                                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">{detail.judge}</div>

                                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">분석 시각</div>
                                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">{detail.checkedAt}</div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                            <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                <h2 className="text-lg font-semibold text-slate-900">AI 자동 분석 사유</h2>
                            </div>
                            <div className="px-5 py-5 text-sm whitespace-pre-wrap">{detail.reason}</div>
                        </section>

                        <section className="grid gap-5 lg:grid-cols-2">
                            <div className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                                <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                    <h2 className="text-lg font-semibold text-slate-900">학생 제출 내용</h2>
                                </div>
                                <div className="px-5 py-5 text-sm whitespace-pre-wrap">{detail.studentContent}</div>
                            </div>

                            <div className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                                <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                    <h2 className="text-lg font-semibold text-slate-900">비교 대상 내용</h2>
                                </div>
                                <div className="px-5 py-5 text-sm whitespace-pre-wrap">{detail.targetContent}</div>
                            </div>
                        </section>

                        <section className="grid gap-5 lg:grid-cols-2">
                            <div className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                                <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                    <h2 className="text-lg font-semibold text-slate-900">대상 학생 AI 로그</h2>
                                </div>

                                <div className="divide-y divide-slate-200">
                                    {studentLogs.length === 0 ? (
                                        <div className="px-5 py-8 text-center text-slate-500">AI 로그가 없습니다.</div>
                                    ) : (
                                        studentLogs.map((log) => (
                                            <div key={log.id} className="space-y-3 px-5 py-5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500">{log.createdAt?.replace("T", " ").slice(0, 16)}</span>
                                                    <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                                        {log.status}
                                                    </span>
                                                </div>

                                                <div>
                                                    <p className="mb-1 text-xs font-semibold text-slate-500">질문</p>
                                                    <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3 text-sm whitespace-pre-wrap">
                                                        {log.question}
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="mb-1 text-xs font-semibold text-slate-500">응답</p>
                                                    <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3 text-sm whitespace-pre-wrap">
                                                        {log.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                                <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                    <h2 className="text-lg font-semibold text-slate-900">비교 대상 AI 로그</h2>
                                </div>

                                <div className="divide-y divide-slate-200">
                                    {targetLogs.length === 0 ? (
                                        <div className="px-5 py-8 text-center text-slate-500">AI 로그가 없습니다.</div>
                                    ) : (
                                        targetLogs.map((log) => (
                                            <div key={log.id} className="space-y-3 px-5 py-5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500">{log.createdAt?.replace("T", " ").slice(0, 16)}</span>
                                                    <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                                        {log.status}
                                                    </span>
                                                </div>

                                                <div>
                                                    <p className="mb-1 text-xs font-semibold text-slate-500">질문</p>
                                                    <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3 text-sm whitespace-pre-wrap">
                                                        {log.question}
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="mb-1 text-xs font-semibold text-slate-500">응답</p>
                                                    <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3 text-sm whitespace-pre-wrap">
                                                        {log.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}