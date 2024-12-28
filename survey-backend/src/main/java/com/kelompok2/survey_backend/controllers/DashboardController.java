package com.kelompok2.survey_backend.controllers;

import com.kelompok2.survey_backend.dto.DashboardStatsDto;
import com.kelompok2.survey_backend.services.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/surveys/stats")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private DashboardService dashboardService;

    @GetMapping("/{userId}")
    public ResponseEntity<DashboardStatsDto> getUserStats(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getUserStats(userId));
    }
}