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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @NotBlank( message = "Book : title needs a value")
    private String title;

    @NotBlank( message = "Book : authors needs a value")
    private String authors;

//    @NotBlank( message = "Book : authors needs a value")
    private String publishedDate;

//    @OneToMany(
//        cascade = CascadeType.ALL,
//        orphanRemoval = true
//    )
//    private List<Checkout> checkouts;

//    private String thumbnailLink;
}
