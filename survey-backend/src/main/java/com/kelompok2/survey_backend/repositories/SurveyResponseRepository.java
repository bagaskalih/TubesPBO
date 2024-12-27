package com.kelompok2.survey_backend.repositories;

import com.kelompok2.survey_backend.model.SurveyResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {
    List<SurveyResponse> findByUserId(Long userId);
    List<SurveyResponse> findBySurveyId(Long surveyId);
    Boolean existsBySurveyIdAndUserId(Long surveyId, Long userId);

    @Query("SELECT sr.user.id, COUNT(sr) as responseCount FROM SurveyResponse sr GROUP BY sr.user.id ORDER BY responseCount DESC")
    List<Object[]> findUsersSortedByResponseCount();
}