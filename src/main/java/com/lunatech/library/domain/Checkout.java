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
    /*  see comment in Book.java
    @GeneratedValue(strategy = GenerationType.IDENTITY) */
    private Long id;

    @NotNull(message = "Checkout : BookId needs a value")
    private Long bookId;

    @NotNull(message = "Checkout : dateFrom needs a value")
    private Date dateFrom;

    private Date dateTo;

    @NotBlank(message = "Checkout : who needs a value")
    private String who;

}
