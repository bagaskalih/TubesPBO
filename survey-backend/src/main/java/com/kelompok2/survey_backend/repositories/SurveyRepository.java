package com.kelompok2.survey_backend.repositories;

import com.kelompok2.survey_backend.model.Survey;
import com.kelompok2.survey_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByCategoryId(Long categoryId);
    List<Survey> findByCreatedBy(User user);
}