package com.lunatech.library.api;

import com.lunatech.library.domain.Book;
import com.lunatech.library.domain.Checkout;
import com.lunatech.library.exception.BookNotFoundException;
import com.lunatech.library.exception.CheckoutException;
import com.lunatech.library.service.BookService;
import com.lunatech.library.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.naming.AuthenticationException;
import java.sql.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@Slf4j
@RequiredArgsConstructor
public class LibraryAPI {

    private final CheckoutService checkoutService;
    private final BookService bookService;


    @PutMapping("/checkout/{bookId}")
    public ResponseEntity doCheckout(@PathVariable Long bookId, @RequestBody LibraryAPIBodyParams libraryAPIBodyParams) {
        try {
            // is there a book with book Id?
            Book book = bookService.findById(bookId);

            Optional<String> optUsername = Optional.ofNullable(libraryAPIBodyParams.getUsername());
            Optional<Date> optDate = Optional.ofNullable(libraryAPIBodyParams.getDate());

            return ResponseEntity.ok(checkoutService.checkout(bookId, optUsername, optDate));
        }
        catch (BookNotFoundException bookNotFoundException) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Book not found with id: " + Long.toString(bookId), bookNotFoundException);
        }
        catch (CheckoutException checkoutException) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, checkoutException.getMessage(), checkoutException);
        }
        catch (AuthenticationException authenticationException) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, authenticationException.getMessage(), authenticationException);
        }
    }

    @PutMapping("/checkin/{bookId}")
    public ResponseEntity doCheckin(@PathVariable Long bookId, @RequestBody Optional<LibraryAPIBodyParams> optionalLibraryAPIBodyParams) {
        try {
            // is there a book with book Id?
            Book book = bookService.findById(bookId);

            Optional<Date> optDate = Optional.empty();
            if (optionalLibraryAPIBodyParams.isPresent()) {
                optDate = Optional.ofNullable(optionalLibraryAPIBodyParams.get().getDate());
            }

            return ResponseEntity.ok(checkoutService.checkin(bookId, optDate));
        }
        catch (BookNotFoundException bookNotFoundException) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Book not found with id: " + Long.toString(bookId), bookNotFoundException);
        }
        catch (CheckoutException ce) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, ce.getMessage(), ce);
        }
    }

}
