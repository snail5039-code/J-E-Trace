import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import api from "~/lib/axios";

const CLASS_OPTIONS = ["A", "B", "C", "D"];

type TeacherProfileResponse = {
    loginId: string;
    name: string;
    email: string;
    subject: string;
    managedClasses: string;
};

export default function TeacherProfilePage() {
    const navigate = useNavigate();

    const loginId =
        typeof window !== "undefined" ? localStorage.getItem("loginId") ?? "" : "";
    const loginRole =
        typeof window !== "undefined" ? localStorage.getItem("loginRole") ?? "" : "";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [managedClasses, setManagedClasses] = useState<string[]>([]);

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                const response = await api.get<TeacherProfileResponse>("/teacher/profile", {
                    params: { loginId },
                });

                const data = response.data;
                setName(data.name ?? "");
                setEmail(data.email ?? "");
                setSubject(data.subject ?? "");
                setManagedClasses(
                    (data.managedClasses ?? "")
                        .split(",")
                        .map((value) => value.trim())
                        .filter(Boolean)
                );
            } catch (error) {
                console.error("교사 회원정보 조회 실패:", error);
                alert("교사 회원정보 조회 실패");
            } finally {
                setLoading(false);
            }
        };

        if (loginId && loginRole === "TEACHER") {
            fetchProfile();
        }
    }, [loginId, loginRole]);

    const managedClassText = useMemo(() => {
        if (managedClasses.length === 0) return "-";
        return managedClasses.map((value) => `${value}반`).join(", ");
    }, [managedClasses]);

    const toggleClass = (value: string) => {
        setManagedClasses((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("이름을 입력하세요.");
            return;
        }

        if (!subject.trim()) {
            alert("담당 과목을 입력하세요.");
            return;
        }

        if (managedClasses.length === 0) {
            alert("관리 반을 하나 이상 선택하세요.");
            return;
        }

        try {
            setSaving(true);

            await api.post("/teacher/profile/change-request", {
                loginId,
                name,
                subject,
                managedClasses: managedClasses.join(","),
            });

            alert("정보 수정 요청이 등록되었습니다. 관리자 승인 후 반영됩니다.");
            navigate("/teacher");
        } catch (error: any) {
            console.error("교사 회원정보 수정 요청 실패:", error);
            alert(error?.response?.data?.message || "교사 회원정보 수정 요청 실패");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-6 py-10">
            <div className="mx-auto max-w-4xl">
                <div className="rounded-3xl border-4 border-slate-900 bg-white p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">TEACHER</p>
                            <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
                                회원정보 수정
                            </h1>
                            <p className="mt-2 text-slate-500">
                                담당 과목과 관리 반 수정은 관리자 승인 후 반영됩니다.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/teacher")}
                            className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800"
                        >
                            대시보드로
                        </button>
                    </div>

                    {loading ? (
                        <div className="mt-10 text-center text-slate-500">불러오는 중...</div>
                    ) : (
                        <div className="mt-8 space-y-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        로그인 아이디
                                    </label>
                                    <input
                                        value={loginId}
                                        disabled
                                        className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        이메일
                                    </label>
                                    <input
                                        value={email}
                                        disabled
                                        className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    이름
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none"
                                    placeholder="이름 입력"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    담당 과목
                                </label>
                                <input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none"
                                    placeholder="담당 과목 입력"
                                />
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-semibold text-slate-700">
                                    관리 반
                                </label>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                    {CLASS_OPTIONS.map((option) => {
                                        const checked = managedClasses.includes(option);

                                        return (
                                            <label
                                                key={option}
                                                className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition ${checked
                                                        ? "border-slate-900 bg-slate-900 text-white"
                                                        : "border-slate-300 bg-white text-slate-800"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleClass(option)}
                                                    className="hidden"
                                                />
                                                {option}반
                                            </label>
                                        );
                                    })}
                                </div>
                                <p className="mt-3 text-sm text-slate-500">
                                    현재 선택: {managedClassText}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="rounded-xl bg-slate-900 px-5 py-3 text-white disabled:opacity-60"
                                >
                                    {saving ? "요청 등록 중..." : "수정 요청하기"}
                                </button>

                                <button
                                    onClick={() => navigate("/teacher")}
                                    className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}