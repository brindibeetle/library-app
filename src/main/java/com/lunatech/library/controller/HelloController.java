package com.lunatech.library.controller;

import com.lunatech.library.domain.Book;
import com.lunatech.library.domain.Checkout;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class HelloController {

    @RequestMapping("/greeting")
    public Book greeting() {

        String authors = getUsername();
        return new Book(1L, "Hello world", authors, "Description");
//        return new Book(1L, "Hello world", authors, "Description", new ArrayList<Checkout>());
    }

    private String getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String currentUserName = authentication.getName();
            return currentUserName;
        }
        return "**UNKNOWN**";
    }
}
