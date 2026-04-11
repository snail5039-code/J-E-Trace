package com.jetrace.backend.studentController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.jetrace.backend.studentService.StudentService;
import com.jetrace.backend.studentDto.StudentDto;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    // 아이디 중복 체크
    @GetMapping("/users/check-id")
    public Map<String, Boolean> checkId(@RequestParam String loginId) {
        boolean available = studentService.isAvailable(loginId);

        Map<String, Boolean> result = new HashMap<>();
        result.put("available", available);
        return result;
    }

    // 회원가입
    @PostMapping("/signup")
    public void signup(@RequestBody StudentDto dto) {
        studentService.signup(dto);
    }

    // 로그인
    @PostMapping("/login")
    public boolean login(@RequestBody StudentDto dto) {
        return studentService.login(dto);
    }
}