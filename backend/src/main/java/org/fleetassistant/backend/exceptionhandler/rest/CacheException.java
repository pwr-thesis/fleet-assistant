package org.fleetassistant.backend.exceptionhandler.rest;

public class CacheException extends RuntimeException {
    public CacheException(String s) {
        super(s);
    }
}