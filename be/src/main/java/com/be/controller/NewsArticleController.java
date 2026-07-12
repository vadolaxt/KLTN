package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.entity.NewsArticle;
import com.be.enums.NewsCategory;
import com.be.service.NewsArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsArticleController {
    private final NewsArticleService newsArticleService;

    @GetMapping
    public ApiResponse<List<NewsArticle>> findPublished(
            @RequestParam(required = false) NewsCategory category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer limit
    ) {
        return ApiResponse.success(HttpStatus.OK, "Lấy danh sách cẩm nang thành công",
                newsArticleService.findPublished(category, keyword, limit));
    }

    @GetMapping("/{id}")
    public ApiResponse<NewsArticle> getById(@PathVariable String id) {
        return ApiResponse.success(HttpStatus.OK, "Lấy chi tiết bài viết thành công",
                newsArticleService.getPublishedById(id));
    }
}
