package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.AuthResponseDto;
import com.kelompok2.survey_backend.dto.LoginRequestDto;
import com.kelompok2.survey_backend.dto.RegisterRequestDto;
import com.kelompok2.survey_backend.model.User;
import com.kelompok2.survey_backend.repositories.UserRepository;
import com.kelompok2.survey_backend.services.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponseDto register(RegisterRequestDto registerDto) {
        // Check if username already exists
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(registerDto.getRole());

        User savedUser = userRepository.save(user);

        return new AuthResponseDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole(),
                "Registration successful"
        );
    }

    @Override
    public AuthResponseDto login(LoginRequestDto loginDto) {
        // Find user by username
        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        // Verify password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return new AuthResponseDto(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                "Login successful"
        );
    }
}