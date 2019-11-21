package com.lunatech.library.service;

import com.lunatech.library.domain.Book;
import com.lunatech.library.exception.APIException;
import com.lunatech.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final BookRepository repository;

    public List<Book> findAll() {
        return repository.findAll();
    }

    public Book findById(Long id) {
        Optional<Book> optionalBook = repository.findById(id);
        if (!optionalBook.isPresent()) {
            throw new APIException(HttpStatus.NOT_FOUND, "Book not found in repository, id: " + id);
        }
        return optionalBook.get();
    }

    public Book save(Book book) {
        return repository.save(book);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
