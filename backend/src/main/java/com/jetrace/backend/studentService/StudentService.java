package com.jetrace.backend.studentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.jetrace.backend.studentDao.StudentDao;
import com.jetrace.backend.studentDto.StudentDto;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentDao studentDao;

    // 🔹 아이디 중복 체크
    public boolean isAvailable(String loginId) {
        return studentDao.countByLoginId(loginId) == 0;
    }

    // 🔹 회원가입
    public void signup(StudentDto dto) {

        // ⚠️ 실제 운영에서는 반드시 암호화 적용
        // BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        // String encodedPw = encoder.encode(dto.getPassword());

        studentDao.insertStudent(
                dto.getLoginId(),
                dto.getEmail(),
                dto.getPassword(),
                dto.getName(),
                "STUDENT");
    }

    // 로그인
    public boolean login(StudentDto dto) {
        StudentDto user = studentDao.findByLoginId(dto.getLoginId());

        if (user == null)
            return false;

        return user.getPassword().equals(dto.getPassword());
    }

    public StudentDto getUser(String loginId) {
        return studentDao.findByLoginId(loginId);
    }
}