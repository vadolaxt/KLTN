package com.be.seeder;

import com.be.entity.Major;
import com.be.entity.User;
import com.be.enums.Role;
import com.be.repository.MajorRepository;
import com.be.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInit {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, MajorRepository majorRepository) {
        return args -> {
            System.out.println("--- Bắt đầu kiểm tra và khởi tạo dữ liệu mẫu ---");

            // 1. Khởi tạo dữ liệu Users
            if (userRepository.count() == 0) {
                initSampleUsers(userRepository);
            } else {
                System.out.println("--- Dữ liệu Users đã tồn tại, bỏ qua ---");
            }

            // 2. Khởi tạo dữ liệu Majors
            if (majorRepository.count() == 0) {
                initSampleMajors(majorRepository);
            } else {
                System.out.println("--- Dữ liệu Majors đã tồn tại, bỏ qua ---");
            }
        };
    }

    // Hàm riêng biệt xử lý tạo User mẫu
    private void initSampleUsers(UserRepository userRepository) {
        System.out.println("--- Đang khởi tạo dữ liệu mẫu cho Users ---");
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

        userRepository.save(user1);
        userRepository.save(user2);
        System.out.println("--- Đã thêm các User mẫu thành công! ---");
    }

    // Hàm riêng biệt xử lý tạo Major mẫu theo yêu cầu của bạn
    private void initSampleMajors(MajorRepository majorRepository) {
        System.out.println("--- Đang khởi tạo dữ liệu mẫu cho Majors ---");

        Major major = Major.builder()
                .code("7480201")
                .name("Công nghệ thông tin")
                .build();

        majorRepository.save(major);
        System.out.println("--- Đã thêm các Major mẫu thành công! ---");
    }
}