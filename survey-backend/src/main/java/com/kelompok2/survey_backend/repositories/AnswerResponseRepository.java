package com.kelompok2.survey_backend.repositories;

import com.kelompok2.survey_backend.model.AnswerResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnswerResponseRepository extends JpaRepository<AnswerResponse, Long> {
    List<AnswerResponse> findBySurveyResponseId(Long surveyResponseId);
}