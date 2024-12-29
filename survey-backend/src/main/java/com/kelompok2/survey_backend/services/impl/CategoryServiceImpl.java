package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.SurveyCategoryDto;
import com.kelompok2.survey_backend.repositories.SurveyCategoryRepository;
import com.kelompok2.survey_backend.services.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final SurveyCategoryRepository categoryRepository;

    @Override
    public List<SurveyCategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new SurveyCategoryDto(category.getId(), category.getName()))
                .collect(Collectors.toList());
    }
}