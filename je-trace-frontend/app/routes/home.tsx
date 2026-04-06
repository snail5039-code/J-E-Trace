import { GraduationCap, School } from "lucide-react";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  const modes = [
    {
      title: "학생 모드",
      desc: "AI와 대화하며 학습하고, 개인별 학습 기록을 확인합니다.",
      icon: <GraduationCap className="h-10 w-10" />,
      onClick: () => navigate("/student"),
    },
    {
      title: "교사 모드",
      desc: "학생 대화 로그와 학습 현황을 확인하고 관리합니다.",
      icon: <School className="h-10 w-10" />,
      onClick: () => navigate("/teacher"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl flex flex-col gap-10">

        {/* 🔹 HERO 영역 */}
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            JE TRACE
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">
            AI 교육 솔루션
          </h1>

          <p className="mt-3 text-slate-500">
            학습자와 교사를 위한 AI 채팅 기반 학습 기록 및 분석 플랫폼
          </p>
        </div>

        {/* 🔹 모드 선택 텍스트 */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            모드 선택
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            사용할 화면을 선택해 서비스를 시작하세요
          </p>
        </div>

        {/* 🔹 카드 영역 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {modes.map((mode) => (
            <button
              key={mode.title}
              onClick={mode.onClick}
              className="group rounded-2xl bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* 아이콘 */}
              <div className="mb-5 inline-flex rounded-xl bg-slate-100 p-4 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                {mode.icon}
              </div>

              {/* 제목 */}
              <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600">
                {mode.title}
              </h3>

              {/* 설명 */}
              <p className="mt-3 text-sm text-slate-500">
                {mode.desc}
              </p>

              {/* CTA */}
              <div className="mt-6 text-sm font-medium text-slate-400 group-hover:text-blue-600">
                입장하기 →
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}