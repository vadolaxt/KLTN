package com.be.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    @NotBlank(message = "Họ ko được để trống")
    String firstName;

    @NotBlank(message = "Tên ko được để trống")
    String lastName;

    @NotNull(message = "Ngày sinh ko được để trống")
    Date dateOfBirth;

    @NotBlank(message = "CCCD ko được để trống")
    @Size(min = 12, max = 12)
    String identity;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
            message = "Mật khẩu phải bao gồm chữ hoa, chữ thường và số")
    String password;

    @Size(min = 6, max = 6)
    String otp;
}
