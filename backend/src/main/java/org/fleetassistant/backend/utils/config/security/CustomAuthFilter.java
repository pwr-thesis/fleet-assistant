package org.fleetassistant.backend.utils.config.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.utils.config.security.decoders.CustomJwtDecoder;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthFilter extends OncePerRequestFilter {
    private final CustomJwtDecoder decoder;
    private final JwtToUserConverter jwtToUserConverter;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        try {
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);

                Jwt x = decoder.decode(token);
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = jwtToUserConverter.convert(x);
                if (usernamePasswordAuthenticationToken != null) {
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }
            filterChain.doFilter(request, response);
        } catch (JwtException | ExpiredJwtException e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
        } catch (ServletException | IOException e) {
            throw new RuntimeException(e);
        }
    }
}
