package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getUserStats(Long userId);
}