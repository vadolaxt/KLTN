package com.be.data_Initialize;

import com.be.entity.User;
import com.be.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInit {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Kiểm tra xem đã có dữ liệu chưa
            if (userRepository.count() == 0) {
                System.out.println("--- Khởi tạo dữ liệu mẫu cho MongoDB ---");

                User user1 = new User();
                user1.setName("Nguyen Van A");
                user1.setEmail("vana@gmail.com");
                user1.setPassword("123456"); // Trong thực tế nên dùng BCryptPasswordEncoder

                User user2 = new User();
                user2.setName("Admin Hệ Thống");
                user2.setEmail("admin@be.com");
                user2.setPassword("admin123");

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
