package com.jetrace.backend.adminController;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jetrace.backend.adminDto.PendingTeacherResponse;
import com.jetrace.backend.adminService.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/teachers/pending")
    public List<PendingTeacherResponse> getPendingTeachers() {
        return adminService.getPendingTeachers();
    }

    @PostMapping("/teachers/{loginId}/approve")
    public String approveTeacher(@PathVariable String loginId) {
        adminService.approveTeacher(loginId);
        return "ok";
    }
}