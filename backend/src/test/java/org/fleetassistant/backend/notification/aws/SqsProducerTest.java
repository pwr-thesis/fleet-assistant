package org.fleetassistant.backend.notification.aws;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.sqs.operations.SqsTemplate;
import org.aspectj.weaver.ast.Not;
import org.fleetassistant.backend.dto.Notification;
import org.fleetassistant.backend.exceptionhandler.rest.NotificationSendException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
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
        Notification notification = Notification.builder().message("Test").build();
        String notificationJson = "{\"message\":\"Test\"}";
        when(objectMapper.writeValueAsString(notification)).thenReturn(notificationJson);

        // Act
        sqsProducer.send(notification);

        // Assert
        verify(sqsTemplate, times(1)).send(null, notificationJson);
    }

    @Test
    void testSendNotification_JsonProcessingException() throws JsonProcessingException {
        // Arrange
        Notification notification = Notification.builder().message("Test").build();
        when(objectMapper.writeValueAsString(notification)).thenThrow(JsonProcessingException.class);

        // Act & Assert
        assertThrows(NotificationSendException.class, () -> sqsProducer.send(notification));
    }
}