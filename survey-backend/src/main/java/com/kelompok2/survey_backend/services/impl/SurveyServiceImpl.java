package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.SurveyDto;
import com.kelompok2.survey_backend.dto.SurveyStatsDto;
import com.kelompok2.survey_backend.model.Survey;
import com.kelompok2.survey_backend.model.SurveyResponse;
import com.kelompok2.survey_backend.repositories.SurveyRepository;
import com.kelompok2.survey_backend.repositories.SurveyResponseRepository;
import com.kelompok2.survey_backend.services.SurveyService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SurveyServiceImpl implements SurveyService {

    private final SurveyRepository surveyRepository;
    private final SurveyResponseRepository surveyResponseRepository;

    @Override
    public SurveyStatsDto getUserSurveyStats(Long userId) {
        List<SurveyResponse> completedSurveys = surveyResponseRepository.findByUserId(userId);
        List<Survey> allSurveys = surveyRepository.findAll();

        int totalSurveys = allSurveys.size();
        int completedCount = completedSurveys.size();
        int availableSurveys = totalSurveys - completedCount;

        return new SurveyStatsDto(totalSurveys, completedCount, availableSurveys);
    }

    @Override
    public List<SurveyDto> getAllSurveys() {
        return surveyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SurveyDto> getSurveysByCategory(Long categoryId) {
        return surveyRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SurveyDto getSurveyById(Long id) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));
        return mapToDto(survey);
    }

    @Override
    public SurveyDto createSurvey(SurveyDto surveyDto) {
        Survey survey = mapToEntity(surveyDto);
        Survey savedSurvey = surveyRepository.save(survey);
        return mapToDto(savedSurvey);
    }

    @Override
    public SurveyDto updateSurvey(SurveyDto surveyDto) {
        Survey survey = mapToEntity(surveyDto);
        Survey updatedSurvey = surveyRepository.save(survey);
        return mapToDto(updatedSurvey);
    }

    @Override
    public void deleteSurvey(Long id) {
        surveyRepository.deleteById(id);
    }

    private Survey mapToEntity(SurveyDto dto) {
        Survey survey = new Survey();
        survey.setId(dto.getId());
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setDurationMinutes(dto.getDurationMinutes());
        // Set other fields and relationships
        return survey;
    }

    private SurveyDto mapToDto(Survey survey) {
        return new SurveyDto(
                survey.getId(),
                survey.getTitle(),
                survey.getDescription(),
                survey.getCategory().getId(),
                survey.getDurationMinutes(),
                null, // Map questions if needed
                survey.getCreatedAt(),
                survey.getUpdatedAt()
        );
    }
}