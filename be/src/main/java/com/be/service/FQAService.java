package com.be.service;

import com.be.entity.FQA;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.repository.FQARepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FQAService {
    @Autowired
    FQARepository fqaRepository;

    public List<FQA> getAllFQA() {
        return fqaRepository.findAll();
    }

    public void addFQA(FQA request) {
        fqaRepository.save(request);
    }

    public void editFQA(FQA request) {
        FQA fqa = fqaRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.FQA_NOT_FOUND));
        fqa.setQuestion(request.getQuestion());
        fqa.setAnswer(request.getAnswer());
        fqaRepository.save(fqa);
    }

    public void deleteFQA(String id) {
        fqaRepository.deleteById(id);
    }
}
