import { ArrowLeft, FilePlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function TeacherCreateTaskPage() {
  const navigate = useNavigate();

  const loginId =
    typeof window !== "undefined" ? localStorage.getItem("loginId") ?? "" : "";
  const loginRole =
    typeof window !== "undefined" ? localStorage.getItem("loginRole") ?? "" : "";
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
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">과제 등록</h1>
            <p className="text-sm text-slate-500">
              새로운 과제를 생성합니다.
            </p>
          </div>

          <button
            onClick={() => navigate("/teacher")}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            목록으로
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">

          {/* SIDEBAR */}
          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold">
                T
              </div>
              <p className="mt-3 font-semibold text-slate-900">
                {teacherName || "교사"}
              </p>
              <p className="text-sm text-slate-500">
                {teacherSubject || "과목 미설정"}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => navigate("/teacher")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft size={16} />
                과제 목록
              </button>

              <button className="flex w-full items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                <FilePlus2 size={16} />
                과제 등록
              </button>
            </div>
          </aside>

          {/* MAIN */}
          <main className="space-y-6">

            {/* FORM */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b px-5 py-4 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900">
                  새 과제 정보 입력
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  과제 기본 정보를 설정하세요.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                <div className="overflow-hidden rounded-lg border border-slate-200">

                  {/* 과제명 */}
                  <div className="grid md:grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 border-r">
                      과제명
                    </div>
                    <div className="px-4 py-3">
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* 반 */}
                  <div className="grid md:grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 border-r">
                      대상 반
                    </div>
                    <div className="px-4 py-3">
                      <select
                        name="className"
                        value={form.className}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        required
                      >
                        <option value="">반 선택</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>

                  {/* 설명 */}
                  <div className="grid md:grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 border-r">
                      과제 설명
                    </div>
                    <div className="px-4 py-3">
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={6}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* 마감일 */}
                  <div className="grid md:grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 border-r">
                      마감일
                    </div>
                    <div className="px-4 py-3">
                      <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* AI 허용 */}
                  <div className="grid md:grid-cols-[180px_1fr]">
                    <div className="bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 border-r">
                      AI 사용
                    </div>
                    <div className="px-4 py-3">
                      <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                        <span className="text-sm text-slate-800">
                          AI 사용 허용
                        </span>
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

                {/* 버튼 */}
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/teacher")}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    취소
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    <FilePlus2 size={16} />
                    등록
                  </button>
                </div>
              </form>
            </section>

            {/* 안내 */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b px-5 py-3 bg-slate-50 text-sm font-semibold text-slate-800">
                안내
              </div>
              <div className="px-5 py-4 text-sm text-slate-600 space-y-1">
                <p>• 반과 마감일은 필수입니다.</p>
                <p>• AI 허용 시 로그 및 분석 기능 활성화됩니다.</p>
                <p>• 제출 후 결과는 관리 페이지에서 확인 가능합니다.</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}