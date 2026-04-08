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
        if (request.getDueDate() != null) {
            request.setDueDate(request.getDueDate().replace("T", " "));
        }

        taskDao.insertTask(request);

        List<String> studentNames = taskDao.findStudentNamesByClassName(request.getClassName());

        if (studentNames != null && !studentNames.isEmpty()) {
            taskDao.insertTaskSubmissionsByClassName(request.getId(), studentNames);
        }
    }

    public List<TaskResponse> getTaskList() {
        return taskDao.findAllTasks();
    }

    public TaskResponse getTaskDetail(Long taskId) {
        return taskDao.findTaskById(taskId);
    }

    public List<TaskSubmissionResponse> getTaskSubmissions(Long taskId) {
        return taskDao.findTaskSubmissionsByTaskId(taskId);
    }

    public List<TaskAiLogResponse> getTaskAiLogs(Long taskId, String studentName) {
        return taskDao.findTaskAiLogsByTaskIdAndStudentName(taskId, studentName);
    }

    public List<StudentRequestResponse> getPendingStudentRequests() {
        return taskDao.findPendingStudentRequests();
    }

    public void approveStudentRequest(Long requestId) {
        StudentRequestResponse request = taskDao.findStudentRequestById(requestId);

        if (request == null) {
            throw new RuntimeException("학생 신청 정보를 찾을 수 없습니다.");
        }

        taskDao.approveStudentRequest(requestId);
        taskDao.insertApprovedStudent(request);
    }

    public void rejectStudentRequest(Long requestId) {
        taskDao.rejectStudentRequest(requestId);
    }

    public List<StudentResponse> getStudentList() {
        return taskDao.findAllStudents();
    }

    public StudentResponse getStudentDetail(Long studentId) {
        return taskDao.findStudentById(studentId);
    }

    public void updateStudentInfo(Long studentId, StudentResponse request) {
        request.setId(studentId);
        taskDao.updateStudentInfo(request);
    }

    public List<StudentTaskScoreResponse> getStudentTaskScores(Long studentId) {
        StudentResponse student = taskDao.findStudentById(studentId);

        if (student == null) {
            throw new RuntimeException("학생 정보를 찾을 수 없습니다.");
        }

        return taskDao.findStudentTaskScoresByStudentName(student.getStudentName());
    }

    public void updateStudentTaskScore(Long studentId, Long submissionId, Integer score) {
        StudentResponse student = taskDao.findStudentById(studentId);

        if (student == null) {
            throw new RuntimeException("학생 정보를 찾을 수 없습니다.");
        }

        taskDao.updateTaskSubmissionScore(submissionId, score);
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

    public void updateTaskSubmissionEvaluation(Long submissionId, TaskSubmissionResponse request) {
        taskDao.updateTaskSubmissionEvaluation(
                submissionId,
                request.getScore(),
                request.getTeacherComment()
        );
    }

    public void runSimilarityAnalysis(Long taskId) {
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
        return taskDao.findSimilarityResultById(similarityId);
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
                                .thenComparingInt(SimilarityResponse::getSimilarity)
                )
                .orElse(null);

        if (top == null) {
            return "자기화 수준 높음";
        }

        return top.getJudge();
    }

    private int judgeWeight(String judge) {
        if (judge == null) {
            return 0;
        }

        return switch (judge) {
            case "복붙 의심" -> 3;
            case "부분 인용 의심" -> 2;
            case "자기화 부족" -> 1;
            default -> 0;
        };
    }
}