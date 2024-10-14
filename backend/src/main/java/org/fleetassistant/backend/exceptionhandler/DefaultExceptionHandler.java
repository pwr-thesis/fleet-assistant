package org.fleetassistant.backend.exceptionhandler;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.fleetassistant.backend.exceptionhandler.nonrest.IncorrectTokenTypeException;
import org.fleetassistant.backend.exceptionhandler.rest.*;
import org.hibernate.ObjectNotFoundException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.zalando.problem.Problem;
import org.zalando.problem.Status;

import java.security.SignatureException;

import static org.fleetassistant.backend.utils.Constants.*;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class DefaultExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Problem> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();
        String errorMessage = fieldError != null ? fieldError.getDefaultMessage() : "Invalid request";
        Problem problem = buildProblem(Status.BAD_REQUEST, "Invalid request", errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    @ExceptionHandler(EmailNotFoundException.class)
    public ResponseEntity<Problem> handleEmailNotFoundException(RuntimeException ex) {
        Problem problem = buildProblem(Status.BAD_REQUEST, EMAIL_NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    @ExceptionHandler({ObjectNotFoundException.class, NoSuchObjectException.class})
    public ResponseEntity<Problem> handleNotFoundException(RuntimeException ex) {
        Problem problem = buildProblem(Status.NOT_FOUND, NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
    }

    @ExceptionHandler(ObjectAlreadyExistsException.class)
    public ResponseEntity<Problem> handleObjectAlreadyExists(RuntimeException ex) {
        Problem problem = buildProblem(Status.CONFLICT, ALREADY_EXIST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }

    @ExceptionHandler(WrongAuthenticationInstanceException.class)
    public ResponseEntity<Problem> handleWrongInstanceDetectedException(RuntimeException ex) {
        Problem problem = buildProblem(Status.FORBIDDEN, WRONG_AUTHENTICATION_INSTANCE, ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(problem);
    }


    @ExceptionHandler({ExpiredJwtException.class, SignatureException.class,
            MalformedJwtException.class})
    public ResponseEntity<Problem> handleJwtExceptions(RuntimeException e) {
        Problem problem = buildProblem(Status.UNAUTHORIZED, AUTHENTICATION_EXCEPTION, e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Problem> handleBadCredentials() {
        Problem problem = buildProblem(Status.UNAUTHORIZED, AUTHENTICATION_EXCEPTION, WRONG_EMAIL_OR_PASSWORD);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }

    @ExceptionHandler({CacheException.class, IncorrectTokenTypeException.class})
    public ResponseEntity<Problem> handleCacheError() {
        Problem problem = buildProblem(Status.SERVICE_UNAVAILABLE, Status.SERVICE_UNAVAILABLE.toString(),
                "Service unavailable");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problem);
    }

    @ExceptionHandler({InvalidTokenException.class, TokenRequiredException.class})
    public ResponseEntity<Problem> handleTokenExceptions(RuntimeException ex) {
        Problem problem = buildProblem(Status.BAD_REQUEST, TOKEN_ERROR, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    private Problem buildProblem(Status status, String title, String detail) {
        return Problem.builder()
                .withStatus(status)
                .withTitle(title)
                .withDetail(detail)
                .build();
    }
}