package com.kelompok2.survey_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionOptionDto {
    private Long id;
    private String optionText;
    private Integer orderNumber;
}