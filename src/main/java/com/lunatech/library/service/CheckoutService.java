package com.lunatech.library.service;

import com.lunatech.library.domain.Book;
import com.lunatech.library.domain.Checkout;
import com.lunatech.library.exception.BookNotFoundException;
import com.lunatech.library.exception.CheckoutException;
import com.lunatech.library.exception.CheckoutNotFoundException;
import com.lunatech.library.repository.BookRepository;
import com.lunatech.library.repository.CheckoutRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Check;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;
import java.sql.Date;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final CheckoutRepository checkoutRepository;
    private final BookRepository bookRepository;

    private static Date futureDate() {
        return new Date(Calendar.getInstance().getTimeInMillis() + 100 * 365 * 24 * 60 * 60 * 1000 );
    }
    private static Date currentDate() {
        return new Date(Calendar.getInstance().getTime().getTime());
    }
    private String username() throws AuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new AuthenticationException("Anonimous user not allowed");
        }

        String currentUserName = authentication.getName();
        return currentUserName;
    }
    private Long emptyId() {
        return -1L;
    }

    private void check4ConflictingCheckout(Long bookId, Date fromDate) throws CheckoutException{
        Date toDate = futureDate();
        Optional<List<Checkout>> checkoutOptionals = checkoutRepository.findCheckoutOfBookBetweenDates(bookId, fromDate, toDate);

        if (checkoutOptionals.isPresent()) {
            Checkout checkout1 = checkoutOptionals.get().get(0);
            throw new CheckoutException(
                    "Book has already been checked out "
                            + "id: " + checkout1.getId()
                            + " from: " + checkout1.getDateFrom()
                            + (checkout1.getDateTo() != null ? " to: " + checkout1.getDateTo() : "")
                            + " by: " + checkout1.getWho()
            );
        }
    }

    private void check4ConflictingCheckout(Long id, Long bookId, Date fromDate, Date toDate) throws CheckoutException{
        Optional<List<Checkout>> checkoutOptionals = checkoutRepository.findOtherCheckoutOfBookBetweenDates(id, bookId, fromDate, toDate);

        if (checkoutOptionals.isPresent()) {
            Checkout checkout1 = checkoutOptionals.get().get(0);
            throw new CheckoutException(
                    "Book has already been checked out "
                            + "id: " + checkout1.getId()
                            + " from: " + checkout1.getDateFrom()
                            + (checkout1.getDateTo() != null ? " to: " + checkout1.getDateTo() : "")
                            + " by: " + checkout1.getWho()
            );
        }
    }

    private Checkout findCheckout(Long bookId, Date date) throws CheckoutException{
        Optional<List<Checkout>> optionalCheckouts = checkoutRepository.findCheckoutOfBookBetweenDates(bookId, date, futureDate());

        if ( !optionalCheckouts.isPresent() || optionalCheckouts.get().size() == 0 ) {
            throw new CheckoutException("Book has not been checked out at: " + date);
        }

        return optionalCheckouts.get().get(0);
    }
    public List<Checkout> findAll() {
        return checkoutRepository.findAll();
    }

    public Checkout findById(Long id) throws CheckoutNotFoundException {
        Optional<Checkout> optionalCheckout = checkoutRepository.findById(id);
        if (!optionalCheckout.isPresent()) {
            throw new CheckoutNotFoundException("Book not found in repository");
        }
        return optionalCheckout.get();
    }

    // Checkout
    public Checkout checkout(Long bookId, Optional<String> optUsername, Optional<Date> optDate) throws CheckoutException, BookNotFoundException, AuthenticationException {

        String username = optUsername.isPresent() ? optUsername.get() : username();
        Date date = optDate.orElse(currentDate());

        check4ConflictingCheckout(bookId, date);

        Checkout checkout = new Checkout(-1L, bookId, date, null, username);
        return save(checkout);
    }

    // Checkin
    public Checkout checkin(Long bookId, Optional<Date> optDate) throws CheckoutException, BookNotFoundException {

        Date date = optDate.orElse(currentDate());

        Checkout checkout = findCheckout(bookId, date);
        checkout.setDateTo(date);

        return save(checkout);
    }

    public Checkout save(Checkout checkout) throws CheckoutException, BookNotFoundException {
        Date checkoutDateFrom = checkout.getDateFrom();
        if ( checkoutDateFrom.after(currentDate()) ) {
            throw new CheckoutException(
                    "The from date cannot be in the future."
            );
        }

        Date checkoutDateTo = checkout.getDateTo();
        if (checkoutDateTo == null) {
            checkoutDateTo = futureDate();
        }
        else if (checkoutDateTo.after(currentDate())) {
            throw new CheckoutException(
                    "The to date cannot be in the future."
            );
        }

        if (checkoutDateFrom.after(checkoutDateTo)) {
            throw new CheckoutException(
                    "The from date cannot be after the to date."
            );
        }

        return checkoutRepository.save(checkout);
    }

    public void deleteById(Long id) throws CheckoutNotFoundException {
        // exists checkout?
        findById(id);

        checkoutRepository.deleteById(id);
    }

}
