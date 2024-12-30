package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.*;
import com.kelompok2.survey_backend.exceptions.BadRequestException;
import com.kelompok2.survey_backend.exceptions.ResourceNotFoundException;
import com.kelompok2.survey_backend.model.*;
import com.kelompok2.survey_backend.repositories.SurveyRepository;
import com.kelompok2.survey_backend.repositories.SurveyResponseRepository;
import com.kelompok2.survey_backend.repositories.UserRepository;
import com.kelompok2.survey_backend.services.SurveyResponseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SurveyResponseServiceImpl implements SurveyResponseService {
    private final SurveyResponseRepository responseRepository;
    private final SurveyRepository surveyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public SurveyResponseDto submitResponse(Long surveyId, SurveyResponseDto responseDto) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

        User user = userRepository.findById(responseDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (hasUserCompletedSurvey(user.getId(), surveyId)) {
            throw new BadRequestException("User has already completed this survey");
        }

        SurveyResponse response = new SurveyResponse();
        response.setSurvey(survey);
        response.setUser(user);
        response.setStartedAt(LocalDateTime.now());
        response.setCompletedAt(LocalDateTime.now());

        List<AnswerRecord> answers = responseDto.getAnswers().stream()
                .map(answerDto -> createAnswerRecord(answerDto, response))
                .collect(Collectors.toList());
        response.setAnswers(answers);

        return mapToDto(responseRepository.save(response));
    }

    @Override
    public List<SurveyResponseDto> getUserResponses(Long userId) {
        return responseRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean hasUserCompletedSurvey(Long userId, Long surveyId) {
        return responseRepository.findBySurveyIdAndUserId(surveyId, userId).isPresent();
    }

    // Helper methods
    private AnswerRecord createAnswerRecord(AnswerRecordDto dto, SurveyResponse response) {
        AnswerRecord answer = new AnswerRecord();
        answer.setResponse(response);
        answer.setQuestion(response.getSurvey().getQuestions().stream()
                .filter(q -> q.getId().equals(dto.getQuestionId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Question not found")));
        answer.setAnswerText(dto.getAnswerText());

        if (dto.getSelectedOptionId() != null) {
            answer.setSelectedOption(answer.getQuestion().getOptions().stream()
                    .filter(o -> o.getId().equals(dto.getSelectedOptionId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Option not found")));
        }

        return answer;
    }

    private SurveyResponseDto mapToDto(SurveyResponse response) {
        return new SurveyResponseDto(
                response.getId(),
                response.getSurvey().getId(),
                response.getUser().getId(),
                response.getStartedAt(),
                response.getCompletedAt(),
                mapAnswersToDto(response.getAnswers())
        );
    }

    private SurveyDto mapToSurveyDto(Survey survey) {
        return new SurveyDto(
                survey.getId(),
                survey.getTitle(),
                survey.getDescription(),
                survey.getCategory().getId(),
                survey.getDurationMinutes(),
                survey.getResponseCount(),
                mapQuestionsToDto(survey.getQuestions()),
                survey.getCreatedAt(),
                survey.getUpdatedAt()
        );
    }
    private List<AnswerRecordDto> mapAnswersToDto(List<AnswerRecord> answers) {
        return answers.stream()
                .map(answer -> new AnswerRecordDto(
                        answer.getQuestion().getId(),
                        answer.getAnswerText(),
                        answer.getSelectedOption() != null ? answer.getSelectedOption().getId() : null
                ))
                .collect(Collectors.toList());
    }

    private List<QuestionDto> mapQuestionsToDto(List<Question> questions) {
        return questions.stream()
                .map(question -> new QuestionDto(
                        question.getId(),
                        question.getQuestionText(),
                        question.getQuestionType(),
                        question.getOrderNumber(),
                        mapOptionsToDto(question.getOptions())
                ))
                .collect(Collectors.toList());
    }

    private List<QuestionOptionDto> mapOptionsToDto(List<QuestionOption> options) {
        return options.stream()
                .map(option -> new QuestionOptionDto(
                        option.getId(),
                        option.getOptionText(),
                        option.getOrderNumber()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ResponseDetailDto> getSurveyResponses(Long surveyId) {
        List<SurveyResponse> responses = responseRepository.findBySurveyId(surveyId);

        return responses.stream()
                .map(response -> {
                    List<AnswerDetailDto> answerDetails = response.getAnswers().stream()
                            .map(answer -> new AnswerDetailDto(
                                    answer.getQuestion().getId(),
                                    answer.getQuestion().getQuestionText(),
                                    answer.getAnswerText(),
                                    answer.getSelectedOption() != null ? answer.getSelectedOption().getId() : null,
                                    answer.getSelectedOption() != null ? answer.getSelectedOption().getOptionText() : null
                            ))
                            .collect(Collectors.toList());

                    return new ResponseDetailDto(
                            response.getId(),
                            response.getUser().getId(),
                            response.getUser().getUsername(),
                            response.getCompletedAt(),
                            answerDetails
                    );
                })
                .collect(Collectors.toList());
    }
}