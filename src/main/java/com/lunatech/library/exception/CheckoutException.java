package com.lunatech.library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Could not Checkout")
public class CheckoutException extends Exception {

    public CheckoutException(String errorMessage) {
        super(errorMessage);
    }
}
