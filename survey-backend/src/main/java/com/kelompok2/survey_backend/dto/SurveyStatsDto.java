package com.kelompok2.survey_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SurveyStatsDto {
    private int totalSurveys;
    private int completedSurveys;
    private int availableSurveys;
}