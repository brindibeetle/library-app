package com.lunatech.library.api;

import com.lunatech.library.domain.Book;
import com.lunatech.library.domain.Checkout;
import com.lunatech.library.exception.APIException;
import com.lunatech.library.service.BookService;
import com.lunatech.library.service.CheckoutService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@Slf4j
@RequiredArgsConstructor
public class LibraryAPI {

    private final CheckoutService checkoutService;
    private final BookService bookService;

    @PutMapping(path = "/checkout/{bookId}", produces = "application/json" )
    @ApiOperation(value = "Do a checkout of a book"
            , notes = "date, datetime, email are optional parameters, example calls : " +
            "<ul> " +
            "     <li>/api/v1/checkout/1 checks in book 1 at the current time and for the current user</li>" +
            "     <li>/api/v1/checkout/1?email=luna.tlabech@lunatech.com checks out book 1 for luna.tlabech@lunatech.com</li>" +
            "     <li>/api/v1/checkout/1?date=12-12-2019 checks out book 1 at the given date at noon</li>" +
            "     <li>/api/v1/checkout/1?datetime=12-12-2019T10:30:00Z checks out book 1 at the given date and time</li>" +
            "</ul>"
            , response = Checkout.class)
    public ResponseEntity doCheckout(@PathVariable Long bookId, @RequestParam Map<String, String> varsMap) {
        // is there a book with book Id?
        Book book = bookService.findById(bookId);

        String optNotRecognized =
                varsMap
                        .entrySet()
                        .stream()
                        .filter(map -> " date datetime email ".indexOf((" " + map.getKey() + " ").toLowerCase()) == -1)
                        .map(map -> map.getKey())
                        .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                        .toString();
        if (! optNotRecognized.isEmpty()) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Parameter(s) not recognized " + optNotRecognized);
        }

        Optional<ZonedDateTime> optDateTime;
        try {
            optDateTime =
                    varsMap
                            .entrySet()
                            .stream()
                            .filter(map -> map.getKey().equalsIgnoreCase("date"))
                            .map(map -> map.getValue())
                            .map(map -> map.concat("T12:00:00Z"))
                            .map(map -> ZonedDateTime.parse(map, DateTimeFormatter.ISO_ZONED_DATE_TIME))
                            .findFirst();
            if (!optDateTime.isPresent()) {
                optDateTime =
                        varsMap
                                .entrySet()
                                .stream()
                                .filter(map -> map.getKey().equalsIgnoreCase("datetime"))
                                .map(map -> map.getValue())
                                .map(map -> ZonedDateTime.parse(map, DateTimeFormatter.ISO_ZONED_DATE_TIME))
                                .findFirst();
            }
        }
        catch (DateTimeParseException dateTimeParseException) {
            throw new APIException(HttpStatus.BAD_REQUEST, dateTimeParseException.getMessage());
        }

        Optional<String> optEmail =
                varsMap
                        .entrySet()
                        .stream()
                        .filter(map -> map.getKey().equalsIgnoreCase("email"))
                        .map(map -> map.getValue())
                        .findFirst();

        return ResponseEntity.ok(checkoutService.checkout(bookId, optEmail, optDateTime));
    }

    @PutMapping(path = "/checkin/{bookId}", produces = "application/json" )
    @ApiOperation(value = "Do a check in of a book"
            , notes = "date, datetime are optional parameters, example calls : " +
            "<ul> " +
            "     <li>/api/v1/checkin/1 checks in book 1 at the current time</li>" +
            "     <li>/api/v1/checkin/1?date=12-12-2019 checks in book 1 at the given date at noon</li>" +
            "     <li>/api/v1/checkin/1?datetime=12-12-2019T10:30:00Z checks in book 1 at the given date and time</li>" +
            "</ul>"
            , response = Checkout.class)
    public ResponseEntity doCheckin(@PathVariable Long bookId, @RequestParam Map<String, String> varsMap) {
        // is there a book with book Id?
        Book book = bookService.findById(bookId);

        String optNotRecognized =
                varsMap
                        .entrySet()
                        .stream()
                        .filter(map -> " date datetime ".indexOf((" " + map.getKey() + " ").toLowerCase()) == -1)
                        .map(map -> map.getKey())
                        .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                        .toString();
        if (! optNotRecognized.isEmpty()) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Parameter(s) not recognized: " + optNotRecognized);
        }

        Optional<ZonedDateTime> optDateTime =
                varsMap
                        .entrySet()
                        .stream()
                        .filter(map -> map.getKey().equalsIgnoreCase("date"))
                        .map(map -> map.getValue())
                        .map(map -> map.concat("T12:00:00Z"))
                        .map(map -> ZonedDateTime.parse(map, DateTimeFormatter.ISO_ZONED_DATE_TIME))
                        .findFirst();
        if ( ! optDateTime.isPresent() ) {
            optDateTime =
                    varsMap
                            .entrySet()
                            .stream()
                            .filter(map -> map.getKey().equalsIgnoreCase("datetime"))
                            .map(map -> map.getValue())
                            .map(map -> ZonedDateTime.parse(map, DateTimeFormatter.ISO_ZONED_DATE_TIME))
                            .findFirst();
        }

        return ResponseEntity.ok(checkoutService.checkin(bookId, optDateTime));
    }
}
