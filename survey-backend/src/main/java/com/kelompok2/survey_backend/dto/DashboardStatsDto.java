package com.kelompok2.survey_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private int totalCompleted;
    private List<RecentSurveyDto> recentSurveys;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentSurveyDto {
        private String title;
        private String completedAt;
    }
}