package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String className;
    private String description;
    private String dueDate;
    private Boolean aiAllowed;
    private String createdAt;

    private Integer totalStudentCount;
    private Integer submittedCount;
    private Integer notSubmittedCount;
}