package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.SurveyCategoryDto;
import java.util.List;

public interface CategoryService {
    List<SurveyCategoryDto> getAllCategories();
}