package com.be.repository;

import com.be.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message,String> {
    List<Message> findBySessionIdOrderByTimestampAsc(String sessionId);
}
