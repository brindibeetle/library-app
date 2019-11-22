package com.lunatech.library.api;

import com.lunatech.library.domain.Checkout;
import com.lunatech.library.service.BookService;
import com.lunatech.library.service.CheckoutService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/checkouts")
@Slf4j
@RequiredArgsConstructor
public class CheckoutAPI {

    private final CheckoutService checkoutService;
    private final BookService bookService;

    @GetMapping( produces = "application/json" )
    @ApiOperation(value = "Get all checkouts from the repository", response = List.class)
    public ResponseEntity<List<Checkout>> findAll() {
        return ResponseEntity.ok(checkoutService.findAll());
    }

    @GetMapping(path = "/{id}", produces = "application/json" )
    @ApiOperation(value = "Get a checkout from the repository", response = Checkout.class)
    public ResponseEntity<Checkout> findById(@PathVariable Long id) {
        Checkout checkout = checkoutService.findById(id);
        return ResponseEntity.ok(checkout);
    }

    @PutMapping(path = "/{id}", consumes = "application/json", produces = "application/json" )
    @ApiOperation(value = "Change a checkout in the repository", response = Checkout.class)
    public ResponseEntity<Checkout> update(@PathVariable Long id, @Valid @RequestBody Checkout checkout) {
        Long bookId = checkout.getBookId();

        // exists Checkout?
        checkoutService.findById(id);
        checkout.setId(id);

        // is there a book with book Id?
        bookService.findById(bookId);

        return ResponseEntity.ok(checkoutService.save(checkout));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete a checkout from the repository")
    public ResponseEntity delete(@PathVariable Long id) {
        // exists Checkout?
        checkoutService.findById(id);

        checkoutService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
