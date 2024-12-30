package com.kelompok2.survey_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDetailDto {
    private Long id;
    private Long userId;
    private String username;
    private LocalDateTime completedAt;
    private List<AnswerDetailDto> answers;
}

