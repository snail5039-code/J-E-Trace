package com.jetrace.backend.teacherDto;

public class TaskCreateRequest {
    private String title;
    private String className;
    private String description;
    private String dueDate;
    private Boolean aiAllowed;

    public TaskCreateRequest() {
    }

    public TaskCreateRequest(String title, String className, String description, String dueDate, Boolean aiAllowed) {
        this.title = title;
        this.className = className;
        this.description = description;
        this.dueDate = dueDate;
        this.aiAllowed = aiAllowed;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public Boolean getAiAllowed() {
        return aiAllowed;
    }

    public void setAiAllowed(Boolean aiAllowed) {
        this.aiAllowed = aiAllowed;
    }
}