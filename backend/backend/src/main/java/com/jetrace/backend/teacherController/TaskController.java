package com.jetrace.backend.teacherController;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jetrace.backend.teacherDto.SimilarityResponse;
import com.jetrace.backend.teacherDto.StudentRequestResponse;
import com.jetrace.backend.teacherDto.StudentResponse;
import com.jetrace.backend.teacherDto.StudentTaskScoreResponse;
import com.jetrace.backend.teacherDto.TaskAiLogResponse;
import com.jetrace.backend.teacherDto.TaskCreateRequest;
import com.jetrace.backend.teacherDto.TaskResponse;
import com.jetrace.backend.teacherDto.TaskSubmissionResponse;
import com.jetrace.backend.teacherService.TaskService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/teacher/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public String createTask(@RequestBody TaskCreateRequest request) {
        taskService.createTask(request);
        return "ok";
    }

    @GetMapping
    public List<TaskResponse> getTaskList() {
        return taskService.getTaskList();
    }

    @GetMapping("/{taskId}")
    public TaskResponse getTaskDetail(@PathVariable Long taskId) {
        return taskService.getTaskDetail(taskId);
    }

    @GetMapping("/{taskId}/taskSubmissions")
    public List<TaskSubmissionResponse> getTaskSubmissions(@PathVariable Long taskId) {
        return taskService.getTaskSubmissions(taskId);
    }

    @GetMapping("/{taskId}/logs")
    public List<TaskAiLogResponse> getTaskAiLogs(
            @PathVariable Long taskId,
            @RequestParam String studentName) {
        return taskService.getTaskAiLogs(taskId, studentName);
    }

    @GetMapping("/studentRequests")
    public List<StudentRequestResponse> getPendingStudentRequests() {
        return taskService.getPendingStudentRequests();
    }

    @PostMapping("/studentRequests/{requestId}/approve")
    public String approveStudentRequest(@PathVariable Long requestId) {
        taskService.approveStudentRequest(requestId);
        return "ok";
    }

    @PostMapping("/studentRequests/{requestId}/reject")
    public String rejectStudentRequest(@PathVariable Long requestId) {
        taskService.rejectStudentRequest(requestId);
        return "ok";
    }

    @GetMapping("/students")
    public List<StudentResponse> getStudentList() {
        return taskService.getStudentList();
    }

    @GetMapping("/students/{studentId}")
    public StudentResponse getStudentDetail(@PathVariable Long studentId) {
        return taskService.getStudentDetail(studentId);
    }

    @PutMapping("/students/{studentId}")
    public String updateStudentInfo(
            @PathVariable Long studentId,
            @RequestBody StudentResponse request) {
        taskService.updateStudentInfo(studentId, request);
        return "ok";
    }

    @GetMapping("/students/{studentId}/taskScores")
    public List<StudentTaskScoreResponse> getStudentTaskScores(@PathVariable Long studentId) {
        return taskService.getStudentTaskScores(studentId);
    }

    @PutMapping("/students/{studentId}/taskScores/{submissionId}")
    public String updateStudentTaskScore(
            @PathVariable Long studentId,
            @PathVariable Long submissionId,
            @RequestBody Map<String, Integer> request) {
        taskService.updateStudentTaskScore(studentId, submissionId, request.get("score"));
        return "ok";
    }

    @GetMapping("/submissions/{submissionId}")
    public TaskSubmissionResponse getTaskSubmissionDetail(@PathVariable Long submissionId) {
        return taskService.getTaskSubmissionDetail(submissionId);
    }

    @PutMapping("/submissions/{submissionId}/evaluation")
    public String updateTaskSubmissionEvaluation(
            @PathVariable Long submissionId,
            @RequestBody TaskSubmissionResponse request) {
        taskService.updateTaskSubmissionEvaluation(submissionId, request);
        return "ok";
    }

    @PostMapping("/{taskId}/similarity/run")
    public String runSimilarityAnalysis(@PathVariable Long taskId) {
        taskService.runSimilarityAnalysis(taskId);
        return "ok";
    }

    @GetMapping("/similarity")
    public List<SimilarityResponse> getSimilarityResults() {
        return taskService.getSimilarityResults();
    }

    @GetMapping("/similarity/{similarityId}")
    public SimilarityResponse getSimilarityResultDetail(@PathVariable Long similarityId) {
        return taskService.getSimilarityResultDetail(similarityId);
    }

    @PostMapping("/maintenance/backfill")
    public String backfillSystemData() {
        taskService.backfillSystemData();
        return "ok";
    }
}