package com.jetrace.backend.authDto;

import lombok.Data;

@Data
public class SignupRequestDto {
    private String loginId;
    private String email;
    private String password;
    private String name;
    private String role;      // STUDENT / TEACHER
    private String className; // 학생만 사용
}