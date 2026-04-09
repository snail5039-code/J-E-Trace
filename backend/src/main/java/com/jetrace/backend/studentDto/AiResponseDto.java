package com.jetrace.backend.studentDto;

import lombok.Data;

@Data
public class AiResponseDto {
    private boolean relevant;
    private int score;
    private String answer;
}