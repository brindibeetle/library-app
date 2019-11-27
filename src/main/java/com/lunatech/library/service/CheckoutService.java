package com.lunatech.library.service;

import com.lunatech.library.domain.Checkout;
import com.lunatech.library.exception.APIException;
import com.lunatech.library.repository.BookRepository;
import com.lunatech.library.repository.CheckoutRepository;
import com.lunatech.library.utils.TimeUtils;
import com.lunatech.library.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final CheckoutRepository checkoutRepository;
    private final BookRepository bookRepository;

    private void check4ConflictingCheckout(Long bookId, ZonedDateTime fromDateTime) {
        ZonedDateTime toDateTime = TimeUtils.infiniteDateTime();
        List<Checkout> checkouts = checkoutRepository.findCheckoutOfBookBetweenDates(bookId, fromDateTime, toDateTime);

        if (!checkouts.isEmpty()) {
            Checkout checkout1 = checkouts.get(0);
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

    //    private void check4ConflictingCheckout(Long id, Long bookId, ZonedDateTime fromDateTime, ZonedDateTime toDateTime) {
//        List<Checkout> checkouts = checkoutRepository.findOtherCheckoutOfBookBetweenDates(id, bookId, fromDateTime, toDateTime);
//
//        if (!checkouts.isEmpty()) {
//            Checkout checkout1 = checkouts.get(0);
//            throw new APIException(
//                    HttpStatus.CONFLICT
//                    , "Book has already been checked out "
//                    + "id: " + checkout1.getId()
//                    + " from: " + checkout1.getDateTimeFrom()
//                    + (checkout1.getDateTimeTo() != null ? " to: " + checkout1.getDateTimeTo() : "")
//                    + " by: " + checkout1.getUserEmail()
//            );
//        }
//    }
//
    private Checkout findCheckout(Long bookId, ZonedDateTime dateTime) {
        ZonedDateTime toDateTime = TimeUtils.infiniteDateTime();
        List<Checkout> checkouts = checkoutRepository.findCheckoutOfBookBetweenDates(bookId, dateTime, toDateTime);

        if (checkouts.isEmpty()) {
            throw new APIException(HttpStatus.CONFLICT
                    , "Book has not been checked out "
                    + "book id: " + bookId
                    + " at: " + dateTime);
        }

        return checkouts.get(0);
    }

    public List<Checkout> findByBookId(Long bookId, Optional<ZonedDateTime> optFrom, Optional<ZonedDateTime> optTo) {
        ZonedDateTime from = optFrom.orElse(TimeUtils.zeroDateTime());
        ZonedDateTime to = optTo.orElse(TimeUtils.infiniteDateTime());

        return checkoutRepository.findByBookId(bookId, from, to);
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

        // NullPointerException will occur when refactoring this to the orElse-construct during Unittest, because then UserUtils.userEmail is evaluated (superfluously!)
        String userEmail = optUserEmail.isPresent() ? optUserEmail.get() : UserUtils.userEmail();
        ZonedDateTime dateTime = optDateTime.orElse(TimeUtils.currentDateTime());

        check4ConflictingCheckout(bookId, dateTime);

        Checkout checkout = new Checkout(-1L, bookId, dateTime, null, userEmail);
        return save(checkout);
    }

    // Checkin
    public Checkout checkin(Long bookId, Optional<ZonedDateTime> optDateTime) {

        ZonedDateTime dateTime = optDateTime.orElse(TimeUtils.currentDateTime());

        Checkout checkout = findCheckout(bookId, dateTime);
        checkout.setDateTimeTo(dateTime);

        return save(checkout);
    }

    public Checkout save(Checkout checkout) {
        ZonedDateTime checkoutDateFrom = checkout.getDateTimeFrom();
        if (checkoutDateFrom.isAfter(TimeUtils.currentDateTime())) {
            throw new APIException(HttpStatus.CONFLICT, "The from date cannot be in the future.");
        }

        ZonedDateTime checkoutDateTimeTo = checkout.getDateTimeTo();
        if (checkoutDateTimeTo == null) {
            checkoutDateTimeTo = TimeUtils.infiniteDateTime();
        } else if (checkoutDateTimeTo.isAfter(TimeUtils.currentDateTime())) {
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
