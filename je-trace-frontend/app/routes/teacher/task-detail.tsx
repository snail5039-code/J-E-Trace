import { ArrowLeft, FileText, Search, Sparkles, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

type TaskDetail = {
  id: number;
  title: string;
  className: string;
  description: string;
  dueDate: string;
  aiAllowed: boolean;
  createdAt: string;
};

type TaskSubmission = {
  id: number;
  taskId: number;
  studentName: string;
  submitted: boolean;
  submittedAt: string | null;
  aiUsed: boolean;
  result: string | null;
  content: string | null;
  score: number;
  teacherComment: string | null;
  createdAt: string | null;
  updatedAt: string | null;
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

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
}

function getResultBadgeClass(result: string | null | undefined) {
  if (!result) return "bg-slate-100 text-slate-500";
  if (result.includes("복사") || result.includes("위험")) return "bg-rose-50 text-rose-700";
  if (result.includes("일부") || result.includes("주의")) return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

export default function TeacherTaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [assignment, setAssignment] = useState<TaskDetail | null>(null);
  const [students, setStudents] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningSimilarity, setRunningSimilarity] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const fetchData = async () => {
    if (!taskId) return;

    try {
      const [taskResponse, studentResponse] = await Promise.all([
        axios.get(`http://localhost:8080/teacher/tasks/${taskId}`),
        axios.get(`http://localhost:8080/teacher/tasks/${taskId}/taskSubmissions`),
      ]);

      setAssignment(taskResponse.data);
      setStudents(studentResponse.data);
    } catch (error) {
      console.error("과제 상세 조회 실패:", error);
      setNotice({
        type: "error",
        text: getErrorMessage(error, "과제 상세 조회 실패"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [taskId]);

  const handleRunSimilarityAnalysis = async () => {
    if (!taskId) return;

    setRunningSimilarity(true);
    setNotice({ type: "info", text: "유사도 분석 실행 중..." });

    try {
      await axios.post(`http://localhost:8080/teacher/tasks/${taskId}/similarity/run`);
      await fetchData();

      setNotice({
        type: "success",
        text: "유사도 분석 완료",
      });
    } catch (error) {
      console.error("유사도 분석 실행 실패:", error);
      setNotice({
        type: "error",
        text: getErrorMessage(error, "유사도 분석 실행 실패"),
      });
    } finally {
      setRunningSimilarity(false);
    }
  };

  const submittedCount = useMemo(
    () => students.filter((student) => student.submitted).length,
    [students]
  );

  const notSubmittedCount = students.length - submittedCount;

  const aiUsedCount = useMemo(
    () => students.filter((student) => student.aiUsed).length,
    [students]
  );

  const noticeClassName = useMemo(() => {
    if (!notice) return "";
    if (notice.type === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (notice.type === "error") return "border-rose-200 bg-rose-50 text-rose-700";
    return "border-sky-200 bg-sky-50 text-sky-700";
  }, [notice]);

  if (loading) {
    return <div className="p-6">과제 정보를 불러오는 중...</div>;
  }

  if (!assignment) {
    return <div className="p-6">과제 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-[#eef1f5] text-slate-800">
      <div className="border-b border-slate-300 bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">교사용 관리 시스템</p>
            <h1 className="mt-1 text-2xl font-bold">제출 현황 확인</h1>
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
                <ArrowLeft size={18} />
                과제 목록으로
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
                <h2 className="text-lg font-semibold text-slate-900">과제 정보</h2>
              </div>

              <div className="grid grid-cols-2 border-t border-slate-200 md:grid-cols-4">
                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600">
                  과제명
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm text-slate-800">
                  {assignment.title}
                </div>

                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600">
                  대상 반
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm text-slate-800">
                  {assignment.className}
                </div>

                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600">
                  마감일
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm text-slate-800">
                  {assignment.dueDate?.slice(0, 10)}
                </div>

                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600">
                  AI 허용
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm text-slate-800">
                  {assignment.aiAllowed ? "허용" : "비허용"}
                </div>
              </div>

              <div className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-700">
                {assignment.description || "과제 설명이 없습니다."}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#dff3ea] px-4 py-3 text-sm font-semibold">
                  제출 완료
                </div>
                <div className="px-4 py-5 text-2xl font-bold text-slate-900">{submittedCount}명</div>
              </div>

              <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#fbe4e4] px-4 py-3 text-sm font-semibold">
                  미제출
                </div>
                <div className="px-4 py-5 text-2xl font-bold text-slate-900">{notSubmittedCount}명</div>
              </div>

              <div className="rounded-sm border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#e5ecff] px-4 py-3 text-sm font-semibold">
                  AI 사용
                </div>
                <div className="px-4 py-5 text-2xl font-bold text-slate-900">{aiUsedCount}명</div>
              </div>
            </section>

            <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-300 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-slate-900">학생 제출 목록</h2>

                <div className="flex gap-2">
                  <button
                    onClick={handleRunSimilarityAnalysis}
                    disabled={runningSimilarity}
                    className="inline-flex items-center justify-center gap-2 rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FileText size={16} />
                    {runningSimilarity ? "분석 실행 중..." : "유사도 분석 실행"}
                  </button>

                  <button
                    onClick={() => navigate("/teacher/similarity")}
                    className="inline-flex items-center justify-center rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    유사도 결과 보기
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">학생명</th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">제출 여부</th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">제출 시각</th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">AI 사용</th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">분석 결과</th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">점수</th>
                      <th className="border border-slate-300 px-4 py-3 text-center font-semibold">관리</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="border border-slate-300 px-4 py-8 text-center text-slate-500">
                          등록된 학생 제출 데이터가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50">
                          <td className="border border-slate-300 px-4 py-4 text-center">{student.studentName}</td>
                          <td className="border border-slate-300 px-4 py-4 text-center">
                            {student.submitted ? "제출 완료" : "미제출"}
                          </td>
                          <td className="border border-slate-300 px-4 py-4 text-center">
                            {formatDateTime(student.submittedAt)}
                          </td>
                          <td className="border border-slate-300 px-4 py-4 text-center">
                            {student.aiUsed ? "사용" : "미사용"}
                          </td>
                          <td className="border border-slate-300 px-4 py-4 text-center">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getResultBadgeClass(student.result)}`}>
                              {student.result || "-"}
                            </span>
                          </td>
                          <td className="border border-slate-300 px-4 py-4 text-center">{student.score ?? 0}점</td>
                          <td className="border border-slate-300 px-4 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/teacher/tasks/${assignment.id}/submissions/${student.id}`)
                                }
                                className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                상세 보기
                              </button>

                              <button
                                onClick={() =>
                                  navigate(`/teacher/tasks/${assignment.id}/submissions/${student.id}/evaluation`)
                                }
                                className="rounded-sm bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                              >
                                평가하기
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
          </main>
        </div>
      </div>
    </div>
  );
}