package com.lunatech.library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Book Not Found")
public class BookNotFoundException extends APIException {

    public BookNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
