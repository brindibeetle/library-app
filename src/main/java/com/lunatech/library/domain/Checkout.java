package com.lunatech.library.domain;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.PastOrPresent;
import java.sql.Date;
import java.util.Optional;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Checkout {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "Checkout : BookId needs a value")
    private Long bookId;

    @NotNull(message = "Checkout : fromDate needs a value")
    private Date fromDate;

    private Date toDate;

    @NotBlank(message = "Checkout : who needs a value")
    private String who;

}
