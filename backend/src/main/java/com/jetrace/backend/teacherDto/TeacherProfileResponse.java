package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherProfileResponse {
    private String loginId;
    private String name;
    private String email;
    private String subject;
    private String managedClasses;
}