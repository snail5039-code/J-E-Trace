package com.jetrace.backend.studentDao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.jetrace.backend.studentDto.StudentDto;
import com.jetrace.backend.studentDto.StudentTaskDetailResponse;
import com.jetrace.backend.studentDto.StudentTaskLogResponse;
import com.jetrace.backend.studentDto.StudentTaskResponse;

@Mapper
public interface StudentDao {

    // =========================
    // users
    // =========================
    @Select("SELECT COUNT(*) FROM users WHERE login_id = #{loginId}")
    int countByLoginId(String loginId);

    @Insert("""
        INSERT INTO users (login_id, email, password, name, role)
        VALUES (#{loginId}, #{email}, #{password}, #{name}, #{role})
    """)
    void insertStudentUser(
        @Param("loginId") String loginId,
        @Param("email") String email,
        @Param("password") String password,
        @Param("name") String name,
        @Param("role") String role
    );

    @Select("""
        SELECT
            login_id AS loginId,
            email,
            password,
            name,
            role
        FROM users
        WHERE login_id = #{loginId}
    """)
    StudentDto findByLoginId(String loginId);

    // =========================
    // studentRequest
    // =========================
    @Select("""
        SELECT COUNT(*)
        FROM studentRequest
        WHERE studentName = #{studentName}
          AND className = #{className}
          AND status = 'PENDING'
    """)
    int countPendingStudentRequest(
        @Param("studentName") String studentName,
        @Param("className") String className
    );

    @Insert("""
        INSERT INTO studentRequest (studentName, className, status)
        VALUES (#{studentName}, #{className}, 'PENDING')
    """)
    void insertStudentRequest(
        @Param("studentName") String studentName,
        @Param("className") String className
    );

    @Select("""
        SELECT className
        FROM student
        WHERE studentName = #{studentName}
        LIMIT 1
    """)
    String findApprovedClassNameByStudentName(String studentName);

    // =========================
    // task list
    // =========================
    @Select("""
        SELECT
            t.id,
            t.title,
            t.className,
            t.description,
            t.dueDate,
            t.aiAllowed,
            ts.submitted,
            ts.submittedAt
        FROM task t
        LEFT JOIN taskSubmission ts
          ON ts.taskId = t.id
         AND ts.studentName = #{studentName}
        WHERE t.className = #{className}
        ORDER BY t.id DESC
    """)
    List<StudentTaskResponse> findTasksByClassNameAndStudentName(
        @Param("className") String className,
        @Param("studentName") String studentName
    );

    // =========================
    // task detail
    // =========================
    @Select("""
        SELECT
            t.id,
            t.title,
            t.className,
            t.description,
            t.dueDate,
            t.aiAllowed,
            ts.id AS submissionId,
            ts.submitted,
            ts.submittedAt,
            ts.aiUsed,
            ts.content,
            ts.score,
            ts.teacherComment
        FROM task t
        LEFT JOIN taskSubmission ts
          ON ts.taskId = t.id
         AND ts.studentName = #{studentName}
        WHERE t.id = #{taskId}
        LIMIT 1
    """)
    StudentTaskDetailResponse findTaskDetailByTaskIdAndStudentName(
        @Param("taskId") Long taskId,
        @Param("studentName") String studentName
    );

    @Select("""
        SELECT
            id,
            taskId,
            studentName,
            question,
            answer,
            createdAt,
            status
        FROM taskAiLog
        WHERE taskId = #{taskId}
          AND studentName = #{studentName}
        ORDER BY id DESC
    """)
    List<StudentTaskLogResponse> findTaskLogsByTaskIdAndStudentName(
        @Param("taskId") Long taskId,
        @Param("studentName") String studentName
    );

    @Select("""
        SELECT COUNT(*)
        FROM taskSubmission
        WHERE taskId = #{taskId}
          AND studentName = #{studentName}
    """)
    int countTaskSubmission(
        @Param("taskId") Long taskId,
        @Param("studentName") String studentName
    );

    @Insert("""
        INSERT INTO taskSubmission (
            taskId,
            studentName,
            submitted,
            aiUsed,
            score,
            content
        ) VALUES (
            #{taskId},
            #{studentName},
            FALSE,
            FALSE,
            0,
            NULL
        )
    """)
    void insertTaskSubmissionIfNotExists(
        @Param("taskId") Long taskId,
        @Param("studentName") String studentName
    );

    @Update("""
        UPDATE taskSubmission
        SET submitted = TRUE,
            submittedAt = NOW(),
            aiUsed = #{aiUsed},
            content = #{content},
            updatedAt = NOW()
        WHERE taskId = #{taskId}
          AND studentName = #{studentName}
    """)
    void updateTaskSubmission(
        @Param("taskId") Long taskId,
        @Param("studentName") String studentName,
        @Param("content") String content,
        @Param("aiUsed") Boolean aiUsed
    );

    @Insert("""
        INSERT INTO taskAiLog (
            taskId,
            studentName,
            question,
            answer,
            status
        ) VALUES (
            #{taskId},
            #{studentName},
            #{question},
            #{answer},
            #{status}
        )
    """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertTaskAiLog(StudentTaskLogResponse log);

    @Select("""
        SELECT
            id,
            title,
            className,
            description,
            dueDate,
            aiAllowed
        FROM task
        WHERE id = #{taskId}
        LIMIT 1
    """)
    StudentTaskResponse findTaskById(Long taskId);

    @Select("""
        SELECT COUNT(*)
        FROM student
        WHERE studentName = #{studentName}
    """)
    int countApprovedStudentByName(String studentName);

    @Select("""
        SELECT COUNT(*)
        FROM task
        WHERE id = #{taskId}
          AND className = #{className}
    """)
    int countTaskInStudentClass(
        @Param("taskId") Long taskId,
        @Param("className") String className
    );

    @Select("""
        SELECT COUNT(*)
        FROM taskAiLog
        WHERE taskId = #{taskId}
          AND studentName = #{studentName}
          AND status = '주의'
    """)
    int countCautionLogs(
        @Param("taskId") Long taskId,
        @Param("studentName") String studentName
    );

    @Select("""
        SELECT COUNT(*)
        FROM taskAiLog
        WHERE taskId = #{taskId}
          AND studentName = #{studentName}
    """)
    int countAllLogs(
        @Param("taskId") Long taskId,
        @Param("studentName") String studentName
    );

    @Select("""
        SELECT
            COUNT(*)
        FROM taskSubmission
        WHERE studentName = #{studentName}
          AND submitted = TRUE
    """)
    int countSubmittedTasks(String studentName);
}