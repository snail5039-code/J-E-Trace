package com.jetrace.backend.authDto;

import lombok.Data;

@Data
public class SignupRequestDto {
    private String loginId;
    private String email;
    private String password;
    private String name;
    private String role;
    private String className;
    private String subject;
    private String managedClasses;
}