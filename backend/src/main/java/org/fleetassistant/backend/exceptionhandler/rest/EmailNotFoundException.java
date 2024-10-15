package org.fleetassistant.backend.exceptionhandler.rest;

public class EmailNotFoundException extends RuntimeException{
    public EmailNotFoundException(String e) {
        super(e);
    }
}