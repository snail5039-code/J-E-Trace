package com.jetrace.backend.authDto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String loginId;
    private String password;
}