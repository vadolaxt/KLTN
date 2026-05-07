package com.be.seeder;

import com.be.entity.User;
import com.be.enums.Role;
import com.be.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInit {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Kiểm tra xem đã có dữ liệu chưa
            if (userRepository.count() == 0) {
                System.out.println("--- Khởi tạo dữ liệu mẫu cho MongoDB ---");

                PasswordEncoder encoder = new BCryptPasswordEncoder();

                User user1 = new User();
                user1.setLastName("Nguyen Van A");
                user1.setEmail("a@gmail.com");
                user1.setPassword(encoder.encode("123456"));
                user1.setRole(Role.USER);

                User user2 = new User();
                user2.setLastName("Admin Hệ Thống");
                user2.setEmail("admin@be.com");
                user2.setPassword(encoder.encode("123456"));
                user2.setRole(Role.ADMIN);

                // Lưu vào MongoDB
                userRepository.save(user1);
                userRepository.save(user2);

                System.out.println("--- Đã thêm 2 user mẫu thành công! ---");
            } else {
                System.out.println("--- Database đã có dữ liệu, bỏ qua bước khởi tạo ---");
            }
        };
    }
}
