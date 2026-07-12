package com.be.repository;

import com.be.entity.NewsArticle;
import com.be.enums.NewsStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NewsArticleRepository extends MongoRepository<NewsArticle, String> {
    List<NewsArticle> findByStatus(NewsStatus status);

    boolean existsBySourceUrl(String sourceUrl);

    Optional<NewsArticle> findBySourceUrl(String sourceUrl);
}
