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
public class UserDTO {

    @ApiModelProperty(notes = "The name of the user.", example = "Donald Duck", position = 1)
    private String name;

    @ApiModelProperty(notes = "The email of the user.", example = "donald.duck@lunatech.ds", position = 2)
    private String email;

    @ApiModelProperty(notes = "The url to a picture of the user.", example = "https://lh6.googleusercontent.com/etc__etc", position = 3)
    private String picture;

}
