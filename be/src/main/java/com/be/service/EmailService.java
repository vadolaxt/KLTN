package com.be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    private final String fromEmail = "xuantrung19022004@gmail.com";

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Mã xác nhận đăng ký / đăng nhập");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã này sẽ hết hạn sau 5 phút.");
        mailSender.send(message);
    }

    /*
     custom format mail gửi đi bằng html
     */
//    public void sendOtpEmail(String to, String otp) throws MessagingException {
//        MimeMessage message = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//
//        helper.setTo(to);
//        helper.setSubject("Mã xác thực OTP của bạn");
//
//        // Custom HTML format
//        String htmlContent = "<html>" +
//                "<body style='font-family: Arial, sans-serif;'>" +
//                "  <div style='background-color: #f4f4f4; padding: 20px;'>" +
//                "    <h2 style='color: #333;'>Xác nhận đăng ký tài khoản</h2>" +
//                "    <p>Chào bạn, mã OTP để hoàn tất đăng ký của bạn là:</p>" +
//                "    <div style='background: #fff; padding: 10px; border-radius: 5px; " +
//                "                display: inline-block; font-size: 24px; font-weight: bold; " +
//                "                color: #e67e22; border: 1px solid #ddd;'>" +
//                "      " + otp + "" +
//                "    </div>" +
//                "    <p style='font-size: 12px; color: #777; margin-top: 20px;'>" +
//                "      Mã này sẽ hết hạn trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai." +
//                "    </p>" +
//                "  </div>" +
//                "</body>" +
//                "</html>";
//
//        helper.setText(htmlContent, true); // Tham số 'true' cực kỳ quan trọng để gửi dạng HTML
//        mailSender.send(message);
//    }
}
