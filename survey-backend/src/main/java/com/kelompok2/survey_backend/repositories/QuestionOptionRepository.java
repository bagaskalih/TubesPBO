package com.kelompok2.survey_backend.repositories;

import com.kelompok2.survey_backend.model.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
    List<QuestionOption> findByQuestionId(Long questionId);
}