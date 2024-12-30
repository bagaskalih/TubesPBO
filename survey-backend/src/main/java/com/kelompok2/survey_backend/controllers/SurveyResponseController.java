package com.kelompok2.survey_backend.controllers;

import com.kelompok2.survey_backend.dto.ResponseDetailDto;
import com.kelompok2.survey_backend.dto.SurveyDto;
import com.kelompok2.survey_backend.dto.SurveyResponseDto;
import com.kelompok2.survey_backend.services.SurveyResponseService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class SurveyResponseController {

    private final SurveyResponseService surveyResponseService;

    @PostMapping("/{surveyId}/submit")
    public ResponseEntity<SurveyResponseDto> submitSurvey(
            @PathVariable Long surveyId,
            @RequestBody SurveyResponseDto responseDto) {
        SurveyResponseDto response = surveyResponseService.submitResponse(surveyId, responseDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/responses/user/{userId}")
    public ResponseEntity<List<SurveyResponseDto>> getUserResponses(@PathVariable Long userId) {
        List<SurveyResponseDto> responses = surveyResponseService.getUserResponses(userId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{surveyId}/user/{userId}/completed")
    public ResponseEntity<Boolean> hasUserCompletedSurvey(
            @PathVariable Long surveyId,
            @PathVariable Long userId) {
        boolean completed = surveyResponseService.hasUserCompletedSurvey(userId, surveyId);
        return new ResponseEntity<>(completed, HttpStatus.OK);
    }

    @GetMapping("/{surveyId}/responses")
    public ResponseEntity<List<ResponseDetailDto>> getSurveyResponses(@PathVariable Long surveyId) {
        return ResponseEntity.ok(surveyResponseService.getSurveyResponses(surveyId));
    }
}