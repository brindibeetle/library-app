package com.lunatech.library.utils;

import com.lunatech.library.exception.APIException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserUtils {

    private UserUtils() {
    }

    public static String username() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new APIException(HttpStatus.UNAUTHORIZED, "Anonimous user not allowed");
        }
        String currentUserName = authentication.getName();
        return currentUserName;
    }

    public static String userEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new APIException(HttpStatus.UNAUTHORIZED, "Anonymous user not allowed");
        }
        String currentUserEmail = authentication.getName();
        return currentUserEmail;
    }

}
