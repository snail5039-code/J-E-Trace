package com.jetrace.backend.studentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jetrace.backend.studentDao.StudentDao;
import com.jetrace.backend.studentDto.LoginResponseDto;
import com.jetrace.backend.studentDto.StudentDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentDao studentDao;

    public boolean isAvailable(String loginId) {
        return studentDao.countByLoginId(loginId) == 0;
    }

    @Transactional
    public void signup(StudentDto dto) {
        if (dto.getLoginId() == null || dto.getLoginId().isBlank()) {
            throw new RuntimeException("loginId는 필수입니다.");
        }
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new RuntimeException("이름은 필수입니다.");
        }
        if (dto.getClassName() == null || dto.getClassName().isBlank()) {
            throw new RuntimeException("반 정보는 필수입니다.");
        }

        if (studentDao.countByLoginId(dto.getLoginId()) > 0) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        studentDao.insertStudentUser(
                dto.getLoginId(),
                dto.getEmail(),
                dto.getPassword(),
                dto.getName(),
                "STUDENT"
        );

        int pendingCount = studentDao.countPendingStudentRequest(dto.getName(), dto.getClassName());
        int approvedCount = studentDao.countApprovedStudentByName(dto.getName());

        if (pendingCount == 0 && approvedCount == 0) {
            studentDao.insertStudentRequest(dto.getName(), dto.getClassName());
        }
    }

    public LoginResponseDto login(StudentDto dto) {
        StudentDto user = studentDao.findByLoginId(dto.getLoginId());

        if (user == null) {
            return new LoginResponseDto(false, null, null, null, null);
        }

        if (!user.getPassword().equals(dto.getPassword())) {
            return new LoginResponseDto(false, null, null, null, null);
        }

        String approvedClassName = studentDao.findApprovedClassNameByStudentName(user.getName());

        return new LoginResponseDto(
                true,
                user.getLoginId(),
                user.getName(),
                approvedClassName,
                user.getRole()
        );
    }

    public StudentDto getUser(String loginId) {
        return studentDao.findByLoginId(loginId);
    }
}