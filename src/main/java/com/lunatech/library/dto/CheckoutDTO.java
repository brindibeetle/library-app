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

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CheckoutDTO {

    @ApiModelProperty(hidden = true)
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

    @Email(message = "An appropriate email address is required")
    @NotBlank(message = "Checkout : who needs a value")
    @ApiModelProperty(notes = "An email identifying the person who has checked out.", example = "luna.talbech@lunatech.com", required = false, position = 5)
    private String userEmail;

}
