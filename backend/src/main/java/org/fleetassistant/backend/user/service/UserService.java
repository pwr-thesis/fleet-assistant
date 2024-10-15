package org.fleetassistant.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.user.model.User;
import org.fleetassistant.backend.user.repository.UserRepository;
import org.fleetassistant.backend.utils.Constants;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByCredentials_Email(email)
                .orElseThrow(() -> new NoSuchObjectException(Constants.USER_DOESNT_EXIST));
    }
}