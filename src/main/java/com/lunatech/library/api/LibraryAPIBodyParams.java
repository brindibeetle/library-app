package com.lunatech.library.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
class LibraryAPIBodyParams {

    private String username;

    private Date date;

}
