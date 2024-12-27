package com.kelompok2.survey_backend.controllers;

import com.kelompok2.survey_backend.dto.AuthResponseDto;
import com.kelompok2.survey_backend.dto.LoginRequestDto;
import com.kelompok2.survey_backend.dto.RegisterRequestDto;
import com.kelompok2.survey_backend.services.AuthService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerDto) {
        try {
            AuthResponseDto response = authService.register(registerDto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(new ErrorResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginDto) {
        try {
            AuthResponseDto response = authService.login(loginDto);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(new ErrorResponse(e.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }
}

@Setter
@Getter
class ErrorResponse {
    private String message;

    public ErrorResponse(String message) {
        this.message = message;
    }
}