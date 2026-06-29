package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.UserAddRequest;
import com.be.dto.request.UserUpdateRequest;
import com.be.dto.response.UserResponse;
import com.be.service.AdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUser(
            @CookieValue(name = "accessToken", required = false) String token) {
        List<UserResponse> data = adminService.getAllUser(token);

        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Get all user successfully",
                        data)
        );
    }

    @PostMapping("/users/delete")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @RequestBody String userId
    ){
        adminService.deleteUser(userId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Delete user successfully",
                        null)
        );
    }

    @PostMapping("/users/ban")
    public ResponseEntity<ApiResponse<Void>> banUser(
            @RequestBody String userId
    ){
        adminService.banUser(userId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Ban user successfully",
                        null)
        );
    }

    @PostMapping("/users/update")
    public ResponseEntity<ApiResponse<Void>> updateUser(
            @RequestBody UserUpdateRequest request
    ){
        adminService.updateUser(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Update user successfully",
                        null)
        );
    }

    @PostMapping("/users/add")
    public ResponseEntity<ApiResponse<Void>> addUser(
            @RequestBody UserAddRequest request
    ){
        adminService.addUser(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Add user successfully",
                        null)
        );
    }


}
