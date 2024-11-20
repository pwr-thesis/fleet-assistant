package org.fleetassistant.backend.exceptionhandler.rest;

public class AuthException extends RuntimeException {
    public AuthException(String e) {
        super(e);
    }
}