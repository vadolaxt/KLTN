package com.be.repository;

import com.be.entity.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatSessionRepository extends MongoRepository<Conversation, String> {
}
