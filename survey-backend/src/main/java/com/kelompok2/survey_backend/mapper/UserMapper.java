package com.kelompok2.survey_backend.mapper;

import com.kelompok2.survey_backend.dto.UserDto;
import com.kelompok2.survey_backend.model.User;

public class UserMapper {
    public static UserDto mapToUserDto(User user) {
        return new UserDto(
            user.getId(),
            user.getUsername(),
            user.getPassword(),
            user.getRole()
        );
    }

    public static User mapToUser(UserDto userDto) {
        return new User(
            userDto.getId(),
            userDto.getUsername(),
            userDto.getPassword(),
            userDto.getRole()
        );
    }
}
