package com.be.dto.request;

import lombok.Builder;
import lombok.Getter;

@Builder
public record ChatRequest (
//        String sessionId,
        String content
){
}
