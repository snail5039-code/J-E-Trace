import { ClipboardList, Search, Sparkles, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type SimilarityItem = {
    id: number;
    taskId: number;
    taskTitle: string;
    studentName: string;
    targetName: string;
    comparisonType: "STUDENT_TO_STUDENT" | "STUDENT_TO_AI_LOG";
    similarity: number;
    judge: "정상" | "주의" | "위험";
    reason: string;
    checkedAt: string;
};

export default function TeacherSimilarityPage() {
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
    const [items, setItems] = useState<SimilarityItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [studentKeyword, setStudentKeyword] = useState("");
    const [taskKeyword, setTaskKeyword] = useState("");
    const [judgeFilter, setJudgeFilter] = useState<"전체" | "정상" | "주의" | "위험">("전체");
    const [typeFilter, setTypeFilter] = useState<"전체" | "학생 간 비교" | "AI 로그 비교">("전체");
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
        const fetchSimilarityResults = async () => {
            try {
                const response = await axios.get("http://localhost:8080/teacher/tasks/similarity");
                setItems(response.data);
            } catch (error) {
                console.error("유사도 분석 목록 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarityResults();
    }, []);

    const filteredData = useMemo(() => {
        return items.filter((item) => {
            const matchStudent =
                item.studentName.includes(studentKeyword) ||
                item.targetName.includes(studentKeyword);

            const matchTask = item.taskTitle.includes(taskKeyword);
            const matchJudge = judgeFilter === "전체" ? true : item.judge === judgeFilter;
            const matchType =
                typeFilter === "전체"
                    ? true
                    : typeFilter === "학생 간 비교"
                        ? item.comparisonType === "STUDENT_TO_STUDENT"
                        : item.comparisonType === "STUDENT_TO_AI_LOG";

            return matchStudent && matchTask && matchJudge && matchType;
        });
    }, [items, studentKeyword, taskKeyword, judgeFilter, typeFilter]);

    return (
        <div className="min-h-screen bg-[#eef1f5] text-slate-800">
            <div className="border-b border-slate-300 bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 text-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/80">교사용 관리 시스템</p>
                        <h1 className="mt-1 text-2xl font-bold">유사도 분석</h1>
                    </div>

                    <button
                        onClick={() => navigate("/teacher")}
                        className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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
                            <p className="mt-4 text-lg font-semibold">{teacherName || "교사"}</p>
                            <p className="mt-1 text-sm text-white/70">
                                {teacherSubject ? `${teacherSubject} 수업 담당` : "담당 과목 미설정"}
                            </p>
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

                            <button className="flex w-full items-center gap-3 rounded-sm bg-white/10 px-4 py-3 text-left text-sm font-medium text-white">
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
                                <h2 className="text-lg font-semibold text-slate-900">유사도 결과 검색</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">학생명</label>
                                    <input
                                        type="text"
                                        value={studentKeyword}
                                        onChange={(e) => setStudentKeyword(e.target.value)}
                                        placeholder="학생명 입력"
                                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">과제명</label>
                                    <input
                                        type="text"
                                        value={taskKeyword}
                                        onChange={(e) => setTaskKeyword(e.target.value)}
                                        placeholder="과제명 입력"
                                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">판정</label>
                                    <select
                                        value={judgeFilter}
                                        onChange={(e) =>
                                            setJudgeFilter(e.target.value as "전체" | "정상" | "주의" | "위험")
                                        }
                                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        <option value="전체">전체</option>
                                        <option value="정상">정상</option>
                                        <option value="주의">주의</option>
                                        <option value="위험">위험</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">분석 유형</label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) =>
                                            setTypeFilter(e.target.value as "전체" | "학생 간 비교" | "AI 로그 비교")
                                        }
                                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        <option value="전체">전체</option>
                                        <option value="학생 간 비교">학생 간 비교</option>
                                        <option value="AI 로그 비교">AI 로그 비교</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                            <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                                <h2 className="text-lg font-semibold text-slate-900">유사도 분석 목록</h2>
                            </div>

                            <div className="max-h-[640px] overflow-auto">
                                <table className="min-w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700">
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">과제명</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">대상 학생</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">비교 대상</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">유형</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">유사도</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">판정</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">분석 시각</th>
                                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold">관리</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={8} className="border border-slate-300 px-4 py-8 text-center text-slate-500">
                                                    유사도 분석 결과 불러오는 중...
                                                </td>
                                            </tr>
                                        ) : filteredData.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="border border-slate-300 px-4 py-8 text-center text-slate-500">
                                                    조회된 유사도 분석 결과가 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50">
                                                    <td className="border border-slate-300 px-4 py-4 text-center">{item.taskTitle}</td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">{item.studentName}</td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">{item.targetName}</td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">
                                                        {item.comparisonType === "STUDENT_TO_STUDENT" ? "학생 간 비교" : "AI 로그 비교"}
                                                    </td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center font-semibold">
                                                        {item.similarity}%
                                                    </td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">
                                                        <span
                                                            className={`inline-block rounded-sm px-3 py-1 text-xs font-semibold ${item.judge === "위험"
                                                                ? "bg-rose-50 text-rose-700"
                                                                : item.judge === "주의"
                                                                    ? "bg-amber-50 text-amber-700"
                                                                    : "bg-emerald-50 text-emerald-700"
                                                                }`}
                                                        >
                                                            {item.judge}
                                                        </span>
                                                    </td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">{item.checkedAt}</td>
                                                    <td className="border border-slate-300 px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => navigate(`/teacher/similarity/${item.id}`)}
                                                            className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
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