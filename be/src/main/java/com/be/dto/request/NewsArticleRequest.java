package com.be.dto.request;

import com.be.enums.NewsCategory;
import com.be.enums.NewsStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record NewsArticleRequest(
        String title,
        @Size(max = 500) String summary,
        String content,
        NewsCategory category,
        NewsStatus status,
        String imageUrl,
        String sourceUrl,
        String sourceName,
        LocalDate publishedAt,
        @Min(0) Long views,
        @Min(0) Integer displayOrder
) {
}
