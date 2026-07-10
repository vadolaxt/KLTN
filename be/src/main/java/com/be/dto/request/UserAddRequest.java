package com.be.dto.request;

public record UserAddRequest(
        String email,
        String firstName,
        String lastName,
        String role,
        String password
) {
}
