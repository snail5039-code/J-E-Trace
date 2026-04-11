// backend/src/main/java/com/jetrace/backend/studentDto/StudentTaskSubmitRequest.java
package com.jetrace.backend.studentDto;

public class StudentTaskSubmitRequest {
    private String loginId;
    private String content;

    public StudentTaskSubmitRequest() {
    }

    public StudentTaskSubmitRequest(String loginId, String content) {
        this.loginId = loginId;
        this.content = content;
    }

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}