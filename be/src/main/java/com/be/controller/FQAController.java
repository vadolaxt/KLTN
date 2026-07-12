package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.ProfileRequest;
import com.be.dto.response.ProfileResponse;
import com.be.entity.FQA;
import com.be.service.FQAService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fqa")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FQAController {
    FQAService fqaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FQA>>> getAllFQA() {
        List<FQA> response = fqaService.getAllFQA();
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Get all FQA successfully",
                        response)
        );
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Void>> addFQA(
            @RequestBody FQA request
    ) {
        fqaService.addFQA(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Add FQA successfully",
                        null)
        );
    }
    @PostMapping("/edit")
    public ResponseEntity<ApiResponse<Void>> editFQA(
            @RequestBody FQA request
    ) {
        fqaService.editFQA(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Edit FQA successfully",
                        null)
        );
    }
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> deleteFQA(
            @RequestBody String id
    ) {
        fqaService.deleteFQA(id);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Delete FQA successfully",
                        null)
        );
    }
}
