package com.jetrace.backend.studentDto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentTaskDetailResponse {
    private Long id;
    private String title;
    private String className;
    private String description;
    private String dueDate;
    private Boolean aiAllowed;

    private Long submissionId;
    private Boolean submitted;
    private String submittedAt;
    private Boolean aiUsed;
    private String content;
    private Integer score;
    private String teacherComment;

    private List<StudentTaskLogResponse> logs;
}