package com.kelompok2.survey_backend.repositories;

import com.kelompok2.survey_backend.model.SurveyCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyCategoryRepository extends JpaRepository<SurveyCategory, Long> {
}