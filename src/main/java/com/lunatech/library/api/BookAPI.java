package com.lunatech.library.api;

import com.lunatech.library.domain.Book;
import com.lunatech.library.exception.BookNotFoundException;
import com.lunatech.library.service.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/books")
@Slf4j
@RequiredArgsConstructor
public class BookAPI {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<Book>> findAll() {
        return ResponseEntity.ok(bookService.findAll());
    }

    @PostMapping
    public ResponseEntity create(@Valid @RequestBody Book book) {
        return ResponseEntity.ok(bookService.save(book));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> findById(@PathVariable Long id) {
        Book book = null;
        try {
            book = bookService.findById(id);
        }
        catch (BookNotFoundException ex) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Book not found with id: " + Long.toString(id), ex);
        }

        return ResponseEntity.ok(book);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @Valid @RequestBody Book book) {
        Book book1 = null;
        try {
            book1 = bookService.findById(id);
        }
        catch (BookNotFoundException ex) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Book not found with id: " + Long.toString(id), ex);
        }
        book.setId(id);
        return ResponseEntity.ok(bookService.save(book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        Book book = null;
        try {
            book = bookService.findById(id);
        }
        catch (BookNotFoundException ex) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Book not found with id: " + Long.toString(id), ex);
        }

        bookService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
