package com.jetrace.backend.studentDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatResponseDto {
    private boolean relevant;
    private int score;
    private String answer;
    private String status;
}