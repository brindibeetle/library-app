package com.lunatech.library.repository;

import com.lunatech.library.domain.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    @Query(
            "SELECT c FROM Checkout c " +
                    "WHERE c.id <> :id " +
                    "and c.bookId = :bookId " +
                    "and c.dateTimeFrom <= :to and (c.dateTimeTo > :from or c.dateTimeTo = null)"
    )
    List<Checkout> findOtherCheckoutOfBookBetweenDates(@Param("id") Long id, @Param("bookId") Long bookId, @Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to);

    @Query(
            "SELECT c FROM Checkout c " +
                    "WHERE c.bookId = :bookId " +
                    "and c.dateTimeFrom <= :to and (c.dateTimeTo > :from or c.dateTimeTo = null)"
    )
    List<Checkout> findCheckoutOfBookBetweenDates(@Param("bookId") Long bookId, @Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to);

    @Query(
            "SELECT c FROM Checkout c " +
                    "WHERE c.bookId = :bookId " +
                    "and c.dateTimeFrom <= :to and (c.dateTimeTo > :from or c.dateTimeTo = null)"
    )
    List<Checkout> findByBookId(@Param("bookId") Long bookId, @Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to);

}
