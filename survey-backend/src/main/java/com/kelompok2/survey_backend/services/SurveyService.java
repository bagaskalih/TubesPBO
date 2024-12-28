package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.SurveyDto;
import com.kelompok2.survey_backend.dto.SurveyStatsDto;
import java.util.List;

public interface SurveyService {
    SurveyStatsDto getUserSurveyStats(Long userId);
    List<SurveyDto> getAllSurveys();
    List<SurveyDto> getSurveysByCategory(Long categoryId);
    SurveyDto getSurveyById(Long id);
    SurveyDto createSurvey(SurveyDto surveyDto);
    SurveyDto updateSurvey(SurveyDto surveyDto);
    void deleteSurvey(Long id);
}