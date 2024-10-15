package org.fleetassistant.backend.exceptionhandler.rest;

public class ObjectAlreadyExistsException extends RuntimeException {
    public ObjectAlreadyExistsException(String exception) {
        super(exception);
    }
}