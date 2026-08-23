//package com.be.service;
//
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.http.HttpEntity;
//import org.thymeleaf.TemplateEngine;
//import org.thymeleaf.context.Context;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//@FieldDefaults(level = AccessLevel.PRIVATE)
//public class EmailService {
//
//    final TemplateEngine templateEngine;
//    final RestTemplate restTemplate = new RestTemplate();
//
//    @Value("${SEND_GRID_API_KEY}")
//    String resendApiKey;
//
//    public void sendOtpEmail(String toEmail, String otp) {
//        try {
//            Context context = new Context();
//            context.setVariable("otpCode", otp);
//            String htmlContent = templateEngine.process("otp-template", context);
//
//            String url = "https://api.sendgrid.com/v3/mail/send";
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            headers.set("Authorization", "Bearer " + resendApiKey);
//
//            Map<String, Object> body = new HashMap<>();
//
//            Map<String, String> from = new HashMap<>();
//            from.put("email", "xuantrung19022004@gmail.com");
//            body.put("from", from);
//
//            Map<String, Object> personalizationItem = new HashMap<>();
//            Map<String, String> toItem = new HashMap<>();
//            toItem.put("email", toEmail);
//            personalizationItem.put("to", List.of(toItem));
//            body.put("personalizations", List.of(personalizationItem));
//
//            body.put("subject", "Mã xác nhận OTP");
//
//            Map<String, String> contentItem = new HashMap<>();
//            contentItem.put("type", "text/html");
//            contentItem.put("value", htmlContent);
//            body.put("content", List.of(contentItem));
//
//            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//
//            log.info("Đang gửi email qua Resend HTTP API tới: {}", toEmail);
//            restTemplate.postForEntity(url, request, String.class);
//            log.info("Gửi email qua Resend thành công!");
//
//        } catch (Exception e) {
//            log.error("Lỗi gửi email qua Resend: {}", e.getMessage());
//            throw new RuntimeException("Lỗi gửi email: " + e.getMessage());
//        }
//    }
//}

package com.be.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailService {

    final JavaMailSender mailSender;
    final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            Context context = new Context();
            context.setVariable("otpCode", otp);
            String htmlContent = templateEngine.process("otp-template", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Mã xác nhận OTP");
            helper.setText(htmlContent, true);

            log.info("Đang gửi email OTP tới: {}", toEmail);
            mailSender.send(message);
            log.info("Gửi email OTP thành công!");

        } catch (MessagingException e) {
            log.error("Lỗi cấu hình/tạo nội dung email: {}", e.getMessage());
            throw new RuntimeException("Lỗi gửi email: " + e.getMessage());
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi gửi email: {}", e.getMessage());
            throw new RuntimeException("Lỗi gửi email: " + e.getMessage());
        }
    }
}
