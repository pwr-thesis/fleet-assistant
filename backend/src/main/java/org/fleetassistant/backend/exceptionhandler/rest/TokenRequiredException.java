package org.fleetassistant.backend.exceptionhandler.rest;

public class TokenRequiredException extends RuntimeException {
    public TokenRequiredException(String e) {
        super(e);
    }
}