package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.UserProfileDto;
import com.kelompok2.survey_backend.model.SurveyResponse;
import com.kelompok2.survey_backend.model.User;
import com.kelompok2.survey_backend.repositories.SurveyResponseRepository;
import com.kelompok2.survey_backend.repositories.UserProfileRepository;
import com.kelompok2.survey_backend.services.UserProfileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final SurveyResponseRepository surveyResponseRepository;

    @Override
    public List<UserProfileDto> getAllUserProfiles() {
        return userProfileRepository.findAll().stream()
                .map(profile -> {
                    User user = profile.getUser();
                    long surveysCompleted = surveyResponseRepository.countByUserId(user.getId());
                    LocalDateTime lastActive = surveyResponseRepository
                            .findTopByUserIdOrderByCompletedAtDesc(user.getId())
                            .map(SurveyResponse::getCompletedAt)
                            .orElse(null);

                    return new UserProfileDto(
                            user.getId(),
                            user.getUsername(),
                            profile.getFullName(),
                            profile.getEmail(),
                            profile.getPhone(),
                            profile.getAddress(),
                            profile.getOccupation(),
                            profile.getEducation(),
                            profile.getBirthDate(),
                            profile.getGender(),
                            user.getRole(),
                            (int) surveysCompleted,
                            lastActive
                    );
                })
                .collect(Collectors.toList());
    }
}