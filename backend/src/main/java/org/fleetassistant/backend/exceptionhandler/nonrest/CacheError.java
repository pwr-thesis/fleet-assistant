
package org.fleetassistant.backend.exceptionhandler.nonrest;

public class CacheError extends RuntimeException {
    public CacheError(String s) {
        super(s);
    }
}