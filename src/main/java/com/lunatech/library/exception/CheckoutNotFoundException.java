package com.lunatech.library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Checkout Not Found")
public class CheckoutNotFoundException extends Exception {

    public CheckoutNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
