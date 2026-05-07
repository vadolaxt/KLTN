package com.be.repository;

import com.be.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByLastName(String lastName);

    Optional<User> findByEmail(String email);
}
