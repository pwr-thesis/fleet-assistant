package org.fleetassistant.backend.exceptionhandler.nonrest;

public class IncorrectTokenTypeException extends RuntimeException {

    public static final String INCORRECT_TOKEN_TYPE_EXCEPTION = "Incorrect token type exception";

    public IncorrectTokenTypeException() {
        super(INCORRECT_TOKEN_TYPE_EXCEPTION);
    }
}