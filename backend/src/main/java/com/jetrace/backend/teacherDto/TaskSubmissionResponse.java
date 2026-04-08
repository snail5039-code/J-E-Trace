package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskSubmissionResponse {
    private Long id;
    private Long taskId;
    private String studentName;
    private Boolean submitted;
    private String submittedAt;
    private Boolean aiUsed;
    private String result;

    private String content;
    private Integer score;
    private String teacherComment;

    private String createdAt;
    private String updatedAt;

    // 분석 요약
    private Integer topStudentSimilarity;
    private String topStudentTargetName;
    private String topStudentJudge;
    private String topStudentReason;

    private Integer aiLogSimilarity;
    private String aiLogJudge;
    private String aiLogReason;
}