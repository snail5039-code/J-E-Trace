import { useNavigate } from "react-router-dom";

export default function SignupSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-16">
      
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
        
        {/* 타이틀 */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-gray-800">
            회원가입 유형 선택
          </h1>
          <p className="text-sm text-gray-500">
            사용할 계정 유형을 선택해주세요
          </p>
        </div>

        {/* 선택 카드 영역 */}
        <div className="space-y-4">

          {/* 학생 카드 */}
          <button
            onClick={() => navigate("/signup/student")}
            className="w-full p-5 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 transition-all text-left group"
          >
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-800 group-hover:text-blue-600">
                학생
              </span>
              <span className="text-sm text-gray-500">
                과제를 수행하고 AI 도움을 받아 학습합니다
              </span>
            </div>
          </button>

          {/* 교사 카드 */}
          <button
            disabled
            className="w-full p-5 rounded-xl border border-gray-200 bg-gray-100 text-left cursor-not-allowed"
          >
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-400">
                교사
              </span>
              <span className="text-sm text-gray-400">
                과제를 생성하고 학생 활동을 분석합니다 (준비중)
              </span>
            </div>
          </button>

        </div>

      </div>

    </div>
  );
}