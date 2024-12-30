package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.ResponseDetailDto;
import com.kelompok2.survey_backend.dto.SurveyDto;
import com.kelompok2.survey_backend.dto.SurveyResponseDto;

import java.util.List;

public interface SurveyResponseService {
    SurveyResponseDto submitResponse(Long surveyId, SurveyResponseDto responseDto);
    List<SurveyResponseDto> getUserResponses(Long userId);
    boolean hasUserCompletedSurvey(Long userId, Long surveyId);
    List<ResponseDetailDto> getSurveyResponses(Long surveyId);
}