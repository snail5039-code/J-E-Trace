package com.jetrace.backend.teacherService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jetrace.backend.teacherDao.TaskDao;
import com.jetrace.backend.teacherDto.AiJudgeResult;
import com.jetrace.backend.teacherDto.SimilarityResponse;
import com.jetrace.backend.teacherDto.StudentRequestResponse;
import com.jetrace.backend.teacherDto.StudentResponse;
import com.jetrace.backend.teacherDto.StudentTaskScoreResponse;
import com.jetrace.backend.teacherDto.TaskAiLogResponse;
import com.jetrace.backend.teacherDto.TaskCreateRequest;
import com.jetrace.backend.teacherDto.TaskResponse;
import com.jetrace.backend.teacherDto.TaskSubmissionResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskDao taskDao;
    private final AiJudgeService aiJudgeService;

    @Transactional
    public void createTask(TaskCreateRequest request) {
        validateTaskCreateRequest(request);

        if (request.getDueDate() != null) {
            request.setDueDate(request.getDueDate().replace("T", " "));
        }

        taskDao.insertTask(request);

        List<String> studentNames = taskDao.findStudentNamesByClassName(request.getClassName());
        for (String studentName : studentNames) {
            taskDao.insertTaskSubmissionIfNotExists(request.getId(), studentName);
        }
    }

    public List<TaskResponse> getTaskList() {
        return taskDao.findAllTasks();
    }

    public TaskResponse getTaskDetail(Long taskId) {
        TaskResponse task = taskDao.findTaskById(taskId);

        if (task == null) {
            throw new RuntimeException("과제 정보를 찾을 수 없습니다.");
        }

        return task;
    }

    public List<TaskSubmissionResponse> getTaskSubmissions(Long taskId) {
        TaskResponse task = taskDao.findTaskById(taskId);

        if (task == null) {
            throw new RuntimeException("과제 정보를 찾을 수 없습니다.");
        }

        return taskDao.findTaskSubmissionsByTaskId(taskId);
    }

    public List<TaskAiLogResponse> getTaskAiLogs(Long taskId, String studentName) {
        if (studentName == null || studentName.isBlank()) {
            throw new RuntimeException("학생명이 필요합니다.");
        }

        return taskDao.findTaskAiLogsByTaskIdAndStudentName(taskId, studentName);
    }

    public List<StudentRequestResponse> getPendingStudentRequests() {
        return taskDao.findPendingStudentRequests();
    }

    @Transactional
    public void approveStudentRequest(Long requestId) {
        StudentRequestResponse request = taskDao.findStudentRequestById(requestId);

        if (request == null) {
            throw new RuntimeException("학생 신청 정보를 찾을 수 없습니다.");
        }

        if ("APPROVED".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("이미 승인된 신청입니다.");
        }

        if ("REJECTED".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("이미 거절된 신청입니다.");
        }

        int studentCount = taskDao.countStudentByNameAndClassName(
                request.getStudentName(),
                request.getClassName()
        );

        if (studentCount > 0) {
            taskDao.approveStudentRequest(requestId);
            syncStudentSubmissionsByClass(request.getStudentName(), request.getClassName());
            return;
        }

        taskDao.approveStudentRequest(requestId);
        taskDao.insertApprovedStudent(request);
        syncStudentSubmissionsByClass(request.getStudentName(), request.getClassName());
    }

    public void rejectStudentRequest(Long requestId) {
        StudentRequestResponse request = taskDao.findStudentRequestById(requestId);

        if (request == null) {
            throw new RuntimeException("학생 신청 정보를 찾을 수 없습니다.");
        }

        if ("APPROVED".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("이미 승인된 신청은 거절할 수 없습니다.");
        }

        if ("REJECTED".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("이미 거절된 신청입니다.");
        }

        taskDao.rejectStudentRequest(requestId);
    }

    public List<StudentResponse> getStudentList() {
        return taskDao.findAllStudents();
    }

    public StudentResponse getStudentDetail(Long studentId) {
        StudentResponse student = taskDao.findStudentById(studentId);

        if (student == null) {
            throw new RuntimeException("학생 정보를 찾을 수 없습니다.");
        }

        return student;
    }

    @Transactional
    public void updateStudentInfo(Long studentId, StudentResponse request) {
        StudentResponse currentStudent = taskDao.findStudentById(studentId);

        if (currentStudent == null) {
            throw new RuntimeException("학생 정보를 찾을 수 없습니다.");
        }

        if (request.getStudentName() == null || request.getStudentName().isBlank()) {
            throw new RuntimeException("학생명을 입력해주세요.");
        }

        if (request.getClassName() == null || request.getClassName().isBlank()) {
            throw new RuntimeException("반 정보를 입력해주세요.");
        }

        int duplicateCount = taskDao.countOtherStudentByNameAndClassName(
                studentId,
                request.getStudentName(),
                request.getClassName()
        );

        if (duplicateCount > 0) {
            throw new RuntimeException("같은 반에 동일한 학생명이 이미 존재합니다.");
        }

        String oldStudentName = currentStudent.getStudentName();
        String newStudentName = request.getStudentName();

        request.setId(studentId);
        taskDao.updateStudentInfo(request);

        if (!oldStudentName.equals(newStudentName)) {
            taskDao.updateTaskSubmissionStudentName(oldStudentName, newStudentName);
            taskDao.updateTaskAiLogStudentName(oldStudentName, newStudentName);
            taskDao.updateSimilarityStudentName(oldStudentName, newStudentName);
            taskDao.updateSimilarityTargetName(oldStudentName, newStudentName);
            taskDao.updateStudentRequestStudentName(oldStudentName, newStudentName);
        }

        syncStudentSubmissionsByClass(request.getStudentName(), request.getClassName());
        taskDao.syncStudentFinalScore(studentId);
    }

    public List<StudentTaskScoreResponse> getStudentTaskScores(Long studentId) {
        StudentResponse student = taskDao.findStudentById(studentId);

        if (student == null) {
            throw new RuntimeException("학생 정보를 찾을 수 없습니다.");
        }

        return taskDao.findStudentTaskScoresByStudentName(student.getStudentName());
    }

    @Transactional
    public void updateStudentTaskScore(Long studentId, Long submissionId, Integer score) {
        StudentResponse student = taskDao.findStudentById(studentId);

        if (student == null) {
            throw new RuntimeException("학생 정보를 찾을 수 없습니다.");
        }

        TaskSubmissionResponse submission = taskDao.findTaskSubmissionDetailById(submissionId);

        if (submission == null) {
            throw new RuntimeException("제출 정보를 찾을 수 없습니다.");
        }

        if (!student.getStudentName().equals(submission.getStudentName())) {
            throw new RuntimeException("해당 학생의 제출 정보가 아닙니다.");
        }

        validateScore(score);

        taskDao.updateTaskSubmissionScore(submissionId, score);
        taskDao.syncStudentFinalScore(studentId);
    }

    public TaskSubmissionResponse getTaskSubmissionDetail(Long submissionId) {
        TaskSubmissionResponse submission = taskDao.findTaskSubmissionDetailById(submissionId);

        if (submission == null) {
            throw new RuntimeException("제출 정보를 찾을 수 없습니다.");
        }

        SimilarityResponse topStudentSimilarity = taskDao.findTopStudentSimilarity(
                submission.getTaskId(),
                submission.getStudentName()
        );

        SimilarityResponse aiLogSimilarity = taskDao.findAiLogSimilarity(
                submission.getTaskId(),
                submission.getStudentName()
        );

        if (topStudentSimilarity != null) {
            submission.setTopStudentSimilarity(topStudentSimilarity.getSimilarity());
            submission.setTopStudentTargetName(topStudentSimilarity.getTargetName());
            submission.setTopStudentJudge(topStudentSimilarity.getJudge());
            submission.setTopStudentReason(topStudentSimilarity.getReason());
        }

        if (aiLogSimilarity != null) {
            submission.setAiLogSimilarity(aiLogSimilarity.getSimilarity());
            submission.setAiLogJudge(aiLogSimilarity.getJudge());
            submission.setAiLogReason(aiLogSimilarity.getReason());
        }

        return submission;
    }

    @Transactional
    public void updateTaskSubmissionEvaluation(Long submissionId, TaskSubmissionResponse request) {
        TaskSubmissionResponse submission = taskDao.findTaskSubmissionDetailById(submissionId);

        if (submission == null) {
            throw new RuntimeException("제출 정보를 찾을 수 없습니다.");
        }

        validateScore(request.getScore());

        taskDao.updateTaskSubmissionEvaluation(
                submissionId,
                request.getScore(),
                request.getTeacherComment()
        );

        StudentResponse student = findStudentByName(submission.getStudentName());
        if (student != null) {
            taskDao.syncStudentFinalScore(student.getId());
        }
    }

    @Transactional
    public void runSimilarityAnalysis(Long taskId) {
        TaskResponse task = taskDao.findTaskById(taskId);

        if (task == null) {
            throw new RuntimeException("과제 정보를 찾을 수 없습니다.");
        }

        List<TaskSubmissionResponse> submissions = taskDao.findTaskSubmissionsByTaskId(taskId);

        taskDao.deleteSimilarityResultsByTaskId(taskId);
        taskDao.clearTaskSubmissionResults(taskId);

        List<TaskSubmissionResponse> submittedList = submissions.stream()
                .filter(s -> Boolean.TRUE.equals(s.getSubmitted()))
                .filter(s -> s.getContent() != null && !s.getContent().isBlank())
                .collect(Collectors.toList());

        Map<String, List<SimilarityResponse>> studentResultMap = new HashMap<>();

        for (int i = 0; i < submittedList.size(); i++) {
            TaskSubmissionResponse a = submittedList.get(i);
            List<TaskAiLogResponse> aLogs =
                    taskDao.findTaskAiLogsByTaskIdAndStudentName(taskId, a.getStudentName());

            for (int j = i + 1; j < submittedList.size(); j++) {
                TaskSubmissionResponse b = submittedList.get(j);

                int similarity = calculateSimilarity(a.getContent(), b.getContent());

                AiJudgeResult aiDecision = aiJudgeService.judge(
                        "STUDENT_TO_STUDENT",
                        a.getStudentName(),
                        b.getStudentName(),
                        a.getContent(),
                        b.getContent(),
                        similarity,
                        aLogs
                );

                SimilarityResponse result = new SimilarityResponse(
                        null,
                        taskId,
                        null,
                        a.getStudentName(),
                        b.getStudentName(),
                        "STUDENT_TO_STUDENT",
                        similarity,
                        aiDecision.getJudge(),
                        aiDecision.getReason(),
                        a.getContent(),
                        b.getContent(),
                        null
                );

                taskDao.insertSimilarityResult(result);

                studentResultMap.computeIfAbsent(a.getStudentName(), k -> new ArrayList<>()).add(result);
                studentResultMap.computeIfAbsent(b.getStudentName(), k -> new ArrayList<>()).add(
                        new SimilarityResponse(
                                null,
                                taskId,
                                null,
                                b.getStudentName(),
                                a.getStudentName(),
                                "STUDENT_TO_STUDENT",
                                similarity,
                                aiDecision.getJudge(),
                                aiDecision.getReason(),
                                b.getContent(),
                                a.getContent(),
                                null
                        )
                );
            }

            String mergedAiAnswers = aLogs.stream()
                    .map(TaskAiLogResponse::getAnswer)
                    .filter(Objects::nonNull)
                    .filter(answer -> !answer.isBlank())
                    .collect(Collectors.joining("\n"));

            if (!mergedAiAnswers.isBlank()) {
                int similarity = calculateSimilarity(a.getContent(), mergedAiAnswers);

                AiJudgeResult aiDecision = aiJudgeService.judge(
                        "STUDENT_TO_AI_LOG",
                        a.getStudentName(),
                        "AI 응답",
                        a.getContent(),
                        mergedAiAnswers,
                        similarity,
                        aLogs
                );

                SimilarityResponse result = new SimilarityResponse(
                        null,
                        taskId,
                        null,
                        a.getStudentName(),
                        "AI 응답",
                        "STUDENT_TO_AI_LOG",
                        similarity,
                        aiDecision.getJudge(),
                        aiDecision.getReason(),
                        a.getContent(),
                        mergedAiAnswers,
                        null
                );

                taskDao.insertSimilarityResult(result);
                studentResultMap.computeIfAbsent(a.getStudentName(), k -> new ArrayList<>()).add(result);
            }
        }

        for (TaskSubmissionResponse submission : submittedList) {
            List<SimilarityResponse> results =
                    studentResultMap.getOrDefault(submission.getStudentName(), List.of());

            String finalResult = decideFinalSubmissionResult(results);
            taskDao.updateTaskSubmissionResult(taskId, submission.getStudentName(), finalResult);
        }
    }

    public List<SimilarityResponse> getSimilarityResults() {
        return taskDao.findAllSimilarityResults();
    }

    public SimilarityResponse getSimilarityResultDetail(Long similarityId) {
        SimilarityResponse result = taskDao.findSimilarityResultById(similarityId);

        if (result == null) {
            throw new RuntimeException("유사도 분석 결과를 찾을 수 없습니다.");
        }

        return result;
    }

    @Transactional
    public void backfillSystemData() {
        taskDao.backfillMissingTaskSubmissions();
        taskDao.syncAiUsedByLogs();

        List<StudentResponse> students = taskDao.findAllStudents();
        for (StudentResponse student : students) {
            taskDao.syncStudentFinalScore(student.getId());
        }
    }

    private void validateTaskCreateRequest(TaskCreateRequest request) {
        if (request == null) {
            throw new RuntimeException("과제 정보가 없습니다.");
        }

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new RuntimeException("과제명을 입력해주세요.");
        }

        if (request.getClassName() == null || request.getClassName().isBlank()) {
            throw new RuntimeException("반 정보를 입력해주세요.");
        }

        if (request.getDueDate() == null || request.getDueDate().isBlank()) {
            throw new RuntimeException("마감일을 입력해주세요.");
        }
    }

    private void validateScore(Integer score) {
        if (score == null) {
            throw new RuntimeException("점수를 입력해주세요.");
        }

        if (score < 0 || score > 100) {
            throw new RuntimeException("점수는 0점 이상 100점 이하만 가능합니다.");
        }
    }

    private void syncStudentSubmissionsByClass(String studentName, String className) {
        List<Long> taskIds = taskDao.findTaskIdsByClassName(className);

        for (Long taskId : taskIds) {
            taskDao.insertTaskSubmissionIfNotExists(taskId, studentName);
        }
    }

    private StudentResponse findStudentByName(String studentName) {
        return taskDao.findAllStudents().stream()
                .filter(student -> studentName.equals(student.getStudentName()))
                .findFirst()
                .orElse(null);
    }

    private int calculateSimilarity(String textA, String textB) {
        if (textA == null || textB == null || textA.isBlank() || textB.isBlank()) {
            return 0;
        }

        Set<String> setA = Arrays.stream(
                        textA.replaceAll("[^가-힣a-zA-Z0-9 ]", " ")
                                .toLowerCase()
                                .split("\\s+")
                )
                .filter(s -> !s.isBlank())
                .collect(Collectors.toSet());

        Set<String> setB = Arrays.stream(
                        textB.replaceAll("[^가-힣a-zA-Z0-9 ]", " ")
                                .toLowerCase()
                                .split("\\s+")
                )
                .filter(s -> !s.isBlank())
                .collect(Collectors.toSet());

        if (setA.isEmpty() || setB.isEmpty()) {
            return 0;
        }

        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);

        Set<String> union = new HashSet<>(setA);
        union.addAll(setB);

        double score = ((double) intersection.size() / union.size()) * 100;
        return (int) Math.round(score);
    }

    private String decideFinalSubmissionResult(List<SimilarityResponse> results) {
        if (results == null || results.isEmpty()) {
            return "자기화 수준 높음";
        }

        SimilarityResponse top = results.stream()
                .max(
                        Comparator.comparingInt((SimilarityResponse r) -> judgeWeight(r.getJudge()))
                                .thenComparingInt(r -> r.getSimilarity() == null ? 0 : r.getSimilarity())
                )
                .orElse(null);

        if (top == null) {
            return "자기화 수준 높음";
        }

        return switch (top.getJudge()) {
            case "위험" -> "복사 가능성 높음";
            case "주의" -> "일부 재구성";
            default -> "자기화 수준 높음";
        };
    }

    private int judgeWeight(String judge) {
        if ("위험".equals(judge)) {
            return 3;
        }
        if ("주의".equals(judge)) {
            return 2;
        }
        return 1;
    }
}