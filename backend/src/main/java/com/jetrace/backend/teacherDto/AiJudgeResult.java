package com.jetrace.backend.teacherDto;

public class AiJudgeResult {
    private String result;
    private String judge;
    private String reason;

    public AiJudgeResult() {
    }

    public AiJudgeResult(String result, String judge, String reason) {
        this.result = result;
        this.judge = judge;
        this.reason = reason;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getJudge() {
        return judge;
    }

    public void setJudge(String judge) {
        this.judge = judge;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}