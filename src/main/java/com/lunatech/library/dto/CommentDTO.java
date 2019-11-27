package com.lunatech.library.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.lunatech.library.domain.ZonedDateDeserializer;
import com.lunatech.library.domain.ZonedDateSerializer;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.*;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CommentDTO {

    @NotNull(message = "Comment : BookId needs a value")
    @ApiModelProperty(notes = "Identifier of the book.", example = "1", required = true, position = 2)
    private Long bookId;

    @NotNull(message = "Comment : dateTime needs a value")
    @JsonDeserialize(using = ZonedDateDeserializer.class)
    @JsonSerialize(using = ZonedDateSerializer.class)
    @ApiModelProperty(notes = "The date/time that the books has been checked out.", example = "12-12-2019T12:30:00Z", required = true, position = 3)
    private ZonedDateTime dateTime;

    @Email(message = "An appropriate email address is required")
    @NotBlank(message = "Comment : who gives a comment")
    @ApiModelProperty(notes = "An email identifying the person who has commented.", example = "luna.tlabech@lunatech.com", required = false, position = 4)
    private String userEmail;

    @Min(1)
    @Max(5)
    @ApiModelProperty(notes = "The rating for the book.", example = "12-12-2019T12:30:00Z", required = true, position = 5)
    private int rating;

    @NotBlank(message = "Comment : give a remarks")
    @ApiModelProperty(notes = "The rating for the books.", example = "I am happy with this book", required = true, position = 6)
    private String remarks;

}
