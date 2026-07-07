package com.be.dto.response;

import lombok.Builder;

import java.util.List;

@Builder
public record BotResponse(
        List<String> intent,
        String answer
) {
}
