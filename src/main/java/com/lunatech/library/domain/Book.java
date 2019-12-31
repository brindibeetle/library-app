package com.lunatech.library.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    private String authors;

    private String publishedDate;

    @Column(length = 4000)
    private String description;

    private String language;

    private String owner;

    private String location;

    private String thumbnail;

    private String smallThumbnail;
}
