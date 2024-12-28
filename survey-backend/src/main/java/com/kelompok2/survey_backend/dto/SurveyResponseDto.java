package com.kelompok2.survey_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyResponseDto {
    private Long id;
    private Long surveyId;
    private Long userId;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private List<AnswerRecordDto> answers;
}