package com.lunatech.library.api;

import com.lunatech.library.domain.Book;
import com.lunatech.library.domain.Checkout;
import com.lunatech.library.exception.BookNotFoundException;
import com.lunatech.library.exception.CheckoutException;
import com.lunatech.library.exception.CheckoutNotFoundException;
import com.lunatech.library.service.BookService;
import com.lunatech.library.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/checkouts")
@Slf4j
@RequiredArgsConstructor
public class CheckoutAPI {

    private final CheckoutService checkoutService;
    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<Checkout>> findAll() {
        return ResponseEntity.ok(checkoutService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Checkout> findById(@PathVariable Long id) {
        Checkout checkout = null;
        try {
            checkout = checkoutService.findById(id);
        }
        catch (CheckoutNotFoundException checkoutNotFoundException) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Checkout not found with id: " + Long.toString(id), checkoutNotFoundException);
        }

        return ResponseEntity.ok(checkout);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Checkout> update(@PathVariable Long id, @Valid @RequestBody Checkout checkout) {
        Long bookId = checkout.getBookId();

        try {
            // exists Checkout?
            checkoutService.findById(id);
            checkout.setId(id);

            // is there a book with book Id?
            bookService.findById(bookId);

            return ResponseEntity.ok(checkoutService.save(checkout));
        }
        catch (CheckoutNotFoundException checkoutNotFoundException) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Checkout not found with id: " + Long.toString(id), checkoutNotFoundException);
        }
        catch (BookNotFoundException bookNotFoundException) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Book not found with id: " + Long.toString(bookId), bookNotFoundException);
        }
        catch (CheckoutException checkoutException) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, checkoutException.getMessage(), checkoutException);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        try {
            checkoutService.deleteById(id);
        }
        catch (CheckoutNotFoundException checkoutNotFoundException) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Checkout not found with id: " + Long.toString(id), checkoutNotFoundException);
        }
        return ResponseEntity.ok().build();
    }
}
