import { useState } from "react";
import { useNavigate } from "react-router";

export default function StudentLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    if (!form.loginId || !form.password) {
      alert("아이디와 비밀번호를 입력하세요");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await res.json();

      if (!result.success) {
        alert("아이디 또는 비밀번호 오류");
        return;
      }

      localStorage.setItem("studentLoginId", result.loginId ?? "");
      localStorage.setItem("studentName", result.studentName ?? "");
      localStorage.setItem("studentClassName", result.className ?? "");
      localStorage.setItem("studentRole", result.role ?? "");

      if (!result.className) {
        alert("로그인 성공\n아직 교사 승인 전입니다.");
      } else {
        alert("로그인 성공");
      }

      navigate("/student");

    } catch {
      alert("로그인 실패");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow space-y-4">
        <h1 className="text-lg font-bold text-center text-slate-800">
          학생 로그인
        </h1>

        <input
          name="loginId"
          placeholder="아이디"
          value={form.loginId}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg text-slate-800"
        />

        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg text-slate-800"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          로그인
        </button>
      </div>
    </div>
  );
}