package com.lunatech.library.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BookDTO {

    @ApiModelProperty(hidden = true)
    private Long id;

    @NotBlank(message = "Book : title needs a value")
    @ApiModelProperty(notes = "The title.", example = "Lambda Calculus with Types", required = true, position = 2)
    private String title;

    @NotBlank(message = "Book : authors needs a value")
    @ApiModelProperty(notes = "The author(s).", example = "Henk Barendregt, Wil Dekkers", required = true, position = 3)
    private String authors;

    @ApiModelProperty(notes = "The date of publication.", example = "june 2013", position = 4)
    private String publishedDate;

    @ApiModelProperty(notes = "Some details or abstract."
            , example = "The lambda calculus forms a prototype universal programming language" +
            ", which in its untyped version is related to Lisp, and was treated in the first author's classic The Lambda Calculus (1984)."
            , position = 5)
    private String description;

    @ApiModelProperty(notes = "The language.", example = "en", position = 6)
    private String language;

    @ApiModelProperty(notes = "The proprietor.", example = "Femke Halsema", position = 7)
    private String owner;

    @ApiModelProperty(notes = "The place where you can find the book.", example = "Usually one of the offices of Lunatech. Amsterdam, Rotterdam, Chessy.", position = 8)
    private String location;

    @ApiModelProperty(notes = "A url to the thumbnail of the book.", example = "http://books.google.com/books/content?id=6Lb3CQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api", position = 9)
    private String thumbnail;

    @ApiModelProperty(notes = "A url to a small thumbnail of the book.", example = "http://books.google.com/books/content?id=6Lb3CQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api", position = 9)
    private String smallThumbnail;
}
