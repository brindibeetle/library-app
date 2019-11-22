package com.lunatech.library.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @ApiModelProperty(notes = "Unique identifier of the book.", example = "1", required = true, position = 1)
    private Long id;

    @NotBlank( message = "Book : title needs a value")
    @ApiModelProperty(notes = "The title.", example = "Lambda Calculus with Types", required = true, position = 2)
    private String title;

    @NotBlank( message = "Book : authors needs a value")
    @ApiModelProperty(notes = "The author(s).", example = "Henk Barendregt, Wil Dekkers", required = true, position = 3)
    private String authors;

    @ApiModelProperty(notes = "The date of publication.", example = "june 2013", position = 4)
    private String publishedDate;

    @Column(length=400)
    @ApiModelProperty(notes = "Some details or abstract."
            , example = "The lambda calculus forms a prototype universal programming language" +
            ", which in its untyped version is related to Lisp, and was treated in the first author's classic The Lambda Calculus (1984)."
        , position = 5)
    private String description;

    @ApiModelProperty(notes = "The proprietor.", example = "Femke Halsema", position = 6 )
    private String owner;

    @ApiModelProperty(notes = "The place where you can find the book.", example = "Usually on of the offices of Lunatech. Amsterdam, Rotterdam, Chessy.", position = 7 )
    private String location;

}
