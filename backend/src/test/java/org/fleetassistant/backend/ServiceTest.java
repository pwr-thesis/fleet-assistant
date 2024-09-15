package org.fleetassistant.backend;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;


class ServiceTest {

    @Test
    void plus() {
        assertEquals(4, Service.plus(2, 2));
    }
}