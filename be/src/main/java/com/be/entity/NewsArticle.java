package com.be.entity;

import com.be.enums.NewsCategory;
import com.be.enums.NewsStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "news_articles")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsArticle {
    @Id
    String id;

    String title;
    String summary;
    String content;
    NewsCategory category;
    NewsStatus status;
    String imageUrl;

    @Indexed(unique = true, sparse = true)
    String sourceUrl;
    String sourceName;

    LocalDate publishedAt;
    long views;
    int displayOrder;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
