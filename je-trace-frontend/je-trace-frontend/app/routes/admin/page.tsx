import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "~/lib/axios";

type PendingTeacher = {
  loginId: string;
  email: string;
  name: string;
  approved: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const navigate = useNavigate();

  const loginId =
    typeof window !== "undefined" ? localStorage.getItem("loginId") ?? "" : "";
  const loginRole =
    typeof window !== "undefined" ? localStorage.getItem("loginRole") ?? "" : "";

  const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loginId) {
      alert("로그인이 필요합니다.");
      navigate("/auth?mode=ADMIN");
      return;
    }

    if (loginRole !== "ADMIN") {
      alert("관리자 계정만 접근할 수 있습니다.");
      navigate("/");
      return;
    }
  }, [loginId, loginRole, navigate]);

  const fetchPendingTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/teachers/pending");
      setTeachers(response.data ?? []);
    } catch (error) {
      console.error("교사 승인 목록 조회 실패:", error);
      alert("교사 승인 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginRole === "ADMIN") {
      fetchPendingTeachers();
    }
  }, [loginRole]);

  const handleApprove = async (targetLoginId: string) => {
    try {
      setProcessingId(targetLoginId);
      await api.post(`/admin/teachers/${targetLoginId}/approve`);
      alert("교사 승인 완료");
      await fetchPendingTeachers();
    } catch (error) {
      console.error("교사 승인 실패:", error);
      alert("교사 승인 실패");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border-4 border-slate-900 bg-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">ADMIN</p>
              <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
                교사 승인 관리
              </h1>
              <p className="mt-2 text-slate-500">
                승인 대기 중인 교사 계정을 확인하고 승인합니다.
              </p>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("loginId");
                localStorage.removeItem("loginName");
                localStorage.removeItem("loginRole");
                localStorage.removeItem("className");
                navigate("/");
              }}
              className="rounded-xl bg-slate-900 px-5 py-3 text-white"
            >
              로그아웃
            </button>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-300">
            <div className="grid grid-cols-[160px_1.4fr_1fr_1fr_160px] bg-slate-900 text-sm font-semibold text-white">
              <div className="px-4 py-3">아이디</div>
              <div className="px-4 py-3">이메일</div>
              <div className="px-4 py-3">이름</div>
              <div className="px-4 py-3">가입일</div>
              <div className="px-4 py-3 text-center">승인</div>
            </div>

            {loading ? (
              <div className="px-4 py-8 text-center text-slate-500">불러오는 중...</div>
            ) : teachers.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500">
                승인 대기 중인 교사가 없습니다.
              </div>
            ) : (
              teachers.map((teacher) => (
                <div
                  key={teacher.loginId}
                  className="grid grid-cols-[160px_1.4fr_1fr_1fr_160px] border-t border-slate-200 text-sm"
                >
                  <div className="px-4 py-4">{teacher.loginId}</div>
                  <div className="px-4 py-4">{teacher.email}</div>
                  <div className="px-4 py-4">{teacher.name}</div>
                  <div className="px-4 py-4">{teacher.createdAt}</div>
                  <div className="flex items-center justify-center px-4 py-4">
                    <button
                      onClick={() => handleApprove(teacher.loginId)}
                      disabled={processingId === teacher.loginId}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
                    >
                      {processingId === teacher.loginId ? "처리 중..." : "승인"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}