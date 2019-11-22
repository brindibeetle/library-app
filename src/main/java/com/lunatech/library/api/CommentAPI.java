package com.lunatech.library.api;

import com.lunatech.library.domain.Book;
import com.lunatech.library.domain.Comment;
import com.lunatech.library.service.CommentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/comments")
@Slf4j
@RequiredArgsConstructor
@Api(value="Commenting books")
public class CommentAPI {

    private final CommentService commentService;

    @GetMapping( produces = "application/json" )
    @ApiOperation(value = "Get all comments from the repository", response = List.class)
    public ResponseEntity<List<Comment>> findAll() {
        return ResponseEntity.ok(commentService.findAll());
    }

    @GetMapping( path = "/{id}", produces = "application/json" )
    @ApiOperation(value = "Get a comment from the repository", response = Comment.class)
    public ResponseEntity<Comment> findById(@PathVariable Long id) {
        Comment comment = commentService.findById(id);

        return ResponseEntity.ok(comment);
    }

    @GetMapping( path = "/book/{bookId}", produces = "application/json" )
    @ApiOperation(value = "Get all comments on the book from the repository", response = List.class)
    public ResponseEntity<List<Comment>> findByBookId(@PathVariable Long bookId) {
        List<Comment> comments = commentService.findByBookId(bookId, Optional.empty(), Optional.empty());

        return ResponseEntity.ok(comments);
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    @ApiOperation(value = "Add a comment to the repository", response = Comment.class)
    public ResponseEntity<Comment> create(@RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.save(comment));
    }

    @PutMapping(path = "/{id}", consumes = "application/json", produces = "application/json" )
    @ApiOperation(value = "Change a comment in the repository", response = Book.class)
    public ResponseEntity<Comment> update(@PathVariable Long id, @Valid @RequestBody Comment comment) {
        // to evoke Exception if comment not exists
        Comment comment1 = commentService.findById(id);

        comment.setId(id);
        return ResponseEntity.ok(commentService.save(comment));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete a comment from the repository")
    public ResponseEntity delete(@PathVariable Long id) {
        // to evoke Exception if comment not exists
        Comment comment = commentService.findById(id);

        commentService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
