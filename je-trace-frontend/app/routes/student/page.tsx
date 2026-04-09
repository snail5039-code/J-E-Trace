import { GraduationCap, School } from "lucide-react";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-200 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[32px] border-4 border-slate-900 bg-white px-8 py-14 text-center">
          <p className="inline-block rounded-full border border-slate-300 px-4 py-1 text-sm font-semibold tracking-[0.3em] text-slate-500">
            JE TRACE
          </p>
          <h1 className="mt-6 text-5xl font-extrabold text-slate-900">
            AI 교육 솔루션
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            학습자와 교사를 위한 AI 채팅 기반 학습 기록 및 분석 플랫폼
          </p>
        </section>

        <section className="mx-auto mt-8 max-w-2xl rounded-[28px] bg-slate-950 px-8 py-10 text-center text-white">
          <h2 className="text-4xl font-extrabold">모드 선택</h2>
          <p className="mt-3 text-lg text-slate-200">
            사용할 화면을 선택해 서비스를 시작하세요.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border-4 border-slate-900 bg-white p-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 text-slate-600">
              <GraduationCap size={32} />
            </div>

            <h3 className="text-4xl font-extrabold text-slate-900">학생 모드</h3>
            <p className="mt-5 text-lg leading-9 text-slate-500">
              AI와 대화하며 학습하고, 개인별 학습 기록을 확인합니다.
            </p>

            <div className="mt-8 flex gap-3">
              <Link
                to="/auth?mode=STUDENT"
                className="rounded-xl bg-slate-900 px-5 py-3 text-white"
              >
                로그인
              </Link>
              <Link
                to="/signup?mode=STUDENT"
                className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800"
              >
                회원가입
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border-4 border-slate-900 bg-white p-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 text-slate-600">
              <School size={32} />
            </div>

            <h3 className="text-4xl font-extrabold text-slate-900">교사 모드</h3>
            <p className="mt-5 text-lg leading-9 text-slate-500">
              학생 대화 로그와 학습 현황을 확인하고 관리합니다.
            </p>

            <div className="mt-8 flex gap-3">
              <Link
                to="/auth?mode=TEACHER"
                className="rounded-xl bg-slate-900 px-5 py-3 text-white"
              >
                로그인
              </Link>
              <Link
                to="/signup?mode=TEACHER"
                className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800"
              >
                회원가입
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}