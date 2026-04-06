import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("student", "routes/student/page.tsx"),
  route("student/assignments", "routes/student/assignments.tsx"),
  route("student/assignment/:assignmentId", "routes/student/assignmentDetail.tsx"),
  route("teacher", "routes/teacher/page.tsx"),
];  