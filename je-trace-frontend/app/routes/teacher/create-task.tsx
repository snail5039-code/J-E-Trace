import { ArrowLeft, FilePlus2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function TeacherCreateTaskPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    className: "",
    description: "",
    dueDate: "",
    aiAllowed: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/teacher/tasks", {
        title: form.title,
        className: form.className,
        description: form.description,
        dueDate: form.dueDate,
        aiAllowed: form.aiAllowed,
      });

      alert("과제 등록 완료");
      navigate("/teacher");
    } catch (error) {
      console.error("과제 등록 실패:", error);
      alert("과제 등록 실패");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef1f5] text-slate-800">
      <div className="border-b border-slate-300 bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">교사용 관리 시스템</p>
            <h1 className="mt-1 text-2xl font-bold">과제 등록</h1>
          </div>

          <button
            onClick={() => navigate("/teacher")}
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
                <ArrowLeft size={18} />
                과제 목록으로
              </button>

              <button className="flex w-full items-center gap-3 rounded-sm bg-white/10 px-4 py-3 text-left text-sm font-medium text-white">
                <FilePlus2 size={18} />
                과제 등록
              </button>
            </div>
          </aside>

          <main className="space-y-5">
            <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  새 과제 정보 입력
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  과제명, 대상 반, 마감일, AI 허용 여부를 설정하세요.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                <div className="overflow-hidden border border-slate-300">
                  <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="border-b border-r border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                      과제명
                    </div>
                    <div className="border-b border-slate-300 px-4 py-3">
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="예: 정보처리기사 서술형 정리 과제"
                        className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                        required
                      />
                    </div>

                    <div className="border-b border-r border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                      대상 반
                    </div>
                    <div className="border-b border-slate-300 px-4 py-3">
                      <select
                        name="className"
                        value={form.className}
                        onChange={handleChange}
                        className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                        required
                      >
                        <option value="">반을 선택하세요</option>
                        <option value="1학년 2반">1학년 2반</option>
                        <option value="1학년 3반">1학년 3반</option>
                        <option value="2학년 1반">2학년 1반</option>
                        <option value="2학년 2반">2학년 2반</option>
                      </select>
                    </div>

                    <div className="border-b border-r border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                      과제 설명
                    </div>
                    <div className="border-b border-slate-300 px-4 py-3">
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={8}
                        placeholder="과제 목적, 작성 방식, 제출 형식 등을 입력하세요."
                        className="w-full resize-none border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                      />
                    </div>

                    <div className="border-b border-r border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                      마감일
                    </div>
                    <div className="border-b border-slate-300 px-4 py-3">
                      <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                        required
                      />
                    </div>

                    <div className="border-r border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                      AI 사용 허용
                    </div>
                    <div className="px-4 py-3">
                      <label className="flex items-center justify-between gap-4 border border-slate-300 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            학생 AI 사용 허용
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            과제 수행 중 AI 질문 및 답변 기능 사용 허용 여부
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name="aiAllowed"
                          checked={form.aiAllowed}
                          onChange={handleChange}
                          className="h-5 w-5"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/teacher")}
                    className="border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    취소
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <FilePlus2 size={16} />
                    과제 등록
                  </button>
                </div>
              </form>
            </section>

            <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-300 bg-[#f7f2c8] px-5 py-3 text-sm font-semibold text-slate-800">
                등록 안내
              </div>
              <div className="px-5 py-4 text-sm leading-7 text-slate-700">
                <p>1. 과제 등록 시 대상 반과 마감일을 반드시 설정하세요.</p>
                <p>2. AI 사용 허용 시 학생 질문/응답 로그 및 유사도 분석 기능이 활성화됩니다.</p>
                <p>3. 추후 제출 현황 페이지에서 학생별 제출물과 분석 결과를 확인할 수 있습니다.</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}