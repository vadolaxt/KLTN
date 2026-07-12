package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.NewsArticleRequest;
import com.be.entity.NewsArticle;
import com.be.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/news")
@RequiredArgsConstructor
public class AdminNewsArticleController {
    private final NewsArticleService newsArticleService;

    @GetMapping
    public ApiResponse<List<NewsArticle>> findAll() {
        return ApiResponse.success(HttpStatus.OK, "Lấy danh sách tin tức thành công",
                newsArticleService.findAllForAdmin());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NewsArticle>> create(@Valid @RequestBody NewsArticleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                HttpStatus.CREATED, "Thêm bài viết thành công", newsArticleService.create(request)));
    }

    @PatchMapping("/{id}")
    public ApiResponse<NewsArticle> update(
            @PathVariable String id,
            @Valid @RequestBody NewsArticleRequest request
    ) {
        return ApiResponse.success(HttpStatus.OK, "Cập nhật bài viết thành công",
                newsArticleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        newsArticleService.delete(id);
        return ApiResponse.success(HttpStatus.OK, "Xóa bài viết thành công", null);
    }
}
