package org.fleetassistant.backend.utils.config.security;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.user.model.User;
import org.fleetassistant.backend.user.service.ManagerService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtToUserConverter implements Converter<Jwt, UsernamePasswordAuthenticationToken> {
    private final CredentialsService credentialsService;
    private final ManagerService managerService;

    @Override
    @Transactional
    public UsernamePasswordAuthenticationToken convert(Jwt jwt) {
        String email = jwt.getClaim("email");
        Credentials credentials = credentialsService.loadUserByUsername(email);
        if (credentials == null) {
            credentials = credentialsService.create(email, Role.MANAGER);
            User user = managerService.createManager(jwt);
            user.setCredentials(credentials);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(credentials.getRole().name()));
        return new UsernamePasswordAuthenticationToken(credentials, jwt, authorities);
    }
}