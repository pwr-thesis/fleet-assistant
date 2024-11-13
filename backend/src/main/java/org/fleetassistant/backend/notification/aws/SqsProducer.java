package org.fleetassistant.backend.notification.aws;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.dto.Notification;
import org.fleetassistant.backend.exceptionhandler.rest.NotificationSendException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SqsProducer {
    private final SqsTemplate sqsTemplate;
    private final ObjectMapper objectMapper;
    @Value("${spring.cloud.aws.sqs.endpoint}")
    private String endpoint;

    public void send(Notification notification) {
        try {
            sqsTemplate.send(endpoint, objectMapper.writeValueAsString(notification));
        } catch (JsonProcessingException e) {
            throw new NotificationSendException("Error while sending notification");
        }
    }
}
