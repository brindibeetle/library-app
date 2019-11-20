package com.lunatech.library.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank( message = "Book : title needs a value")
    private String title;

    @NotBlank( message = "Book : authors needs a value")
    private String authors;

    private String publishedDate;

    @Column(length=400)
    private String description;

    private String owner;

    private String location;

}
