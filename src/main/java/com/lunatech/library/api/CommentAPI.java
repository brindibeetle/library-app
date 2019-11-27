package com.lunatech.library.api;

import com.lunatech.library.domain.Book;
import com.lunatech.library.domain.Comment;
import com.lunatech.library.dto.CommentDTO;
import com.lunatech.library.service.CommentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/comments")
@Slf4j
@RequiredArgsConstructor
@Api(value = "Commenting books")
public class CommentAPI {

    private final CommentService commentService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping(produces = "application/json")
    @ApiOperation(value = "Get all comments from the repository", response = List.class)
    @ResponseBody
    public List<CommentDTO> findAll() {
        List<Comment> comments = commentService.findAll();
        return comments.stream()
                .map(comment -> convertToDTO(comment))
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/{id}", produces = "application/json")
    @ApiOperation(value = "Get a comment from the repository", response = Comment.class)
    @ResponseBody
    public CommentDTO findById(@PathVariable Long id) {
        return convertToDTO(commentService.findById(id));
    }

    @GetMapping(path = "/book/{bookId}", produces = "application/json")
    @ApiOperation(value = "Get all comments on the book from the repository", response = List.class)
    @ResponseBody
    public List<CommentDTO> findByBookId(@PathVariable Long bookId) {
        List<Comment> comments = commentService.findByBookId(bookId, Optional.empty(), Optional.empty());
        return comments.stream()
                .map(comment -> convertToDTO(comment))
                .collect(Collectors.toList());
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    @ApiOperation(value = "Add a comment to the repository", response = Comment.class)
    @ResponseBody
    public CommentDTO create(@RequestBody CommentDTO commentDTO) {
        Comment comment = convertToEntity(-1L, commentDTO);
        Comment commentCreated = commentService.save(comment);

        return convertToDTO(commentCreated);
    }

    @PutMapping(path = "/{id}", consumes = "application/json", produces = "application/json")
    @ApiOperation(value = "Change a comment in the repository", response = Book.class)
    @ResponseStatus(HttpStatus.OK)
    public void update(@PathVariable Long id, @Valid @RequestBody CommentDTO commentDTO) {
        // to evoke Exception if comment not exists
        Long bookId = commentDTO.getBookId();
        commentService.findById(bookId);

        commentService.save(convertToEntity(id, commentDTO));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete a comment from the repository")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Long id) {
        // to evoke Exception if comment not exists
        commentService.findById(id);

        commentService.deleteById(id);
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);
        return commentDTO;
    }

    private Comment convertToEntity(Long id, CommentDTO commentDTO) {
        Comment comment = null;
        if (id == null || id == -1L) {
            comment = new Comment();
        } else {
            comment = commentService.findById(id);
        }
        modelMapper.map(commentDTO, comment);
        return comment;
    }

}
