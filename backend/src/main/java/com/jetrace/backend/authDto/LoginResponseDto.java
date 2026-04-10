package com.jetrace.backend.authDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private boolean success;
    private String message;
    private String loginId;
    private String name;
    private String role;
    private boolean approved;
    private String className;
    private String subject;
    private String managedClasses;
}