package org.fleetassistant.backend.exceptionhandler.nonrest;

public class KeyPairNotFoundException extends RuntimeException {
    public KeyPairNotFoundException(String e) {
        super(e);
    }
}