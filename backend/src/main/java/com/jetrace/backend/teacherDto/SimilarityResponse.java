package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimilarityResponse {
    private Long id;
    private Long taskId;
    private String taskTitle;
    private String studentName;
    private String targetName;
    private String comparisonType;
    private Integer similarity;
    private String judge;
    private String reason;
    private String studentContent;
    private String targetContent;
    private String checkedAt;
}