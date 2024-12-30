package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.UserManagementDto;
import com.kelompok2.survey_backend.dto.UserUpdateDto;
import com.kelompok2.survey_backend.exceptions.BadRequestException;
import com.kelompok2.survey_backend.exceptions.ResourceNotFoundException;
import com.kelompok2.survey_backend.model.User;
import com.kelompok2.survey_backend.repositories.SurveyResponseRepository;
import com.kelompok2.survey_backend.repositories.UserRepository;
import com.kelompok2.survey_backend.services.UserManagementService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserManagementServiceImpl implements UserManagementService {
    private final UserRepository userRepository;
    private final SurveyResponseRepository responseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserManagementDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserManagementDto updateUser(Long id, UserUpdateDto updateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getUsername().equals(updateDto.getUsername()) &&
                userRepository.existsByUsername(updateDto.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        if ("ADMIN".equals(user.getRole()) && !"ADMIN".equals(updateDto.getRole())) {
            throw new BadRequestException("Cannot demote admin user");
        }

        user.setUsername(updateDto.getUsername());
        user.setRole(updateDto.getRole());

        return mapToDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if ("ADMIN".equals(user.getRole())) {
            throw new BadRequestException("Cannot delete admin user");
        }

        userRepository.delete(user);
    }

    private UserManagementDto mapToDto(User user) {
        long surveysCompleted = responseRepository.countByUserId(user.getId());
        return new UserManagementDto(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                (int) surveysCompleted
        );
    }
}