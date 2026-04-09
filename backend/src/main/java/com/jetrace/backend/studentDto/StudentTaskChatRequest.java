package com.jetrace.backend.studentDto;

import lombok.Data;

@Data
public class StudentTaskChatRequest {
    private String studentName;
    private String question;
}