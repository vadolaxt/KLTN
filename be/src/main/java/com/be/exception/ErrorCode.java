package com.be.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // ===== VALIDATION =====
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "Validation error"),
    INVALID_QUESTION_FORMAT(HttpStatus.BAD_REQUEST, "Invalid question format"),

    // ===== AUTH / SECURITY =====
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Unauthorized"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Forbidden"),
    USER_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "Tài khoản đã tồn tại"),
    BAD_CREDENTIALS(HttpStatus.BAD_REQUEST, "Email hoặc mật khẩu sai"),

    // ==== TOKEN ====
    INVALID_TOKEN(HttpStatus.BAD_REQUEST, "Invalid token"),
    WRONG_TOKEN_TYPE(HttpStatus.BAD_REQUEST, "Wrong token type"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User không tồn tài"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),

    // ==== OTP ====
    OTP_EXPIRED(HttpStatus.BAD_REQUEST, "Mã OTP hết hạn"),
    OTP_MISMATCH(HttpStatus.BAD_REQUEST, "Mã OTP không khớp"),

    // ==== FAST API ====
    FASTAPI_CONNECTION_FAILED(HttpStatus.SERVICE_UNAVAILABLE, "Hệ thống AI hiện đang bảo trì"),
    AI_SERVICE_TIMEOUT(HttpStatus.GATEWAY_TIMEOUT, "AI phản hồi quá lâu, vui lòng thử lại sau"),
    AI_PROCESSING_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Fast API internal error"),
    AI_QUOTA_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS, "Hết lượt gọi chat trong ngày"),

    // ==== CHAT BOT ====
    CHAT_CONTENT_EMPTY(HttpStatus.BAD_REQUEST, "Nội dung tin nhắn không được để trống"),
    CHAT_HISTORY_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể lưu lịch sử cuộc trò chuyện"),

    MAJOR_NOT_FOUND(HttpStatus.NOT_FOUND, "Ngành không tồn tại"),
    SUBJECT_COMBINATION_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "Ngành xét tuyển không bao gồm tổ hợp này"),
    SCORE_LIST_EMPTY(HttpStatus.BAD_REQUEST, "Bảng điểm dự đoán trống"),

    // ==== ACADEMIC SCORE PROFILE ====
    ACADEMIC_SCORE_PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm được hồ sơ bảng điểm"),

    ;
    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
