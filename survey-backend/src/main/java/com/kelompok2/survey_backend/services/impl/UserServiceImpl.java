package com.kelompok2.survey_backend.services.impl;

import com.kelompok2.survey_backend.dto.UserDto;
import com.kelompok2.survey_backend.mapper.UserMapper;
import com.kelompok2.survey_backend.model.User;
import com.kelompok2.survey_backend.repositories.UserRepository;
import com.kelompok2.survey_backend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    // Create a new user
    @Override
    public UserDto createUser(UserDto userDto) {

        User user = UserMapper.mapToUser(userDto);
        User savedUser = userRepository.save(user);
        System.out.println(savedUser);

        return UserMapper.mapToUserDto(savedUser);
    }

    // Get user by ID
    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.mapToUserDto(user);
    }

    // Get all users
    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::mapToUserDto).collect(Collectors.toList());
    }
}
