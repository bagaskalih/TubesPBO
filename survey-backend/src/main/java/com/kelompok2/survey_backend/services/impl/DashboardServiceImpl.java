package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.DashboardStatsDto;
import com.kelompok2.survey_backend.model.SurveyResponse;
import com.kelompok2.survey_backend.repositories.SurveyResponseRepository;
import com.kelompok2.survey_backend.services.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private SurveyResponseRepository surveyResponseRepository;

    @Override
    public DashboardStatsDto getUserStats(Long userId) {
        List<SurveyResponse> responses = surveyResponseRepository.findByUserId(userId);

        List<DashboardStatsDto.RecentSurveyDto> recentSurveys = responses.stream()
                .filter(response -> response.getCompletedAt() != null)
                .sorted((a, b) -> b.getCompletedAt().compareTo(a.getCompletedAt()))
                .limit(5)
                .map(response -> new DashboardStatsDto.RecentSurveyDto(
                        response.getSurvey().getTitle(),
                        response.getCompletedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                ))
                .collect(Collectors.toList());

        return new DashboardStatsDto(
                (int) responses.stream().filter(r -> r.getCompletedAt() != null).count(),
                recentSurveys
        );
    }
}