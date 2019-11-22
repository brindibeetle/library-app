package com.lunatech.library.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class APIException extends RuntimeException {

    private final HttpStatus status;

    private final String message;

}