package com.jetrace.backend.authDao;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.jetrace.backend.authDto.AuthLoginRequest;
import com.jetrace.backend.authDto.AuthLoginResponse;
import com.jetrace.backend.authDto.StudentSignupRequest;
import com.jetrace.backend.authDto.TeacherSignupRequest;

@Mapper
public interface AuthDao {

    @Select("""
        SELECT
            login_id AS loginId,
            name,
            role,
            approved,
            class_name AS className
        FROM users
        WHERE login_id = #{loginId}
          AND password = #{password}
        LIMIT 1
    """)
    AuthLoginResponse findLoginUser(AuthLoginRequest request);

    @Select("""
        SELECT COUNT(*)
        FROM users
        WHERE login_id = #{loginId}
    """)
    int countByLoginId(@Param("loginId") String loginId);

    @Select("""
        SELECT COUNT(*)
        FROM users
        WHERE email = #{email}
    """)
    int countByEmail(@Param("email") String email);

    @Insert("""
        INSERT INTO users (
            login_id,
            email,
            password,
            name,
            role,
            approved,
            class_name
        ) VALUES (
            #{loginId},
            #{email},
            #{password},
            #{name},
            'STUDENT',
            FALSE,
            #{className}
        )
    """)
    void insertStudentUser(StudentSignupRequest request);

    @Insert("""
        INSERT INTO studentRequest (
            studentName,
            className,
            status
        ) VALUES (
            #{name},
            #{className},
            'PENDING'
        )
    """)
    void insertStudentRequest(StudentSignupRequest request);

    @Insert("""
        INSERT INTO users (
            login_id,
            email,
            password,
            name,
            role,
            approved,
            class_name,
            subject,
            managed_classes
        ) VALUES (
            #{loginId},
            #{email},
            #{password},
            #{name},
            'TEACHER',
            FALSE,
            NULL,
            #{subject},
            #{managedClasses}
        )
    """)
    void insertTeacherUser(TeacherSignupRequest request);
}