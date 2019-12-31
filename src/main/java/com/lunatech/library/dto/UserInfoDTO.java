package com.lunatech.library.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserInfoDTO {

    @ApiModelProperty(notes = "The name of the user.", example = "Donald Duck", position = 1)
    private String name;

    @ApiModelProperty(notes = "The number of books that the user holds in the library.", example = "12", position = 2)
    private Long numberBooks;

    @ApiModelProperty(notes = "The number of current checkouts of the user.", example = "10", position = 3)
    private Long numberCheckouts;

}
