package com.lunatech.library.api;

import com.lunatech.library.domain.Book;
import com.lunatech.library.dto.BookDTO;
import com.lunatech.library.service.BookService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/books")
@Slf4j
@RequiredArgsConstructor
@Api(value = "Managing books")
public class BookAPI {

    private final BookService bookService;
    private final ModelMapper modelMapper;

    @GetMapping(produces = "application/json")
    @ApiOperation(value = "Get all books from the repository", response = List.class)
    @ResponseBody
    public List<BookDTO> findAll() {
        List<Book> books = bookService.findAll();
        return books.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/mine", produces = "application/json")
    @ApiOperation(value = "Get my books from the repository", response = List.class)
    @ResponseBody
    public List<BookDTO> findMyBooks() {
        List<Book> books = bookService.findMyBooks();
        return books.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    @ApiOperation(value = "Add a book to the repository", response = BookDTO.class)
    @ResponseBody
    public BookDTO create(@Valid @RequestBody BookDTO bookDTO) {
        Book book = convertToEntity(-1L, bookDTO);
        Book bookCreated = bookService.save(book);
        return convertToDTO(bookCreated);
    }

    @GetMapping(path = "/{id}", produces = "application/json")
    @ApiOperation(value = "Get a book from the repository", response = BookDTO.class)
    @ResponseBody
    public BookDTO findById(@PathVariable Long id) {
        Book book = bookService.findById(id);
        return convertToDTO(book);
    }

    @PutMapping(path = "/{id}", consumes = "application/json")
    @ApiOperation(value = "Change a book in the repository", response = BookDTO.class)
    @ResponseStatus(HttpStatus.OK)
    public void update(@PathVariable Long id, @Valid @RequestBody BookDTO bookDTO) {
        bookService.save(convertToEntity(id, bookDTO));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete a book from the repository")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Long id) {
        // to evoke Exception if book not exists
        bookService.findById(id);

        bookService.deleteById(id);
    }

    private BookDTO convertToDTO(Book book) {
        BookDTO bookDTO = modelMapper.map(book, BookDTO.class);
        return bookDTO;
    }

    private Book convertToEntity(Long id, BookDTO bookDTO) {
        Book book = null;
        if (id == null || id == -1L) {
            book = new Book();
        } else {
            book = bookService.findById(id);
        }
        modelMapper.map(bookDTO, book);
        return book;
    }
}
