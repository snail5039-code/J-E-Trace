package com.jetrace.backend.studentService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jetrace.backend.studentDto.AiResponseDto;
import com.jetrace.backend.studentDto.ChatResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    @Value("${openai.api-key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatResponseDto askAI(String question, String assignment) {

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 1️⃣ 요청 바디
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");

        List<Map<String, String>> messages = List.of(
                Map.of(
                        "role", "system",
                        "content",
                        "너는 과제 질문 관련성 판단 AI다.\n\n" +
                                "다음 과제를 기준으로 사용자의 질문이 '조금이라도 관련이 있으면 true'로 판단해라.\n" +
                                "완전히 엉뚱한 질문(예: 날씨, 음식, 게임 등)일 경우에만 false로 해라.\n\n" +

                                "판단 기준:\n" +
                                "- 개념 질문(List가 뭐야?) → 관련 있음\n" +
                                "- 일부만 포함(Set 설명) → 관련 있음\n" +
                                "- 과제 직접 질문 → 관련 있음\n" +
                                "- 완전히 무관한 질문 → 관련 없음\n\n" +

                                "score 기준:\n" +
                                "- 80~100: 과제 핵심 직접 질문\n" +
                                "- 50~79: 관련 개념 질문\n" +
                                "- 20~49: 약간 관련 있음\n" +
                                "- 0~19: 무관\n\n" +

                                "반드시 JSON으로만 답해라:\n" +
                                "{ \"relevant\": true/false, \"score\": 0~100, \"answer\": \"\" }"),
                Map.of("role", "user", "content", question));

        body.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // 2️⃣ API 호출
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map responseBody = response.getBody();
            List choices = (List) responseBody.get("choices");
            Map firstChoice = (Map) choices.get(0);
            Map message = (Map) firstChoice.get("message");

            String content = (String) message.get("content");

            // 3️⃣ JSON 깨짐 방어 ⭐
            content = content.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            // 4️⃣ DTO 변환
            AiResponseDto result = objectMapper.readValue(content, AiResponseDto.class);

            // 5️⃣ 필터링
            if (!result.isRelevant() && result.getScore() < 20) {
                return new ChatResponseDto(
                        false,
                        result.getScore(),
                        "과제와 관련된 질문을 해주세요.");
            }

            // 6️⃣ 정상 응답
            return new ChatResponseDto(
                    true,
                    result.getScore(),
                    result.getAnswer());

        } catch (Exception e) {
            e.printStackTrace();

            return new ChatResponseDto(
                    false,
                    0,
                    "AI 응답 처리 실패");
        }
    }
}