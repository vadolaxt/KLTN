package com.be.service;

import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.MISSING_FILE);
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.equals("image/jpeg") && !contentType.equals("application/pdf"))) {
            throw new AppException(ErrorCode.WRONG_FILE_TYPE);
        }

        String publicValue = UUID.randomUUID().toString();

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", "certificate_" + publicValue,
                "folder", "candidate_certificate"
        ));

        return uploadResult.get("secure_url").toString();
    }
}