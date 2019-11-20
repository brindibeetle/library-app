package com.lunatech.library.exception;

public class APIException extends RuntimeException {
    private final String message;

    APIException(String message) {
        this.message = message;
    }

    public String message() {
        return message;
    }
}