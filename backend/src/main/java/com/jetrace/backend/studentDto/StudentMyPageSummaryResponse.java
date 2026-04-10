package com.jetrace.backend.studentDto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentMyPageSummaryResponse {
    private int submittedCount;
    private int notSubmittedCount;
    private List<StudentTaskLogResponse> recentLogs;
}