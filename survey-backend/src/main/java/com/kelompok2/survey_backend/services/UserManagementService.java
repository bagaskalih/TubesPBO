package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.UserManagementDto;
import com.kelompok2.survey_backend.dto.UserUpdateDto;

import java.util.List;

public interface UserManagementService {
    public List<UserManagementDto> getAllUsers();
    public UserManagementDto updateUser(Long id, UserUpdateDto updateDto);
    public void deleteUser(Long id);
}
