package org.fleetassistant.backend.exceptionhandler.rest;

public class WrongAuthenticationInstanceException extends RuntimeException {
    public WrongAuthenticationInstanceException(String e) {
        super(e);
    }
}