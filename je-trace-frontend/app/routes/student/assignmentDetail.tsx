import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../../lib/axios";

type LogItem = {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  status: string;
};

type TaskDetail = {
  id: number;
  title: string;
  className: string;
  description: string;
  dueDate: string;
  aiAllowed: boolean;
  submissionId: number | null;
  submitted: boolean;
  submittedAt: string | null;
  aiUsed: boolean;
  content: string | null;
  score: number | null;
  teacherComment: string | null;
  logs: LogItem[];
};

export default function AssignmentDetailPage() {
  const { taskId } = useParams();
  const studentName = typeof window !== "undefined" ? localStorage.getItem("studentName") ?? "" : "";

  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [question, setQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchDetail = async () => {
    if (!taskId || !studentName) return;

    try {
      const res = await api.get(`/student/tasks/${taskId}`, {
        params: { studentName },
      });
      setDetail(res.data);
      setAnswerText(res.data.content ?? "");
    } catch (error) {
      console.error(error);
      alert("과제 상세 조회 실패");
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [taskId, studentName]);

  const cautionCount = useMemo(() => {
    return detail?.logs?.filter((log) => log.status === "주의").length ?? 0;
  }, [detail]);

  const handleAskAi = async () => {
    if (!question.trim()) {
      alert("질문을 입력하세요.");
      return;
    }

    if (!detail?.aiAllowed) {
      alert("이 과제는 AI 사용이 허용되지 않았습니다.");
      return;
    }

    try {
      setIsChatLoading(true);

      const res = await api.post(`/student/tasks/${taskId}/chat`, {
        studentName,
        question,
      });

      alert(`AI 응답 완료\n상태: ${res.data.status}`);
      setQuestion("");
      await fetchDetail();
    } catch (error) {
      console.error(error);
      alert("AI 질문 실패");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      alert("답안을 입력하세요.");
      return;
    }

    try {
      setIsSubmitLoading(true);

      await api.put(`/student/tasks/${taskId}/submit`, {
        studentName,
        content: answerText,
        aiUsed: (detail?.logs?.length ?? 0) > 0,
      });

      alert("제출 완료");
      await fetchDetail();
    } catch (error) {
      console.error(error);
      alert("제출 실패");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (!studentName) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-slate-700">학생 로그인부터 해라.</p>
          <Link to="/login/student" className="mt-4 inline-block text-blue-600 hover:underline">
            로그인 페이지로 →
          </Link>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{detail.className}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{detail.title}</h1>
            <p className="mt-2 text-slate-600">마감일: {detail.dueDate}</p>
          </div>

          <Link
            to="/student/assignments"
            className="rounded-xl bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
          >
            과제 목록
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">과제 설명</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {detail.description}
              </p>

              <div className="mt-4 text-sm text-slate-500">
                AI 사용: {detail.aiAllowed ? "허용" : "금지"}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">최종 답안 작성</h2>

              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={14}
                className="mt-4 w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 outline-none"
                placeholder="최종 답안을 입력하세요."
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  제출 상태: {detail.submitted ? `제출 완료 (${detail.submittedAt ?? "-"})` : "미제출"}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitLoading}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isSubmitLoading ? "제출 중..." : "최종 제출"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">교사 피드백</h2>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>점수: {detail.score ?? 0}</p>
                <p>코멘트: {detail.teacherComment ?? "아직 없음"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">AI 질문</h2>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={5}
                className="mt-4 w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 outline-none"
                placeholder="과제와 관련된 질문을 입력하세요."
              />

              <button
                onClick={handleAskAi}
                disabled={isChatLoading || !detail.aiAllowed}
                className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isChatLoading ? "질문 중..." : "AI에게 질문하기"}
              </button>

              {!detail.aiAllowed && (
                <p className="mt-3 text-sm text-red-500">이 과제는 AI 질문이 허용되지 않습니다.</p>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">AI 로그 요약</h2>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-slate-500">총 질문 수</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {detail.logs?.length ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-slate-500">주의 로그</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {cautionCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">AI 대화 로그</h2>

              <div className="mt-4 max-h-[520px] space-y-4 overflow-y-auto">
                {(detail.logs ?? []).map((log) => (
                  <div key={log.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">{log.createdAt}</span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          log.status === "주의"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Q. {log.question}
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {log.answer}
                    </p>
                  </div>
                ))}

                {(!detail.logs || detail.logs.length === 0) && (
                  <p className="text-sm text-slate-500">아직 질문 기록이 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}