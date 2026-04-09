import { useState } from "react";
import { useNavigate } from "react-router";

export default function StudentSignupPage() {
  const [form, setForm] = useState({
    login_id: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    className: "",
  });

  const [idChecked, setIdChecked] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "login_id") {
      setIdChecked(false);
      setIdAvailable(false);
    }
  };

  const checkDuplicate = async () => {
    if (!form.login_id) {
      alert("아이디를 입력하세요");
      return;
    }

    const res = await fetch(`http://localhost:8080/api/users/check-id?loginId=${form.login_id}`);
    const data = await res.json();

    setIdChecked(true);
    setIdAvailable(data.available);

    if (data.available) alert("사용 가능한 아이디");
    else alert("이미 존재하는 아이디입니다.");
  };

  const handleSubmit = async () => {
    if (!form.login_id || !form.email || !form.password || !form.name || !form.className) {
      alert("모든 값을 입력해주세요");
      return;
    }

    if (!idChecked || !idAvailable) {
      alert("아이디 중복체크를 완료해주세요");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          loginId: form.login_id,
          email: form.email,
          password: form.password,
          name: form.name,
          className: form.className,
          role: "STUDENT"
        })
      });

      if (!res.ok) throw new Error();

      alert("회원가입 완료\n교사 승인 후 과제 확인이 가능합니다.");
      navigate("/login/student");
    } catch {
      alert("회원가입 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-12">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          학생 회원가입
        </h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">아이디</label>
            <div className="flex gap-2">
              <input
                name="login_id"
                value={form.login_id}
                onChange={handleChange}
                className="flex-1 border border-gray-200 px-3 py-2 rounded-lg text-gray-800"
              />
              <button
                onClick={checkDuplicate}
                className="px-3 bg-blue-500 text-white rounded-lg text-sm"
              >
                중복체크
              </button>
            </div>
          </div>

          <input
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
          />

          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
          />

          <input
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
          />

          <input
            name="className"
            placeholder="반 이름 (예: 1학년 2반)"
            value={form.className}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-gray-800"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}