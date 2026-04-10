package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskCreateRequest {
    private Long id;
    private String title;
    private String className;
    private String description;
    private String dueDate;
    private Boolean aiAllowed;
}