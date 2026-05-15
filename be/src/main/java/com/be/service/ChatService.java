package com.be.service;

import com.be.dto.request.BotRequest;
import com.be.dto.request.ChatRequest;
import com.be.dto.response.BotResponse;
import com.be.entity.Conversation;
import com.be.entity.Message;
import com.be.entity.User;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.repository.ChatSessionRepository;
import com.be.repository.MessageRepository;
import com.be.repository.UserRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatService {
    @Autowired
    RestClient fastapiClient;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ChatSessionRepository chatSessionRepository;

    @Autowired
    JwtDecoder jwtDecoder;

    public List<Message> getHistory(String accessToken) {
        String sessionId = getUserIdFromToken(accessToken);
        return messageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    private String getUserIdFromToken(String accessToken) {
        Jwt jwt = jwtDecoder.decode(accessToken);
        return jwt.getSubject();
    }

    public Message sendMessage(ChatRequest request, String accessToken) {
        try {
            String userContent = request.content();
            String userId = getUserIdFromToken(accessToken);

            Message userMsg = Message.builder()
                    .sessionId(userId)
                    .content(userContent)
                    .timestamp(Instant.now())
                    .role("USER")
                    .build();
            messageRepository.save(userMsg);

            BotRequest botRequest = new BotRequest(userContent);

            BotResponse response = fastapiClient.post()
                    .uri("/chat")
                    .body(botRequest)
                    .retrieve()

                    .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                        throw new AppException(ErrorCode.AI_PROCESSING_ERROR);
                    })
                    // Bắt lỗi 404 nếu sai endpoint
                    .onStatus(status -> status.value() == 404, (req, res) -> {
                        throw new AppException(ErrorCode.FASTAPI_CONNECTION_FAILED);
                    })
                    .body(BotResponse.class);

            String botReply = (response != null) ? response.answer() : "Xin lỗi, tôi không thể trả lời lúc này.";

            Message botMsg = Message.builder()
                    .sessionId(userId)
                    .content(botReply)
                    .timestamp(Instant.now())
                    .role("CHATBOT")
                    .build();
            messageRepository.save(botMsg);

            return botMsg;
        } catch (ResourceAccessException e) {
            throw new AppException(ErrorCode.AI_SERVICE_TIMEOUT);
        }
    }
}
