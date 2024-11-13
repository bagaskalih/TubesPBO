package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.AuthResponseDto;
import com.kelompok2.survey_backend.dto.LoginRequestDto;
import com.kelompok2.survey_backend.dto.RegisterRequestDto;

public interface AuthService {
    AuthResponseDto register(RegisterRequestDto registerDto);
    AuthResponseDto login(LoginRequestDto loginDto);
}