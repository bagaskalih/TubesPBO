package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.RankingDto;
import com.kelompok2.survey_backend.dto.CategoryStatsDto;
import com.kelompok2.survey_backend.model.SurveyResponse;
import com.kelompok2.survey_backend.repositories.SurveyResponseRepository;
import com.kelompok2.survey_backend.repositories.UserRepository;
import com.kelompok2.survey_backend.services.RankingService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RankingServiceImpl implements RankingService {

    private final SurveyResponseRepository responseRepository;
    private final UserRepository userRepository;

    @Override
    public List<RankingDto> getRankings() {
        return userRepository.findAll().stream()
                .map(user -> {
                    List<SurveyResponse> responses = responseRepository.findByUserId(user.getId());
                    return new RankingDto(
                            user.getUsername(),
                            responses.size(),
                            calculateCompletionRate(responses)
                    );
                })
                .sorted(Comparator.comparing(RankingDto::getTotalResponses).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryStatsDto> getCategoryStats() {
        Map<String, Long> stats = responseRepository.findAll().stream()
                .map(response -> response.getSurvey().getCategory().getName())
                .collect(Collectors.groupingBy(
                        category -> category,
                        Collectors.counting()
                ));

        return stats.entrySet().stream()
                .map(entry -> new CategoryStatsDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    private double calculateCompletionRate(List<SurveyResponse> responses) {
        if (responses.isEmpty()) return 0.0;
        long completed = responses.stream()
                .filter(r -> r.getCompletedAt() != null)
                .count();
        return (double) completed / responses.size();
    }
}