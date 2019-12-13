package com.lunatech.library.service;

import com.lunatech.library.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final UtilityService utilityService;

    public UserDTO getUser() {
        UserDTO userDTO = utilityService.userDTO();
        return userDTO;
    }

}
