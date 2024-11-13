package com.kelompok2.survey_backend.services;

import com.kelompok2.survey_backend.dto.UserDto;

import java.util.List;

public interface UserService {
    UserDto createUser(UserDto userDto);
    UserDto getUserById(Long id);
    List<UserDto> getAllUsers();
}
