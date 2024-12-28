package com.kelompok2.survey_backend.dto;

import com.kelompok2.survey_backend.model.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class QuestionDto {
    private Long id;
    private String questionText;
    private QuestionType questionType;
    private Integer orderNumber;
    private List<QuestionOptionDto> options;
}