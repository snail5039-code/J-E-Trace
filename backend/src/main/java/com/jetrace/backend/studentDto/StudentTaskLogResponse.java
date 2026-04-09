package com.jetrace.backend.studentDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentTaskLogResponse {
    private Long id;
    private Long taskId;
    private String studentName;
    private String question;
    private String answer;
    private String createdAt;
    private String status;
}