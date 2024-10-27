package org.fleetassistant.backend.user.service;

import lombok.RequiredArgsConstructor;

import org.fleetassistant.backend.dto.User;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.user.repository.UserRepository;
import org.fleetassistant.backend.utils.Constants;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final EntityToDtoMapper entityToDtoMapper;

    public User getUserByEmail(String email) {
        return entityToDtoMapper.userToUserDto(userRepository.findByCredentials_Email(email)
                .orElseThrow(() -> new NoSuchObjectException(Constants.USER_DOESNT_EXIST)));
    }
}