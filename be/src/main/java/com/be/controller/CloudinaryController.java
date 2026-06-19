package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.service.CloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CloudinaryController {
    CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String url = cloudinaryService.uploadImage(file);
            log.info("Image url: {}", url);
            return ResponseEntity.ok(
                    ApiResponse.success(
                            HttpStatus.OK,
                            "Upload successfully",
                            url));
        } catch (IOException e) {
            log.error("Lỗi kết nối Cloudinary", e);
            return ResponseEntity.ok(
                    ApiResponse.error(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Internal server error during file upload"));
        }
    }
}
