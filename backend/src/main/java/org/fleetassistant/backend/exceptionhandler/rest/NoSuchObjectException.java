package org.fleetassistant.backend.exceptionhandler.rest;

public class NoSuchObjectException extends RuntimeException {
    public NoSuchObjectException(String exception) {
        super(exception);
    }
}