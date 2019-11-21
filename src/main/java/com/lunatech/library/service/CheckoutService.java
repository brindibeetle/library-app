package com.lunatech.library.service;

import com.lunatech.library.domain.Checkout;
import com.lunatech.library.exception.APIException;
import com.lunatech.library.repository.BookRepository;
import com.lunatech.library.repository.CheckoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAmount;
import java.time.temporal.TemporalUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final CheckoutRepository checkoutRepository;
    private final BookRepository bookRepository;

    @Value("${time.zone.id}")
    private String timeZoneId;

    private ZonedDateTime futureDateTime() {
        Instant future = Instant.now().plusSeconds(10 * 7 * 24 * 60 * 60); // 10 weeks
        return ZonedDateTime.ofInstant(future, ZoneId.of(timeZoneId));
    }
    private ZonedDateTime currentDateTime() {
        Instant nowUtc = Instant.now();
        return ZonedDateTime.ofInstant(nowUtc, ZoneId.of(timeZoneId));
    }
    private String username() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new APIException(HttpStatus.UNAUTHORIZED, "Anonimous user not allowed");
        }
        String currentUserName = authentication.getName();
        return currentUserName;
    }
    private String userEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new APIException(HttpStatus.UNAUTHORIZED, "Anonymous user not allowed");
        }
        String currentUserEmail = authentication.getName();
        return currentUserEmail;
    }
    private Long emptyId() {
        return -1L;
    }

    private void check4ConflictingCheckout(Long bookId, ZonedDateTime fromDateTime) {
        ZonedDateTime toDateTime = futureDateTime();
        Optional<List<Checkout>> checkoutOptionals = checkoutRepository.findCheckoutOfBookBetweenDates(bookId, fromDateTime, toDateTime);

        if (checkoutOptionals.isPresent()) {
            Checkout checkout1 = checkoutOptionals.get().get(0);
            throw new APIException(
                    HttpStatus.CONFLICT
                    , "Book has already been checked out "
                            + "id: " + checkout1.getId()
                            + " from: " + checkout1.getDateTimeFrom()
                            + (checkout1.getDateTimeTo() != null ? " to: " + checkout1.getDateTimeTo() : "")
                            + " by: " + checkout1.getUserEmail()
            );
        }
    }

    private void check4ConflictingCheckout(Long id, Long bookId, ZonedDateTime fromDateTime, ZonedDateTime toDateTime) {
        Optional<List<Checkout>> checkoutOptionals = checkoutRepository.findOtherCheckoutOfBookBetweenDates(id, bookId, fromDateTime, toDateTime);

        if (checkoutOptionals.isPresent()) {
            Checkout checkout1 = checkoutOptionals.get().get(0);
            throw new APIException(
                    HttpStatus.CONFLICT
                    , "Book has already been checked out "
                            + "id: " + checkout1.getId()
                            + " from: " + checkout1.getDateTimeFrom()
                            + (checkout1.getDateTimeTo() != null ? " to: " + checkout1.getDateTimeTo() : "")
                            + " by: " + checkout1.getUserEmail()
            );
        }
    }

    private Checkout findCheckout(Long bookId, ZonedDateTime dateTime) {
        Optional<List<Checkout>> optionalCheckouts = checkoutRepository.findCheckoutOfBookBetweenDates(bookId, dateTime, futureDateTime());

        if ( !optionalCheckouts.isPresent() || optionalCheckouts.get().size() == 0 ) {
            throw new APIException(HttpStatus.CONFLICT
                    , "Book has not been checked out "
                    + "book id: " + bookId
                    + " at: " + dateTime);
        }

        return optionalCheckouts.get().get(0);
    }
    public List<Checkout> findAll() {
        return checkoutRepository.findAll();
    }

    public Checkout findById(Long id) {
        Optional<Checkout> optionalCheckout = checkoutRepository.findById(id);
        if (!optionalCheckout.isPresent()) {
            throw new APIException(HttpStatus.CONFLICT, "Checkout not found in repository, id: " + id);
        }
        return optionalCheckout.get();
    }

    // Checkout
    public Checkout checkout(Long bookId, Optional<String> optUserEmail, Optional<ZonedDateTime> optDateTime) {

        String userEmail = optUserEmail.isPresent() ? optUserEmail.get() : userEmail();
        ZonedDateTime dateTime = optDateTime.orElse(currentDateTime());

        check4ConflictingCheckout(bookId, dateTime);

        Checkout checkout = new Checkout(-1L, bookId, dateTime, null, userEmail);
        return save(checkout);
    }

    // Checkin
    public Checkout checkin(Long bookId, Optional<ZonedDateTime> optDateTime) {

        ZonedDateTime dateTime = optDateTime.orElse(currentDateTime());

        Checkout checkout = findCheckout(bookId, dateTime);
        checkout.setDateTimeTo(dateTime);

        return save(checkout);
    }

    public Checkout save(Checkout checkout) {
        ZonedDateTime checkoutDateFrom = checkout.getDateTimeFrom();
        if ( checkoutDateFrom.isAfter(currentDateTime()) ) {
            throw new APIException(HttpStatus.CONFLICT, "The from date cannot be in the future.");
        }

        ZonedDateTime checkoutDateTimeTo = checkout.getDateTimeTo();
        if (checkoutDateTimeTo == null) {
            checkoutDateTimeTo = futureDateTime();
        }
        else if (checkoutDateTimeTo.isAfter(currentDateTime())) {
            throw new APIException(HttpStatus.CONFLICT, "The to date cannot be in the future.");
        }

        if (checkoutDateFrom.isAfter(checkoutDateTimeTo)) {
            throw new APIException(HttpStatus.CONFLICT, "The from date cannot be after the to date."
            );
        }

        return checkoutRepository.save(checkout);
    }

    public void deleteById(Long id) {
        // exists checkout?
        checkoutRepository.findById(id);

        checkoutRepository.deleteById(id);
    }

}
