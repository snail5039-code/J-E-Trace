package com.jetrace.backend.studentDto;

import lombok.Data;

@Data
public class StudentTaskSubmitRequest {
    private String studentName;
    private String content;
    private Boolean aiUsed;
}