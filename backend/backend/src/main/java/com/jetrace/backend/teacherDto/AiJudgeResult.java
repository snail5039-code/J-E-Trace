package com.jetrace.backend.teacherDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiJudgeResult {
    private String judge;             // 정상 / 주의 / 위험
    private String reason;            // 상세 사유
    private String submissionResult;  // 자기화 수준 높음 / 일부 재구성 / 복사 가능성 높음
}