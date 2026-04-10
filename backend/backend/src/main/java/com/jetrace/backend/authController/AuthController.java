package com.jetrace.backend.authController;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jetrace.backend.authDto.LoginRequestDto;
import com.jetrace.backend.authDto.LoginResponseDto;
import com.jetrace.backend.authDto.SignupRequestDto;
import com.jetrace.backend.authService.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @GetMapping("/check-id")
    public Map<String, Boolean> checkId(@RequestParam String loginId) {
        boolean available = authService.isAvailableLoginId(loginId);

        Map<String, Boolean> result = new HashMap<>();
        result.put("available", available);
        return result;
    }

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequestDto dto) {
        authService.signup(dto);
        return "ok";
    }

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto dto) {
        return authService.login(dto);
    }
}