package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentTaskScoreResponse {
    private Long id;
    private Long taskId;
    private String taskTitle;
    private String className;
    private Boolean submitted;
    private String submittedAt;
    private Integer score;
}