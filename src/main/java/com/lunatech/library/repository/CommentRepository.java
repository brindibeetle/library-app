package com.lunatech.library.repository;

import com.lunatech.library.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query(
            "SELECT c FROM Comment c " +
                    "WHERE c.bookId = :bookId " +
                    "and :from < c.dateTime and c.dateTime < :to"
    )
    List<Comment> findByBookId(@Param("bookId") Long bookId, @Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to);

}
