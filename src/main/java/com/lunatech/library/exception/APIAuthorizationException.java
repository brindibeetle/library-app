package com.lunatech.library.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

@Data
public class APIAuthorizationException extends AuthenticationException {

    public APIAuthorizationException(HttpStatus status, String message) {
        super(message, new APIException(status, message));
    }
}