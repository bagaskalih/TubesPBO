package com.kelompok2.survey_backend.repositories;

import com.kelompok2.survey_backend.model.SurveyResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {
    Optional<SurveyResponse> findBySurveyIdAndUserId(Long surveyId, Long userId);
    List<SurveyResponse> findByUserId(Long userId);
    List<SurveyResponse> findBySurveyId(Long surveyId);
    Integer countBySurveyId(Long id);
    long countByUserId(Long id);
    Optional<SurveyResponse> findTopByUserIdOrderByCompletedAtDesc(Long userId);
}