package org.fleetassistant.backend.exceptionhandler.rest;

public class AccountIsActiveException extends RuntimeException {
    public AccountIsActiveException(String e) {
        super(e);
    }
}