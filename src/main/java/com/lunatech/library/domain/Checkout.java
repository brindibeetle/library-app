package com.lunatech.library.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Checkout {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @ApiModelProperty(notes = "Unique identifier of the checkout.", example = "1", required = true, position = 1)
    private Long id;

    @NotNull(message = "Checkout : BookId needs a value")
    @ApiModelProperty(notes = "Identifier of the book.", example = "1", required = true, position = 2)
    private Long bookId;

    @NotNull(message = "Checkout : dateFrom needs a value")
    @JsonDeserialize(using = ZonedDateDeserializer.class)
    @JsonSerialize(using = ZonedDateSerializer.class)
    @ApiModelProperty(notes = "The date/time that the books has been checked out.", example = "12-12-2019T12:30:00Z", required = true, position = 3)
    private ZonedDateTime dateTimeFrom;

    @JsonDeserialize(using = ZonedDateDeserializer.class)
    @JsonSerialize(using = ZonedDateSerializer.class)
    @ApiModelProperty(notes = "The date/time that the books has been checked in.", example = "12-12-2019T12:30:00Z", required = false, position = 4)
    private ZonedDateTime dateTimeTo;

    @Email(message= "An appropriate email address is required")
    @NotBlank(message = "Checkout : who needs a value")
    @ApiModelProperty(notes = "An email identifying the person who has checked out.", example = "luna.tlabech@lunatech.com", required = false, position = 5)
    private String userEmail;

}
