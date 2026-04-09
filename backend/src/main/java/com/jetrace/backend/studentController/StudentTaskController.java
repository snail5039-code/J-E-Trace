package com.jetrace.backend.studentController;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jetrace.backend.studentDto.ChatResponseDto;
import com.jetrace.backend.studentDto.StudentTaskChatRequest;
import com.jetrace.backend.studentDto.StudentTaskDetailResponse;
import com.jetrace.backend.studentDto.StudentTaskResponse;
import com.jetrace.backend.studentDto.StudentTaskSubmitRequest;
import com.jetrace.backend.studentService.StudentTaskService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student/tasks")
public class StudentTaskController {

    private final StudentTaskService studentTaskService;

    @GetMapping
    public List<StudentTaskResponse> getTasks(@RequestParam String studentName) {
        return studentTaskService.getTasks(studentName);
    }

    @GetMapping("/{taskId}")
    public StudentTaskDetailResponse getTaskDetail(
            @PathVariable Long taskId,
            @RequestParam String studentName
    ) {
        return studentTaskService.getTaskDetail(taskId, studentName);
    }

    @PostMapping("/{taskId}/chat")
    public ChatResponseDto chat(
            @PathVariable Long taskId,
            @RequestBody StudentTaskChatRequest request
    ) {
        return studentTaskService.askTaskAi(taskId, request.getStudentName(), request.getQuestion());
    }

    @PutMapping("/{taskId}/submit")
    public String submit(
            @PathVariable Long taskId,
            @RequestBody StudentTaskSubmitRequest request
    ) {
        studentTaskService.submitTask(taskId, request.getStudentName(), request.getContent(), request.getAiUsed());
        return "ok";
    }
}