package com.lunatech.library.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

@Data
@EqualsAndHashCode(callSuper = false)
public class APIAuthorizationException extends AuthenticationException {

    public APIAuthorizationException(HttpStatus status, String message) {
        super(message, new APIException(status, message));
    }
}