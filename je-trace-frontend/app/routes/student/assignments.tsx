import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

type Assignment = {
    id: number;
    title: string;
    description: string;
    dueDate: string;
};

export default function AssignmentsPage() {
    const assignments: Assignment[] = [
        {
            id: 1,
            title: "자바 컬렉션 정리",
            description: "List, Set, Map의 차이와 사용 예시 정리",
            dueDate: "2026-04-10",
        },
        {
            id: 2,
            title: "운영체제 프로세스",
            description: "프로세스와 스레드 차이 설명",
            dueDate: "2026-04-12",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">


            {/* 본문 */}
            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* 페이지 타이틀 */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            과제 목록
                        </h1>
                        <p className="text-slate-500 mt-2">
                            진행 중인 과제를 확인하고 학습을 이어가세요.
                        </p>
                    </div>

                    {/* 🔹 개선된 버튼 */}
                    <Link
                        to="/student"
                        className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-blue-600 hover:shadow-md"
                    >
                        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                        학생 페이지
                    </Link>
                </div>

                {/* 과제 리스트 */}
                <div className="grid md:grid-cols-2 gap-6">

                    {assignments.map((assignment) => {
                        const isUrgent =
                            new Date(assignment.dueDate).getTime() -
                            new Date().getTime() <
                            3 * 24 * 60 * 60 * 1000;

                        return (
                            <Link
                                key={assignment.id}
                                to={`/student/assignment/${assignment.id}`}
                            >
                                <div className="group h-full rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                                    {/* 상태 뱃지 */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-medium text-slate-400">
                                            과제
                                        </span>

                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${isUrgent
                                                ? "bg-red-100 text-red-500"
                                                : "bg-blue-100 text-blue-500"
                                                }`}
                                        >
                                            {isUrgent ? "마감 임박" : "진행 중"}
                                        </span>
                                    </div>

                                    {/* 제목 */}
                                    <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition">
                                        {assignment.title}
                                    </h2>

                                    {/* 설명 */}
                                    <p className="mt-3 text-sm text-slate-500 line-clamp-2">
                                        {assignment.description}
                                    </p>

                                    {/* 하단 */}
                                    <div className="mt-6 flex justify-between items-center text-sm">

                                        <span className="text-slate-400">
                                            마감일
                                        </span>

                                        <span className="font-medium text-slate-700">
                                            {assignment.dueDate}
                                        </span>
                                    </div>

                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}