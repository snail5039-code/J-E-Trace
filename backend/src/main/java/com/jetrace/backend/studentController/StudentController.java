package com.jetrace.backend.studentController;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jetrace.backend.studentDto.LoginResponseDto;
import com.jetrace.backend.studentDto.StudentDto;
import com.jetrace.backend.studentService.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/users/check-id")
    public Map<String, Boolean> checkId(@RequestParam String loginId) {
        boolean available = studentService.isAvailable(loginId);

        Map<String, Boolean> result = new HashMap<>();
        result.put("available", available);
        return result;
    }

    @PostMapping("/signup")
    public String signup(@RequestBody StudentDto dto) {
        studentService.signup(dto);
        return "ok";
    }

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody StudentDto dto) {
        return studentService.login(dto);
    }
}