package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.QuestionDto;
import com.kelompok2.survey_backend.dto.QuestionOptionDto;
import com.kelompok2.survey_backend.dto.SurveyDto;
import com.kelompok2.survey_backend.dto.SurveyStatsDto;
import com.kelompok2.survey_backend.model.*;
import com.kelompok2.survey_backend.repositories.SurveyCategoryRepository;
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
    private final SurveyCategoryRepository surveyCategoryRepository;

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
        List<SurveyDto> surveyRepo = surveyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        for (SurveyDto survey : surveyRepo) {
            survey.setResponseCount(surveyResponseRepository.countBySurveyId(survey.getId()));
        }

        return surveyRepo;
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

    private Question mapQuestionToEntity(QuestionDto dto, Survey survey) {
        Question question = new Question();
        question.setId(dto.getId());
        question.setQuestionText(dto.getQuestionText());
        question.setQuestionType(dto.getQuestionType());
        question.setOrderNumber(dto.getOrderNumber());
        question.setSurvey(survey);

        if (dto.getOptions() != null) {
            List<QuestionOption> options = dto.getOptions().stream()
                    .map(optionDto -> {
                        QuestionOption option = new QuestionOption();
                        option.setId(optionDto.getId());
                        option.setOptionText(optionDto.getOptionText());
                        option.setOrderNumber(optionDto.getOrderNumber());
                        option.setQuestion(question);
                        return option;
                    })
                    .collect(Collectors.toList());
            question.setOptions(options);
        }

        return question;
    }

    private Survey mapToEntity(SurveyDto dto) {
        Survey survey = new Survey();
        survey.setId(dto.getId());
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setDurationMinutes(dto.getDurationMinutes());

        if (dto.getCategoryId() != null) {
            SurveyCategory category = surveyCategoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            survey.setCategory(category);
        }

        if (dto.getQuestions() != null) {
            List<Question> questions = dto.getQuestions().stream()
                    .map(questionDto -> mapQuestionToEntity(questionDto, survey))
                    .collect(Collectors.toList());
            survey.setQuestions(questions);
        }
        return survey;
    }

    private SurveyDto mapToDto(Survey survey) {
        return new SurveyDto(
                survey.getId(),
                survey.getTitle(),
                survey.getDescription(),
                survey.getCategory() != null ? survey.getCategory().getId() : null,
                survey.getDurationMinutes(),
                survey.getResponseCount(),
                survey.getQuestions().stream()
                        .map(this::mapQuestionToDto)
                        .collect(Collectors.toList()),
                survey.getCreatedAt(),
                survey.getUpdatedAt()
        );
    }

    private QuestionDto mapQuestionToDto(Question question) {
        return new QuestionDto(
                question.getId(),
                question.getQuestionText(),
                question.getQuestionType(),
                question.getOrderNumber(),
                question.getOptions().stream()
                        .map(this::mapOptionToDto)
                        .collect(Collectors.toList())
        );
    }

    private QuestionOptionDto mapOptionToDto(QuestionOption option) {
        return new QuestionOptionDto(
                option.getId(),
                option.getOptionText(),
                option.getOrderNumber()
        );
    }
}