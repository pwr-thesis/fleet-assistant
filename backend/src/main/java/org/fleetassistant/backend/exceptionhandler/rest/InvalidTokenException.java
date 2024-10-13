package org.fleetassistant.backend.exceptionhandler.rest;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException(String e) {
        super(e);
    }
}