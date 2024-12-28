package com.kelompok2.survey_backend.controllers;

import com.kelompok2.survey_backend.dto.SurveyDto;
import com.kelompok2.survey_backend.dto.SurveyStatsDto;
import com.kelompok2.survey_backend.services.SurveyService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class SurveyController {

    private final SurveyService surveyService;

    @GetMapping("/user-stats/{userId}")  // Changed from /stats/{userId}
    public ResponseEntity<SurveyStatsDto> getUserSurveyStats(@PathVariable Long userId) {
        SurveyStatsDto stats = surveyService.getUserSurveyStats(userId);
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<SurveyDto>> getAllSurveys() {
        List<SurveyDto> surveys = surveyService.getAllSurveys();
        return new ResponseEntity<>(surveys, HttpStatus.OK);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SurveyDto>> getSurveysByCategory(@PathVariable Long categoryId) {
        List<SurveyDto> surveys = surveyService.getSurveysByCategory(categoryId);
        return new ResponseEntity<>(surveys, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SurveyDto> getSurveyById(@PathVariable Long id) {
        SurveyDto survey = surveyService.getSurveyById(id);
        return new ResponseEntity<>(survey, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<SurveyDto> createSurvey(@RequestBody SurveyDto surveyDto) {
        SurveyDto createdSurvey = surveyService.createSurvey(surveyDto);
        return new ResponseEntity<>(createdSurvey, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SurveyDto> updateSurvey(@PathVariable Long id, @RequestBody SurveyDto surveyDto) {
        surveyDto.setId(id);
        SurveyDto updatedSurvey = surveyService.updateSurvey(surveyDto);
        return new ResponseEntity<>(updatedSurvey, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id) {
        surveyService.deleteSurvey(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}