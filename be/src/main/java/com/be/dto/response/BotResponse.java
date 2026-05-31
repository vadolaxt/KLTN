package com.be.dto.response;

import lombok.Builder;

@Builder
public record BotResponse(
        String intent,
        String answer
) {
}
