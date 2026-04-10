package com.jetrace.backend.studentDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentTaskResponse {
    private Long id;
    private String title;
    private String className;
    private String description;
    private String dueDate;
    private Boolean aiAllowed;
    private Boolean submitted;
    private String submittedAt;
}