package com.kelompok2.survey_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String occupation;
    private String education;
    private String birthDate;
    private String gender;
    private String role;
    private int surveysCompleted;
    private LocalDateTime lastActive;
}