package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse {
    private Long id;
    private String studentName;
    private String className;
    private Integer finalScore;

    private Integer totalTasks;
    private Integer submittedTasks;
    private Integer notSubmittedTasks;

    private Integer aiLogCount;
    private Integer cautionLogCount;

    private String approvedAt;
}