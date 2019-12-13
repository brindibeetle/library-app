package com.lunatech.library.api;

import com.lunatech.library.dto.UserDTO;
import com.lunatech.library.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@Slf4j
@RequiredArgsConstructor
@Api("The authenticated user")
public class UserAPI {

    final UserService userService;

    @GetMapping(produces = "application/json")
    @ApiOperation(value = "Get the authenticated user", response = UserDTO.class)
    @ResponseBody
    public UserDTO getUser() {
        return userService.getUser();
    }

}
