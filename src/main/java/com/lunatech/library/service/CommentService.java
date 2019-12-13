package com.lunatech.library.service;

import com.lunatech.library.domain.Comment;
import com.lunatech.library.exception.APIException;
import com.lunatech.library.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final CommentRepository repository;
    private final UtilityService utilityService;

    private void defaultsValues(Comment comment) {
        if (comment.getDateTime() == null) {
            comment.setDateTime(utilityService.currentDateTime());
        }
        if (comment.getUserEmail() == null) {
            comment.setUserEmail(utilityService.userEmail());
        }
    }

    public List<Comment> findAll() {
        return repository.findAll();
    }

    public Comment findById(Long id) {
        Optional<Comment> optionalComment = repository.findById(id);
        if (!optionalComment.isPresent()) {
            throw new APIException(HttpStatus.NOT_FOUND, "Comment not found in repository, id: " + id);
        }
        return optionalComment.get();
    }

    public List<Comment> findByBookId(Long bookId, Optional<ZonedDateTime> optFrom, Optional<ZonedDateTime> optTo) {
        ZonedDateTime from = optFrom.orElse(utilityService.zeroDateTime());
        ZonedDateTime to = optTo.orElse(utilityService.infiniteDateTime());

        return repository.findByBookId(bookId, from, to);
    }

    public Comment save(Comment comment) {
        defaultsValues(comment);
        return repository.save(comment);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
