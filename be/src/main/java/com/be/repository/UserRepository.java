package com.be.repository;

import com.be.entity.User;
import com.be.enums.AccountStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByLastName(String lastName);

    Optional<User> findByEmail(String email);

    List<User> findByIdNot(String id);

    List<User> findByIdNotAndStatusNot(String currentUserId, AccountStatus status);

    Optional<User> findByEmailAndStatusNot(String email, AccountStatus status);
}
