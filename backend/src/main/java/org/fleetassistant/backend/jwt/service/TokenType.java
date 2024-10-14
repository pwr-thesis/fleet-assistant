package org.fleetassistant.backend.jwt.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public enum TokenType {
    ACCESS_TOKEN(60, ChronoUnit.MINUTES),
    REFRESH_TOKEN(2, ChronoUnit.DAYS),
    EMAIL_VALIDATION(1, ChronoUnit.DAYS);
    private final long duration;
    private final ChronoUnit chronoUnit;

    TokenType(long duration, ChronoUnit unit) {
        this.duration = duration;
        this.chronoUnit = unit;
    }

    public Date getExpiryDate() {
        Instant expiryInstant = Instant.now().plus(duration, chronoUnit);
        return Date.from(expiryInstant);
    }
}