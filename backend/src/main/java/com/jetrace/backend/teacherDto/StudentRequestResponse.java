package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequestResponse {
    private Long id;
    private String studentName;
    private String className;
    private String status;
    private String requestedAt;
    private String processedAt;
}