package com.be.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Document(collection = "chat_sessions")
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatSession {
    @Id
    String id; // Đây chính là sessionId
    String userId;
    String title; // Ví dụ: "Tư vấn tuyển sinh 2025"
    Instant createdAt;
}