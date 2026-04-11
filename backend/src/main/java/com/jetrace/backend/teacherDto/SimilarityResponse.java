package com.jetrace.backend.teacherDto;

public class SimilarityResponse {
    private Long id;
    private Long sourceSubmissionId;
    private Long targetSubmissionId;
    private String sourceName;
    private String targetName;
    private Double similarity;
    private String judge;
    private String reason;

    public SimilarityResponse() {
    }

    public SimilarityResponse(
            Long id,
            Long sourceSubmissionId,
            Long targetSubmissionId,
            String sourceName,
            String targetName,
            Double similarity,
            String judge,
            String reason
    ) {
        this.id = id;
        this.sourceSubmissionId = sourceSubmissionId;
        this.targetSubmissionId = targetSubmissionId;
        this.sourceName = sourceName;
        this.targetName = targetName;
        this.similarity = similarity;
        this.judge = judge;
        this.reason = reason;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSourceSubmissionId() {
        return sourceSubmissionId;
    }

    public void setSourceSubmissionId(Long sourceSubmissionId) {
        this.sourceSubmissionId = sourceSubmissionId;
    }

    public Long getTargetSubmissionId() {
        return targetSubmissionId;
    }

    public void setTargetSubmissionId(Long targetSubmissionId) {
        this.targetSubmissionId = targetSubmissionId;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getTargetName() {
        return targetName;
    }

    public void setTargetName(String targetName) {
        this.targetName = targetName;
    }

    public Double getSimilarity() {
        return similarity;
    }

    public void setSimilarity(Double similarity) {
        this.similarity = similarity;
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