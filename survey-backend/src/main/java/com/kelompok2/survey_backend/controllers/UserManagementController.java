package com.kelompok2.survey_backend.controllers;

import com.kelompok2.survey_backend.dto.UserManagementDto;
import com.kelompok2.survey_backend.dto.UserUpdateDto;
import com.kelompok2.survey_backend.services.UserManagementService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@AllArgsConstructor
public class UserManagementController {
    private final UserManagementService userManagementService;

    @GetMapping
    public ResponseEntity<List<UserManagementDto>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserManagementDto> updateUser(@PathVariable Long id, @RequestBody UserUpdateDto updateDto) {
        return ResponseEntity.ok(userManagementService.updateUser(id, updateDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userManagementService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}