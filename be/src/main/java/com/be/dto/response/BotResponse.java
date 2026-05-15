package com.be.dto.response;

import lombok.Builder;

@Builder
public record ChatBotResponse(
        String intent,
        String answer
) {
}
