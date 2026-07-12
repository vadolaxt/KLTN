package com.be.service;

import com.be.dto.request.NewsArticleRequest;
import com.be.entity.NewsArticle;
import com.be.enums.NewsCategory;
import com.be.enums.NewsStatus;
import com.be.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class NewsArticleService {
    private final NewsArticleRepository newsArticleRepository;

    public List<NewsArticle> findPublished(NewsCategory category, String keyword, Integer limit) {
        String normalizedKeyword = normalize(keyword);
        return newsArticleRepository.findByStatus(NewsStatus.PUBLISHED).stream()
                .filter(item -> category == null || item.getCategory() == category)
                .filter(item -> normalizedKeyword.isEmpty()
                        || normalize(item.getTitle()).contains(normalizedKeyword)
                        || normalize(item.getSummary()).contains(normalizedKeyword)
                        || normalize(item.getContent()).contains(normalizedKeyword))
                .sorted(articleComparator())
                .limit(limit == null || limit < 1 ? Long.MAX_VALUE : limit)
                .toList();
    }

    public NewsArticle getPublishedById(String id) {
        NewsArticle article = getById(id);
        if (article.getStatus() != NewsStatus.PUBLISHED) {
            throw new NoSuchElementException("Không tìm thấy bài viết");
        }
        article.setViews(article.getViews() + 1);
        article.setUpdatedAt(LocalDateTime.now());
        return newsArticleRepository.save(article);
    }

    public List<NewsArticle> findAllForAdmin() {
        return newsArticleRepository.findAll(Sort.by(
                Sort.Order.asc("displayOrder"),
                Sort.Order.desc("publishedAt"),
                Sort.Order.desc("createdAt")
        ));
    }

    public NewsArticle create(NewsArticleRequest request) {
        requireCreateFields(request);
        String sourceUrl = trimToNull(request.sourceUrl());
        if (StringUtils.hasText(sourceUrl) && newsArticleRepository.existsBySourceUrl(sourceUrl)) {
            throw new IllegalArgumentException("Nguồn bài viết đã tồn tại");
        }

        LocalDateTime now = LocalDateTime.now();
        NewsArticle article = NewsArticle.builder()
                .title(required(request.title(), "Tiêu đề"))
                .summary(required(request.summary(), "Tóm tắt"))
                .content(required(request.content(), "Nội dung"))
                .category(request.category())
                .status(request.status() == null ? NewsStatus.DRAFT : request.status())
                .imageUrl(trimToNull(request.imageUrl()))
                .sourceUrl(sourceUrl)
                .sourceName(StringUtils.hasText(request.sourceName()) ? request.sourceName().trim() : "Trang tuyển sinh NLU")
                .publishedAt(request.publishedAt() == null ? LocalDate.now() : request.publishedAt())
                .views(request.views() == null ? 0 : request.views())
                .displayOrder(request.displayOrder() == null ? 100 : request.displayOrder())
                .createdAt(now)
                .updatedAt(now)
                .build();
        return newsArticleRepository.save(article);
    }

    public NewsArticle update(String id, NewsArticleRequest request) {
        NewsArticle article = getById(id);

        if (request.title() != null) article.setTitle(required(request.title(), "Tiêu đề"));
        if (request.summary() != null) article.setSummary(required(request.summary(), "Tóm tắt"));
        if (request.content() != null) article.setContent(required(request.content(), "Nội dung"));
        if (request.category() != null) article.setCategory(request.category());
        if (request.status() != null) article.setStatus(request.status());
        if (request.imageUrl() != null) article.setImageUrl(trimToNull(request.imageUrl()));
        if (request.sourceUrl() != null) {
            String sourceUrl = trimToNull(request.sourceUrl());
            if (StringUtils.hasText(sourceUrl)) {
                boolean duplicate = newsArticleRepository.findBySourceUrl(sourceUrl)
                        .filter(existing -> !existing.getId().equals(id))
                        .isPresent();
                if (duplicate) throw new IllegalArgumentException("Nguồn bài viết đã tồn tại");
            }
            article.setSourceUrl(sourceUrl);
        }
        if (request.sourceName() != null) article.setSourceName(trimToNull(request.sourceName()));
        if (request.publishedAt() != null) article.setPublishedAt(request.publishedAt());
        if (request.views() != null) article.setViews(request.views());
        if (request.displayOrder() != null) article.setDisplayOrder(request.displayOrder());
        article.setUpdatedAt(LocalDateTime.now());

        return newsArticleRepository.save(article);
    }

    public void delete(String id) {
        newsArticleRepository.delete(getById(id));
    }

    private NewsArticle getById(String id) {
        return newsArticleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy bài viết"));
    }

    private void requireCreateFields(NewsArticleRequest request) {
        required(request.title(), "Tiêu đề");
        required(request.summary(), "Tóm tắt");
        required(request.content(), "Nội dung");
        if (request.category() == null) {
            throw new IllegalArgumentException("Nhóm bài viết không được để trống");
        }
    }

    private Comparator<NewsArticle> articleComparator() {
        return Comparator
                .comparingInt(NewsArticle::getDisplayOrder)
                .thenComparing(NewsArticle::getPublishedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(NewsArticle::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()));
    }

    private static String required(String value, String field) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(field + " không được để trống");
        }
        return value.trim();
    }

    private static String trimToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
