package com.lunatech.library.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.*;
import java.time.ZonedDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @ApiModelProperty(notes = "Unique identifier of the comment.", example = "1", required = true, position = 1)
    private Long id;

    @NotNull(message = "Comment : BookId needs a value")
    @ApiModelProperty(notes = "Identifier of the book.", example = "1", required = true, position = 2)
    private Long bookId;

    @NotNull(message = "Comment : dateTime needs a value")
    @JsonDeserialize(using = ZonedDateDeserializer.class)
//    @JsonSerialize(using = ZonedDateSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
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
