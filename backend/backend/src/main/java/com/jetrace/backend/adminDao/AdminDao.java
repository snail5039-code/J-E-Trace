package com.jetrace.backend.adminDao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.jetrace.backend.adminDto.PendingTeacherResponse;

@Mapper
public interface AdminDao {

    @Select("""
        SELECT
            login_id AS loginId,
            email,
            name,
            approved,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS createdAt
        FROM users
        WHERE role = 'TEACHER'
          AND approved = FALSE
        ORDER BY created_at ASC
    """)
    List<PendingTeacherResponse> findPendingTeachers();

    @Select("""
        SELECT COUNT(*)
        FROM users
        WHERE login_id = #{loginId}
          AND role = 'TEACHER'
    """)
    int countTeacherByLoginId(@Param("loginId") String loginId);

    @Update("""
        UPDATE users
        SET approved = TRUE
        WHERE login_id = #{loginId}
          AND role = 'TEACHER'
    """)
    void approveTeacher(@Param("loginId") String loginId);
}