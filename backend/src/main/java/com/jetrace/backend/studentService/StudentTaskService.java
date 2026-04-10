package com.jetrace.backend.studentService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jetrace.backend.studentDao.StudentDao;
import com.jetrace.backend.studentDto.AiResponseDto;
import com.jetrace.backend.studentDto.ChatResponseDto;
import com.jetrace.backend.studentDto.StudentMyPageSummaryResponse;
import com.jetrace.backend.studentDto.StudentTaskDetailResponse;
import com.jetrace.backend.studentDto.StudentTaskLogResponse;
import com.jetrace.backend.studentDto.StudentTaskResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentTaskService {

    private final StudentDao studentDao;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.api-key}")
    private String apiKey;

    public List<StudentTaskResponse> getTasks(String loginId) {
        validateLoginId(loginId);

        String className = studentDao.findApprovedClassNameByLoginId(loginId);
        String studentName = studentDao.findStudentNameByLoginId(loginId);

        if (className == null || studentName == null) {
            throw new RuntimeException("승인된 학생 계정을 찾을 수 없습니다.");
        }

        return studentDao.findTasksByClassNameAndStudentName(className, studentName);
    }

    public StudentMyPageSummaryResponse getMyPageSummary(String loginId) {
        validateLoginId(loginId);

        String className = studentDao.findApprovedClassNameByLoginId(loginId);
        String studentName = studentDao.findStudentNameByLoginId(loginId);

        if (className == null || studentName == null) {
            throw new RuntimeException("승인된 학생 계정을 찾을 수 없습니다.");
        }

        StudentMyPageSummaryResponse summary =
                studentDao.findStudentMyPageSummary(className, studentName);

        if (summary == null) {
            summary = new StudentMyPageSummaryResponse();
            summary.setSubmittedCount(0);
            summary.setNotSubmittedCount(0);
        }

        summary.setRecentLogs(studentDao.findRecentTaskLogsByStudentName(studentName));
        return summary;
    }

    public StudentTaskDetailResponse getTaskDetail(Long taskId, String loginId) {
        validateLoginId(loginId);

        String className = studentDao.findApprovedClassNameByLoginId(loginId);
        String studentName = studentDao.findStudentNameByLoginId(loginId);

        if (className == null || studentName == null) {
            throw new RuntimeException("승인된 학생 계정을 찾을 수 없습니다.");
        }

        int allowed = studentDao.countTaskInStudentClass(taskId, className);
        if (allowed == 0) {
            throw new RuntimeException("해당 과제에 접근할 수 없습니다.");
        }

        if (studentDao.countTaskSubmission(taskId, studentName) == 0) {
            studentDao.insertTaskSubmissionIfNotExists(taskId, studentName);
        }

        StudentTaskDetailResponse detail
                = studentDao.findTaskDetailByTaskIdAndStudentName(taskId, studentName, className);

        if (detail == null) {
            throw new RuntimeException("과제 정보를 찾을 수 없습니다.");
        }

        detail.setLogs(studentDao.findTaskLogsByTaskIdAndStudentName(taskId, studentName));
        return detail;
    }

    @Transactional
    public void submitTask(Long taskId, String loginId, String content, Boolean aiUsed) {
        validateLoginId(loginId);

        if (content == null || content.isBlank()) {
            throw new RuntimeException("제출 내용이 비어 있습니다.");
        }

        String className = studentDao.findApprovedClassNameByLoginId(loginId);
        String studentName = studentDao.findStudentNameByLoginId(loginId);

        if (className == null || studentName == null) {
            throw new RuntimeException("승인된 학생 계정을 찾을 수 없습니다.");
        }

        int allowed = studentDao.countTaskInStudentClass(taskId, className);
        if (allowed == 0) {
            throw new RuntimeException("해당 과제에 접근할 수 없습니다.");
        }

        if (studentDao.countTaskSubmission(taskId, studentName) == 0) {
            studentDao.insertTaskSubmissionIfNotExists(taskId, studentName);
        }

        studentDao.updateTaskSubmission(taskId, studentName, content.trim(), Boolean.TRUE.equals(aiUsed));
    }

    @Transactional
    public ChatResponseDto askTaskAi(Long taskId, String loginId, String question) {
        validateLoginId(loginId);

        if (question == null || question.isBlank()) {
            throw new RuntimeException("질문을 입력하세요.");
        }

        String className = studentDao.findApprovedClassNameByLoginId(loginId);
        String studentName = studentDao.findStudentNameByLoginId(loginId);

        if (className == null || studentName == null) {
            throw new RuntimeException("승인된 학생 계정을 찾을 수 없습니다.");
        }

        StudentTaskResponse task = studentDao.findTaskById(taskId);
        if (task == null) {
            throw new RuntimeException("과제를 찾을 수 없습니다.");
        }

        int allowed = studentDao.countTaskInStudentClass(taskId, className);
        if (allowed == 0) {
            throw new RuntimeException("해당 과제에 접근할 수 없습니다.");
        }

        if (Boolean.FALSE.equals(task.getAiAllowed())) {
            throw new RuntimeException("이 과제는 AI 사용이 허용되지 않았습니다.");
        }

        ChatResponseDto response = callOpenAi(question.trim(), task.getDescription());

        StudentTaskLogResponse log = new StudentTaskLogResponse();
        log.setTaskId(taskId);
        log.setStudentName(studentName);
        log.setQuestion(question.trim());
        log.setAnswer(response.getAnswer());
        log.setStatus(response.getStatus());

        studentDao.insertTaskAiLog(log);

        return response;
    }

    private ChatResponseDto callOpenAi(String question, String taskDescription) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> responseFormat = Map.of(
                "type", "json_schema",
                "json_schema", Map.of(
                        "name", "task_ai_response",
                        "schema", Map.of(
                                "type", "object",
                                "properties", Map.of(
                                        "relevant", Map.of("type", "boolean"),
                                        "score", Map.of("type", "integer"),
                                        "answer", Map.of("type", "string")
                                ),
                                "required", List.of("relevant", "score", "answer"),
                                "additionalProperties", false
                        )
                )
        );

        Map<String, Object> body = Map.of(
                "model", "gpt-4o-mini",
                "response_format", responseFormat,
                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content",
                                """
                                너는 학생 과제 도우미 AI다.
                                아래 과제 설명을 기준으로 학생 질문이 과제와 관련 있는지 판단하고 답변하라.
                                완전히 무관한 질문만 relevant=false로 처리하라.

                                과제 설명:
                                """ + taskDescription
                        ),
                        Map.of("role", "user", "content", question)
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response
                    = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            Map<?, ?> responseBody = response.getBody();
            if (responseBody == null || responseBody.get("choices") == null) {
                throw new RuntimeException("OpenAI 응답이 비어 있습니다.");
            }

            List<?> choices = (List<?>) responseBody.get("choices");
            if (choices.isEmpty()) {
                throw new RuntimeException("OpenAI choices가 비어 있습니다.");
            }

            Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
            Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
            if (message == null || message.get("content") == null) {
                throw new RuntimeException("OpenAI message content가 없습니다.");
            }

            String content = (String) message.get("content");
            AiResponseDto result = objectMapper.readValue(content, AiResponseDto.class);

            boolean relevant = result.isRelevant() || result.getScore() >= 20;
            String status = result.getScore() >= 50 ? "정상" : "주의";

            if (!relevant) {
                return new ChatResponseDto(false, result.getScore(), "과제와 관련된 질문을 해주세요.", "주의");
            }

            String answer = result.getAnswer();
            if (answer == null || answer.isBlank()) {
                answer = "질문과 관련된 핵심 개념을 과제 설명에 맞춰 정리해보세요.";
            }

            return new ChatResponseDto(true, result.getScore(), answer, status);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("AI 응답 처리 실패");
        }
    }

    private void validateLoginId(String loginId) {
        if (loginId == null || loginId.isBlank()) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
    }
}