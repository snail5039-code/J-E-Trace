package com.jetrace.backend.teacherDto;

public class StudentResponse {
    private Long id;
    private String studentName;
    private String className;
    private Integer finalScore;

    private Integer totalTasks;
    private Integer submittedTasks;
    private Integer notSubmittedTasks;

    private Integer aiLogCount;
    private Integer cautionLogCount;

    private String approvedAt;

    public StudentResponse() {
    }

    public StudentResponse(
            Long id,
            String studentName,
            String className,
            Integer finalScore,
            Integer totalTasks,
            Integer submittedTasks,
            Integer notSubmittedTasks,
            Integer aiLogCount,
            Integer cautionLogCount,
            String approvedAt
    ) {
        this.id = id;
        this.studentName = studentName;
        this.className = className;
        this.finalScore = finalScore;
        this.totalTasks = totalTasks;
        this.submittedTasks = submittedTasks;
        this.notSubmittedTasks = notSubmittedTasks;
        this.aiLogCount = aiLogCount;
        this.cautionLogCount = cautionLogCount;
        this.approvedAt = approvedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Integer getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(Integer finalScore) {
        this.finalScore = finalScore;
    }

    public Integer getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Integer getSubmittedTasks() {
        return submittedTasks;
    }

    public void setSubmittedTasks(Integer submittedTasks) {
        this.submittedTasks = submittedTasks;
    }

    public Integer getNotSubmittedTasks() {
        return notSubmittedTasks;
    }

    public void setNotSubmittedTasks(Integer notSubmittedTasks) {
        this.notSubmittedTasks = notSubmittedTasks;
    }

    public Integer getAiLogCount() {
        return aiLogCount;
    }

    public void setAiLogCount(Integer aiLogCount) {
        this.aiLogCount = aiLogCount;
    }

    public Integer getCautionLogCount() {
        return cautionLogCount;
    }

    public void setCautionLogCount(Integer cautionLogCount) {
        this.cautionLogCount = cautionLogCount;
    }

    public String getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(String approvedAt) {
        this.approvedAt = approvedAt;
    }
}