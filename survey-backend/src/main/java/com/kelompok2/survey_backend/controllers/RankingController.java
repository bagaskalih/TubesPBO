package com.kelompok2.survey_backend.controllers;

import com.kelompok2.survey_backend.dto.RankingDto;
import com.kelompok2.survey_backend.dto.CategoryStatsDto;
import com.kelompok2.survey_backend.services.RankingService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/rankings")
    public ResponseEntity<List<RankingDto>> getRankings() {
        return ResponseEntity.ok(rankingService.getRankings());
    }

    @GetMapping("/surveys/stats/categories")
    public ResponseEntity<List<CategoryStatsDto>> getCategoryStats() {
        return ResponseEntity.ok(rankingService.getCategoryStats());
    }

}