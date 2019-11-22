package com.lunatech.library.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
class LibraryAPIBodyParams {

    private String email;

    private ZonedDateTime dateTime;

}
