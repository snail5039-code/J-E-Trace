import { BookOpen, Clock3, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { getTestMessage } from "../../lib/testApi";

export default function StudentPage() {
  const [result, setResult] = useState("아직 응답 없음");
  const [loading, setLoading] = useState(false);

  // 🔹 더미 데이터 (나중에 API 연결)
  const assignments = [
    { id: 1, title: "자바 컬렉션", status: "진행 중" },
    { id: 2, title: "운영체제 프로세스", status: "제출 완료" },
  ];

  const recentActivity = {
    title: "자바 컬렉션",
    count: 2,
    lastId: 1,
  };

  const cards = [
    {
      title: "과제 목록",
      desc: "진행 중인 과제와 제출 상태를 확인합니다.",
      icon: <MessageCircle className="h-8 w-8" />,
      path: "/student/assignments",
    },
    {
      title: "학습 기록",
      desc: "이전 대화와 학습 진행 내역을 확인합니다.",
      icon: <Clock3 className="h-8 w-8" />,
      path: "/history",
    },
    {
      title: "학습 자료",
      desc: "과목별 자료와 추천 콘텐츠를 확인합니다.",
      icon: <BookOpen className="h-8 w-8" />,
      path: "/materials",
    },
  ];

  const handleTest = async () => {
    try {
      setLoading(true);
      const data = await getTestMessage();
      setResult(data.message);
    } catch (error) {
      console.error(error);
      setResult("백엔드 연결 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-7">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">

        {/* 🔹 헤더 */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            STUDENT MODE
          </p>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            학생 대시보드
          </h1>

          <p className="mt-3 text-slate-500">
            과제를 확인하고 학습 흐름을 이어가세요.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleTest}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              {loading ? "연결 중..." : "백엔드 테스트"}
            </button>

            <Link
              to="/"
              className="rounded-xl bg-white px-5 py-2.5 text-sm text-slate-600 shadow-sm hover:bg-slate-100"
            >
              홈으로
            </Link>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            {result}
          </div>
        </div>

        {/* 🔹 학습 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500">진행 중 과제</p>
            <p className="text-2xl font-bold text-slate-900">
              {assignments.filter(a => a.status === "진행 중").length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500">완료 과제</p>
            <p className="text-2xl font-bold text-slate-900">
              {assignments.filter(a => a.status === "제출 완료").length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500">최근 활동</p>
            <p className="text-sm font-medium text-slate-700">
              {recentActivity.title} · 질문 {recentActivity.count}회
            </p>
          </div>
        </div>


        {/* 🔥 최근 활동 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            최근 학습
          </h2>

          <p className="text-sm text-slate-600">
            {recentActivity.title}에서 질문 {recentActivity.count}회 진행
          </p>

          <Link
            to={`/student/assignment/${recentActivity.lastId}`}
            className="inline-block mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            이어서 학습 →
          </Link>
        </div>

 
        {/* 🔹 기능 카드 (핵심 메뉴) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link to={card.path} key={card.title}>
              <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                {/* 아이콘 */}
                <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-3 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                  {card.icon}
                </div>

                {/* 제목 */}
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                  {card.title}
                </h3>

                {/* 설명 */}
                <p className="mt-2 text-sm text-slate-500">
                  {card.desc}
                </p>

                {/* CTA */}
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