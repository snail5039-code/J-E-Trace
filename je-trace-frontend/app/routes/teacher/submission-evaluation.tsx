import { ArrowLeft, ClipboardList, Search, Sparkles, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
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

type SubmissionDetail = {
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

  topStudentSimilarity: number | null;
  topStudentTargetName: string | null;
  topStudentJudge: string | null;
  topStudentReason: string | null;

  aiLogSimilarity: number | null;
  aiLogJudge: string | null;
  aiLogReason: string | null;
};

type AiLog = {
  id: number;
  taskId: number;
  studentName: string;
  question: string;
  answer: string;
  createdAt: string;
  status: string;
};

function getJudgeBadgeClass(judge: string | null | undefined) {
  if (judge === "위험") return "bg-rose-50 text-rose-700";
  if (judge === "주의") return "bg-amber-50 text-amber-700";
  if (judge === "정상") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-500";
}

export default function TeacherSubmissionEvaluationPage() {
  const navigate = useNavigate();
  const { taskId, submissionId } = useParams();

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [logs, setLogs] = useState<AiLog[]>([]);
  const [score, setScore] = useState("");
  const [teacherComment, setTeacherComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!taskId || !submissionId) return;

    const fetchData = async () => {
      try {
        const taskResponse = await axios.get(`http://localhost:8080/teacher/tasks/${taskId}`);
        const submissionResponse = await axios.get(
          `http://localhost:8080/teacher/tasks/submissions/${submissionId}`
        );

        setTask(taskResponse.data);
        setSubmission(submissionResponse.data);
        setScore(
          submissionResponse.data?.score !== null && submissionResponse.data?.score !== undefined
            ? String(submissionResponse.data.score)
            : ""
        );
        setTeacherComment(submissionResponse.data?.teacherComment ?? "");

        if (submissionResponse.data?.studentName) {
          const logResponse = await axios.get(`http://localhost:8080/teacher/tasks/${taskId}/logs`, {
            params: { studentName: submissionResponse.data.studentName },
          });
          setLogs(logResponse.data);
        }
      } catch (error) {
        console.error("평가 페이지 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId, submissionId]);

  const handleSaveEvaluation = async () => {
    if (!submissionId) return;

    setSaving(true);
    try {
      await axios.put(`http://localhost:8080/teacher/tasks/submissions/${submissionId}/evaluation`, {
        score: Number(score),
        teacherComment,
      });

      alert("평가 저장 완료");
    } catch (error) {
      console.error("평가 저장 실패:", error);
      alert("평가 저장 실패");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">평가 정보를 불러오는 중...</div>;
  }

  if (!task || !submission) {
    return <div className="p-6">평가 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-[#eef1f5] text-slate-800">
      <div className="border-b border-slate-300 bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">교사용 관리 시스템</p>
            <h1 className="mt-1 text-2xl font-bold">과제 평가하기</h1>
          </div>

          <button
            onClick={() => navigate(`/teacher/tasks/${taskId}`)}
            className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            제출 현황으로
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
                onClick={() => navigate(`/teacher/tasks/${taskId}`)}
                className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft size={18} />
                제출 현황으로
              </button>

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
                <h2 className="text-lg font-semibold text-slate-900">평가 대상 정보</h2>
              </div>

              <div className="grid grid-cols-2 border-t border-slate-200 md:grid-cols-4">
                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                  과제명
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">{task.title}</div>

                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                  학생명
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                  {submission.studentName}
                </div>

                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                  반
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">{task.className}</div>

                <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                  분석 결과
                </div>
                <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                  {submission.result || "-"}
                </div>
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
              <div className="space-y-5">
                <div className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                  <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">제출 내용</h2>
                  </div>
                  <div className="px-5 py-5 text-sm whitespace-pre-wrap">
                    {submission.content || "제출 내용이 없습니다."}
                  </div>
                </div>

                <div className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                  <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">AI 분석 참고</h2>
                  </div>

                  <div className="grid grid-cols-2 border-t border-slate-200 md:grid-cols-4">
                    <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                      학생 간 최고 유사도
                    </div>
                    <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                      {submission.topStudentSimilarity ?? 0}%
                    </div>

                    <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                      주요 비교 대상
                    </div>
                    <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                      {submission.topStudentTargetName || "-"}
                    </div>

                    <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                      학생 간 판정
                    </div>
                    <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                      <span
                        className={`inline-block rounded-sm px-3 py-1 text-xs font-semibold ${getJudgeBadgeClass(
                          submission.topStudentJudge
                        )}`}
                      >
                        {submission.topStudentJudge || "-"}
                      </span>
                    </div>

                    <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                      AI 로그 유사도
                    </div>
                    <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                      {submission.aiLogSimilarity ?? 0}%
                    </div>

                    <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                      AI 로그 판정
                    </div>
                    <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                      <span
                        className={`inline-block rounded-sm px-3 py-1 text-xs font-semibold ${getJudgeBadgeClass(
                          submission.aiLogJudge
                        )}`}
                      >
                        {submission.aiLogJudge || "-"}
                      </span>
                    </div>

                    <div className="border-r border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium">
                      최종 분석 결과
                    </div>
                    <div className="border-b border-slate-200 px-4 py-4 text-center text-sm">
                      {submission.result || "-"}
                    </div>
                  </div>

                  <div className="grid gap-4 border-t border-slate-200 px-5 py-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-700">학생 간 분석 사유</p>
                      <div className="rounded-sm border border-slate-200 bg-slate-50 px-4 py-4 text-sm whitespace-pre-wrap">
                        {submission.topStudentReason || "학생 간 유사도 분석 결과가 없습니다."}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-700">AI 로그 분석 사유</p>
                      <div className="rounded-sm border border-slate-200 bg-slate-50 px-4 py-4 text-sm whitespace-pre-wrap">
                        {submission.aiLogReason || "AI 로그 유사도 분석 결과가 없습니다."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">평가 입력</h2>
                </div>

                <div className="space-y-4 px-5 py-5">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">점수</label>
                    <input
                      type="number"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      className="w-full rounded-sm border border-slate-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">평가 코멘트</label>
                    <textarea
                      value={teacherComment}
                      onChange={(e) => setTeacherComment(e.target.value)}
                      rows={8}
                      className="w-full rounded-sm border border-slate-300 px-3 py-2"
                    />
                  </div>

                  <button
                    onClick={handleSaveEvaluation}
                    disabled={saving}
                    className="w-full rounded-sm bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {saving ? "저장 중..." : "평가 저장"}
                  </button>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">AI 로그 참고</h2>
              </div>

              <div className="divide-y divide-slate-200">
                {logs.length === 0 ? (
                  <div className="px-5 py-8 text-center text-slate-500">AI 로그가 없습니다.</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="space-y-3 px-5 py-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {log.createdAt?.replace("T", " ").slice(0, 16)}
                        </span>
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
                        <p className="mb-1 block text-xs font-semibold text-slate-500">응답</p>
                        <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3 text-sm whitespace-pre-wrap">
                          {log.answer}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}