package com.be.dto.request;

import lombok.Builder;

@Builder
public record ChatBotRequest(
        String query

) {
}
