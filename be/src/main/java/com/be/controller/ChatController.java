package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.ChatRequest;
import com.be.entity.Message;
import com.be.service.ChatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.checkerframework.checker.units.qual.A;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {
    ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Message>> sendMessage(
            @CookieValue(name = "accessToken", required = false) String accessToken,
            @RequestBody ChatRequest request
    ) {
        Message response = chatService.sendMessage(request, accessToken);
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK, "Message sent successfully", response)
        );
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Message>>> getHistory(
            @CookieValue(name = "accessToken", required = false) String accessToken
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                HttpStatus.OK,
                "Get chat history successfully",
                chatService.getHistory(accessToken))
        );
    }
}