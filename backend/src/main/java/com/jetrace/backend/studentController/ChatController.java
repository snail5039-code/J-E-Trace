package com.jetrace.backend.studentController;

import com.jetrace.backend.studentDto.ChatRequestDto;
import com.jetrace.backend.studentDto.ChatResponseDto;
import com.jetrace.backend.studentService.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/chat")
    public ChatResponseDto chat(@RequestBody ChatRequestDto request) {

        return chatService.askAI(
                request.getQuestion(),
                request.getAssignment()
        );
    }
}