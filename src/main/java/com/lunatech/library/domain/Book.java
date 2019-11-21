package com.lunatech.library.domain;

import io.swagger.annotations.ApiModelProperty;
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
    @ApiModelProperty(notes = "Unique identifier of the book.", example = "1", required = true, position = 1)
    private Long id;

    @NotBlank( message = "Book : title needs a value")
    @ApiModelProperty(notes = "The title.", example = "The alienist", required = true, position = 2)
    private String title;

    @NotBlank( message = "Book : authors needs a value")
    @ApiModelProperty(notes = "The author(s).", example = "Caleb Carr", required = true, position = 3)
    private String authors;

    @ApiModelProperty(notes = "The date of publication.", example = "september 2011", position = 4)
    private String publishedDate;

    @Column(length=400)
    @ApiModelProperty(notes = "Some details or abstract.", example = "New York City, 1896. " +
            "Hypocrisy in high places is rife, police corruption commonplace, and a brutal killer is terrorising young male prostitutes."
        , position = 5)
    private String description;

    @ApiModelProperty(notes = "The proprietor.", example = "Femke Halsema", position = 6 )
    private String owner;

    @ApiModelProperty(notes = "The place where you can find the book.", example = "Usually Amsterdam or Rotterdam", position = 7 )
    private String location;

}
