package com.kelompok2.survey_backend.repositories;

import com.kelompok2.survey_backend.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByCategoryId(Long categoryId);

    @Query("SELECT s FROM Survey s ORDER BY (SELECT COUNT(sr) FROM SurveyResponse sr WHERE sr.survey = s) DESC")
    List<Survey> findAllOrderByResponseCount();
}