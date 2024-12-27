package org.fleetassistant.backend.notification.aws;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.sqs.operations.SqsTemplate;
import org.fleetassistant.backend.dto.NotificationRequest;
import org.fleetassistant.backend.exceptionhandler.rest.NotificationSendException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SqsProducerTest {
    private SqsProducer sqsProducer;

    @Mock
    private SqsTemplate sqsTemplate;

    @Mock
    private ObjectMapper objectMapper;


    @BeforeEach
    void setUp() {
        sqsProducer = new SqsProducer(sqsTemplate, objectMapper);
    }

    @Test
    void testSendNotification_Success() throws JsonProcessingException {
        // Arrange
        NotificationRequest notificationRequest = NotificationRequest.builder().message("Test").build();
        String notificationJson = "{\"message\":\"Test\"}";
        when(objectMapper.writeValueAsString(notificationRequest)).thenReturn(notificationJson);

        // Act
        sqsProducer.send(notificationRequest);

        // Assert
        verify(sqsTemplate, times(1)).send(null, notificationJson);
    }

    @Test
    void testSendNotification_JsonProcessingException() throws JsonProcessingException {
        // Arrange
        NotificationRequest notificationRequest = NotificationRequest.builder().message("Test").build();
        when(objectMapper.writeValueAsString(notificationRequest)).thenThrow(JsonProcessingException.class);

        // Act & Assert
        assertThrows(NotificationSendException.class, () -> sqsProducer.send(notificationRequest));
    }
}