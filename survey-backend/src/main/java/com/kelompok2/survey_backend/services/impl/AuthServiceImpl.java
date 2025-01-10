package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.AuthResponseDto;
import com.kelompok2.survey_backend.dto.LoginRequestDto;
import com.kelompok2.survey_backend.dto.RegisterRequestDto;
import com.kelompok2.survey_backend.model.User;
import com.kelompok2.survey_backend.model.UserProfile;
import com.kelompok2.survey_backend.repositories.UserProfileRepository;
import com.kelompok2.survey_backend.repositories.UserRepository;
import com.kelompok2.survey_backend.services.AuthService;
import com.kelompok2.survey_backend.services.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private UserProfileRepository userProfileRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;

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

        // Create user profile
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        profile.setFullName(registerDto.getFullName());
        profile.setEmail(registerDto.getEmail());
        profile.setPhone(registerDto.getPhone());
        profile.setAddress(registerDto.getAddress());
        profile.setOccupation(registerDto.getOccupation());
        profile.setEducation(registerDto.getEducation());
        profile.setBirthDate(registerDto.getBirthDate());
        profile.setGender(registerDto.getGender());
        userProfileRepository.save(profile);

        return new AuthResponseDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole(),
                "Registration successful"
        );
    }

    @Override
    public AuthResponseDto login(LoginRequestDto loginDto) {
        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        
        return new AuthResponseDto(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                token
        );
    }
}