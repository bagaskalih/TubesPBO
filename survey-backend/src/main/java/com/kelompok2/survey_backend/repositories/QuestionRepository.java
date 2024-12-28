package com.kelompok2.survey_backend.repositories;

import com.kelompok2.survey_backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findBySurveyIdOrderByOrderNumberAsc(Long surveyId);
}
