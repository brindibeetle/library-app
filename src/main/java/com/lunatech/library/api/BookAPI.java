package com.lunatech.library.api;

import com.lunatech.library.domain.Book;
import com.lunatech.library.service.BookService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@Slf4j
@RequiredArgsConstructor
@Api(value="Managing books")
public class BookAPI {

    private final BookService bookService;

    @GetMapping( produces = "application/json" )
    @ApiOperation(value = "Get all books from the repository", response = List.class)
    public ResponseEntity<List<Book>> findAll() {
        return ResponseEntity.ok(bookService.findAll());
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    @ApiOperation(value = "Add a book to the repository", response = Book.class)
    public ResponseEntity<Book> create(@Valid @RequestBody Book book) {
        return ResponseEntity.ok(bookService.save(book));
    }

    @GetMapping( path = "/{id}", produces = "application/json" )
    @ApiOperation(value = "Get a book from the repository", response = Book.class)
    public ResponseEntity<Book> findById(@PathVariable Long id) {
        Book book = bookService.findById(id);

        return ResponseEntity.ok(book);
    }

    @PutMapping(path = "/{id}", consumes = "application/json", produces = "application/json" )
    @ApiOperation(value = "Change a book in the repository", response = Book.class)
    public ResponseEntity<Book> update(@PathVariable Long id, @Valid @RequestBody Book book) {
        // to evoke Exception if boook not exists
        Book book1 = bookService.findById(id);

        book.setId(id);
        return ResponseEntity.ok(bookService.save(book));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete a book from the repository")
    public ResponseEntity delete(@PathVariable Long id) {
        // to evoke Exception if boook not exists
        Book book = bookService.findById(id);

        bookService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
