package com.kelompok2.survey_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class AnswerDetailDto {
    private Long questionId;
    private String questionText;
    private String answerText;
    private Long selectedOptionId;
    private String selectedOptionText;
}
