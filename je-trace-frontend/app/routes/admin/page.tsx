import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "~/lib/axios";

type PendingTeacher = {
  loginId: string;
  email: string;
  name: string;
  approved: boolean;
  subject: string;
  managedClasses: string;
  createdAt: string;
};

type TeacherProfileChangeRequest = {
  id: number;
  loginId: string;
  name: string;
  subject: string;
  managedClasses: string;
  status: string;
  requestedAt: string;
};

export default function AdminPage() {
  const navigate = useNavigate();

  const loginId =
    typeof window !== "undefined" ? localStorage.getItem("loginId") ?? "" : "";
  const loginRole =
    typeof window !== "undefined" ? localStorage.getItem("loginRole") ?? "" : "";

  const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
  const [changeRequests, setChangeRequests] = useState<TeacherProfileChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingTeacherId, setProcessingTeacherId] = useState<string | null>(null);
  const [processingChangeId, setProcessingChangeId] = useState<number | null>(null);

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

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [teacherResponse, changeResponse] = await Promise.all([
        api.get("/admin/teachers/pending"),
        api.get("/admin/teacher-profile-changes/pending"),
      ]);

      setTeachers(teacherResponse.data ?? []);
      setChangeRequests(changeResponse.data ?? []);
    } catch (error) {
      console.error("관리자 데이터 조회 실패:", error);
      alert("관리자 데이터 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginRole === "ADMIN") {
      fetchAdminData();
    }
  }, [loginRole]);

  const handleApproveTeacher = async (targetLoginId: string) => {
    try {
      setProcessingTeacherId(targetLoginId);
      await api.post(`/admin/teachers/${targetLoginId}/approve`);
      alert("교사 승인 완료");
      await fetchAdminData();
    } catch (error) {
      console.error("교사 승인 실패:", error);
      alert("교사 승인 실패");
    } finally {
      setProcessingTeacherId(null);
    }
  };

  const handleApproveChange = async (id: number) => {
    try {
      setProcessingChangeId(id);
      await api.post(`/admin/teacher-profile-changes/${id}/approve`);
      alert("교사 정보 수정 승인 완료");
      await fetchAdminData();
    } catch (error) {
      console.error("교사 정보 수정 승인 실패:", error);
      alert("교사 정보 수정 승인 실패");
    } finally {
      setProcessingChangeId(null);
    }
  };

  const handleRejectChange = async (id: number) => {
    try {
      setProcessingChangeId(id);
      await api.post(`/admin/teacher-profile-changes/${id}/reject`);
      alert("교사 정보 수정 반려 완료");
      await fetchAdminData();
    } catch (error) {
      console.error("교사 정보 수정 반려 실패:", error);
      alert("교사 정보 수정 반려 실패");
    } finally {
      setProcessingChangeId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loginId");
    localStorage.removeItem("loginName");
    localStorage.removeItem("loginRole");
    localStorage.removeItem("className");
    localStorage.removeItem("subject");
    localStorage.removeItem("managedClasses");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border-4 border-slate-900 bg-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">ADMIN</p>
              <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
                교사 승인 관리
              </h1>
              <p className="mt-2 text-slate-500">
                신규 교사 승인과 교사 정보 수정 승인/반려를 처리합니다.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-5 py-3 text-white"
            >
              로그아웃
            </button>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">신규 교사 승인</h2>
            <p className="mt-2 text-sm text-slate-500">
              회원가입 후 승인 대기 중인 교사 목록입니다.
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-300">
              <div className="grid grid-cols-[140px_1.4fr_1fr_1fr_1fr_160px] bg-slate-900 text-sm font-semibold text-white">
                <div className="px-4 py-3">아이디</div>
                <div className="px-4 py-3">이메일</div>
                <div className="px-4 py-3">이름</div>
                <div className="px-4 py-3">과목</div>
                <div className="px-4 py-3">관리 반</div>
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
                    className="grid grid-cols-[140px_1.4fr_1fr_1fr_1fr_160px] border-t border-slate-200 text-sm"
                  >
                    <div className="px-4 py-4">{teacher.loginId}</div>
                    <div className="px-4 py-4">{teacher.email}</div>
                    <div className="px-4 py-4">{teacher.name}</div>
                    <div className="px-4 py-4">{teacher.subject || "-"}</div>
                    <div className="px-4 py-4">
                      {teacher.managedClasses
                        ? teacher.managedClasses
                            .split(",")
                            .map((value) => `${value.trim()}반`)
                            .join(", ")
                        : "-"}
                    </div>
                    <div className="flex items-center justify-center px-4 py-4">
                      <button
                        onClick={() => handleApproveTeacher(teacher.loginId)}
                        disabled={processingTeacherId === teacher.loginId}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
                      >
                        {processingTeacherId === teacher.loginId ? "처리 중..." : "승인"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">교사 정보 수정 요청</h2>
            <p className="mt-2 text-sm text-slate-500">
              교사가 요청한 이름, 담당 과목, 관리 반 수정 요청입니다.
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-300">
              <div className="grid grid-cols-[100px_140px_1fr_1fr_1fr_1fr_220px] bg-slate-900 text-sm font-semibold text-white">
                <div className="px-4 py-3">요청 ID</div>
                <div className="px-4 py-3">아이디</div>
                <div className="px-4 py-3">이름</div>
                <div className="px-4 py-3">과목</div>
                <div className="px-4 py-3">관리 반</div>
                <div className="px-4 py-3">요청일</div>
                <div className="px-4 py-3 text-center">처리</div>
              </div>

              {loading ? (
                <div className="px-4 py-8 text-center text-slate-500">불러오는 중...</div>
              ) : changeRequests.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500">
                  승인 대기 중인 정보 수정 요청이 없습니다.
                </div>
              ) : (
                changeRequests.map((request) => (
                  <div
                    key={request.id}
                    className="grid grid-cols-[100px_140px_1fr_1fr_1fr_1fr_220px] border-t border-slate-200 text-sm"
                  >
                    <div className="px-4 py-4">{request.id}</div>
                    <div className="px-4 py-4">{request.loginId}</div>
                    <div className="px-4 py-4">{request.name}</div>
                    <div className="px-4 py-4">{request.subject}</div>
                    <div className="px-4 py-4">
                      {request.managedClasses
                        .split(",")
                        .map((value) => `${value.trim()}반`)
                        .join(", ")}
                    </div>
                    <div className="px-4 py-4">{request.requestedAt}</div>
                    <div className="flex items-center justify-center gap-2 px-4 py-4">
                      <button
                        onClick={() => handleApproveChange(request.id)}
                        disabled={processingChangeId === request.id}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleRejectChange(request.id)}
                        disabled={processingChangeId === request.id}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-white disabled:opacity-60"
                      >
                        반려
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}