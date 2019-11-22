package com.lunatech.library.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
public class APIError {

    private HttpStatus status;
    private String message;
    private List<String> errors;

    public APIError(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
        this.errors = new ArrayList<>();
    }
    public APIError(HttpStatus status, String message, String error) {
            this.status = status;
            this.message = message;
            this.errors = Arrays.asList(error);
    }
    public APIError(HttpStatus status, String message, List<String> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}