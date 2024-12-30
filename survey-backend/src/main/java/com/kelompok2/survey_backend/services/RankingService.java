package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.CategoryStatsDto;
import com.kelompok2.survey_backend.dto.RankingDto;

import java.util.List;

public interface RankingService {
    public List<RankingDto> getRankings();
    public List<CategoryStatsDto> getCategoryStats();
}
