package org.fleetassistant.backend.utils;

import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class Constants {
    public static final String ALREADY_REGISTERED = "Such user has already registered";
    public static final String USER_DOESNT_EXIST = "Such user doesnt exist";
    public static final String ACCESS_TOKENS = "accessTokens";
    public static final String REFRESH_TOKENS = "refreshTokens";
    public static final String BLACK_LIST = "blackList";
    public static final String AUTHENTICATION_BEARER_TOKEN = "Bearer ";
    public static final String CACHE_NOT_FOUND = "Cache not found";
    public static final String ID = "id";
    public static final String ROLE = "role";
    public static final String EMAIL = "email";
    public static final String NAME = "name";
    public static final String TYPE = "type";
    public static final String SURNAME = "surname";
    public static final String WRONG_AUTHENTICATION_INSTANCE = "Wrong Authentication Instance";
    public static final String EMAIL_NOT_FOUND = "Email Not Found";
    public static final String NOT_FOUND = "Not Found";
    public static final String ALREADY_EXIST = "Already Exist";
    public static final String TOKEN_NEEDED = "Request should contain token.";
    public static final String TOKEN_HAS_BEEN_BANNED = "Token has been banned";
    public static final String AUTHENTICATION_EXCEPTION = "Authentication Exception";
    public static final String WRONG_EMAIL_OR_PASSWORD = "Wrong email or password";
    public static final String TOKEN_ERROR = "Invalid Token Error";
}