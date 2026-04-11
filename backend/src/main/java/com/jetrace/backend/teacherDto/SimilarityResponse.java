// backend/src/main/java/com/jetrace/backend/teacherDto/SimilarityResponse.java
package com.jetrace.backend.teacherDto;

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

    public SimilarityResponse() {
    }

    public SimilarityResponse(
            Long id,
            Long taskId,
            String taskTitle,
            String studentName,
            String targetName,
            String comparisonType,
            Integer similarity,
            String judge,
            String reason,
            String studentContent,
            String targetContent,
            String checkedAt
    ) {
        this.id = id;
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.studentName = studentName;
        this.targetName = targetName;
        this.comparisonType = comparisonType;
        this.similarity = similarity;
        this.judge = judge;
        this.reason = reason;
        this.studentContent = studentContent;
        this.targetContent = targetContent;
        this.checkedAt = checkedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getTaskId() {
        return taskId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getTargetName() {
        return targetName;
    }

    public String getComparisonType() {
        return comparisonType;
    }

    public Integer getSimilarity() {
        return similarity;
    }

    public String getJudge() {
        return judge;
    }

    public String getReason() {
        return reason;
    }

    public String getStudentContent() {
        return studentContent;
    }

    public String getTargetContent() {
        return targetContent;
    }

    public String getCheckedAt() {
        return checkedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setTargetName(String targetName) {
        this.targetName = targetName;
    }

    public void setComparisonType(String comparisonType) {
        this.comparisonType = comparisonType;
    }

    public void setSimilarity(Integer similarity) {
        this.similarity = similarity;
    }

    public void setJudge(String judge) {
        this.judge = judge;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setStudentContent(String studentContent) {
        this.studentContent = studentContent;
    }

    public void setTargetContent(String targetContent) {
        this.targetContent = targetContent;
    }

    public void setCheckedAt(String checkedAt) {
        this.checkedAt = checkedAt;
    }
}