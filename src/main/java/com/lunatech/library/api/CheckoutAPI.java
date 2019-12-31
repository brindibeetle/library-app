package com.lunatech.library.api;

import com.lunatech.library.domain.Checkout;
import com.lunatech.library.dto.CheckoutDTO;
import com.lunatech.library.service.BookService;
import com.lunatech.library.service.CheckoutService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/checkouts")
@Slf4j
@RequiredArgsConstructor
public class CheckoutAPI {

    private final CheckoutService checkoutService;
    private final BookService bookService;
    private final ModelMapper modelMapper;

    @GetMapping(produces = "application/json")
    @ApiOperation(value = "Get all checkouts from the repository", response = List.class)
    @ResponseBody
    public List<CheckoutDTO> findAll() {
        List<Checkout> checkouts = checkoutService.findAll();
        return checkouts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/current", produces = "application/json")
    @ApiOperation(value = "Get current checkouts from the repository", response = List.class)
    @ResponseBody
    public List<CheckoutDTO> findCurrent() {
        List<Checkout> checkouts = checkoutService.findCurrent();
        return checkouts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/{id}", produces = "application/json")
    @ApiOperation(value = "Get a checkout from the repository", response = CheckoutDTO.class)
    @ResponseBody
    public CheckoutDTO findById(@PathVariable Long id) {
        Checkout checkout = checkoutService.findById(id);
        return convertToDTO(checkout);
    }

    @GetMapping(path = "/book/{bookId}", produces = "application/json")
    @ApiOperation(value = "Get all checkouts on the book from the repository", response = List.class)
    @ResponseBody
    public List<CheckoutDTO> findByBookId(@PathVariable Long bookId) {
        List<Checkout> checkouts = checkoutService.findByBookId(bookId, Optional.empty(), Optional.empty());
        return checkouts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PutMapping(path = "/{id}", consumes = "application/json", produces = "application/json")
    @ApiOperation(value = "Change a checkout in the repository", response = CheckoutDTO.class)
    @ResponseStatus(HttpStatus.OK)
    public void update(@PathVariable Long id, @Valid @RequestBody CheckoutDTO checkoutDTO) {
        // exists the book?
        Long bookId = checkoutDTO.getBookId();
        bookService.findById(bookId);

        checkoutService.save(convertToEntity(id, checkoutDTO));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete a checkout from the repository")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Long id) {
        // exists Checkout?
        checkoutService.findById(id);

        checkoutService.deleteById(id);
    }

    private CheckoutDTO convertToDTO(Checkout checkout) {
        CheckoutDTO checkoutDTO = modelMapper.map(checkout, CheckoutDTO.class);
        return checkoutDTO;
    }

    private Checkout convertToEntity(Long id, CheckoutDTO checkoutDTO) {
        Checkout checkout = null;
        if (id == null || id == -1L) {
            checkout = new Checkout();
        } else {
            checkout = checkoutService.findById(id);
        }
        modelMapper.map(checkoutDTO, checkout);
        return checkout;
    }

}
