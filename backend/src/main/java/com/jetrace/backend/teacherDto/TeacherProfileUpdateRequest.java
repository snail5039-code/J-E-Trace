package com.jetrace.backend.teacherDto;

import lombok.Data;

@Data
public class TeacherProfileUpdateRequest {
    private String loginId;
    private String name;
    private String subject;
    private String managedClasses;
}