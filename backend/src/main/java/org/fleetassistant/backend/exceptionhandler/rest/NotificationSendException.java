package org.fleetassistant.backend.exceptionhandler.rest;

public class NotificationSendException extends RuntimeException {
    public NotificationSendException(String e) {
        super(e);
    }
}