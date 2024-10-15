package org.fleetassistant.backend.exceptionhandler.nonrest;

public class KeyPairCreationException extends RuntimeException {
    public KeyPairCreationException(String e) {
        super(e);
    }
}