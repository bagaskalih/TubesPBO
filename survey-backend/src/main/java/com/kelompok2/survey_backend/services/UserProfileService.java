package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.UserProfileDto;

import java.util.List;

public interface UserProfileService {
    public List<UserProfileDto> getAllUserProfiles();
}
