package com.lunatech.library.service;

import com.lunatech.library.dto.UserDTO;
import com.lunatech.library.dto.UserInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final UtilityService utilityService;
    private final BookService bookService;
    private final CheckoutService checkoutService;

    public UserDTO getUser() {
        UserDTO userDTO = utilityService.userDTO();
        return userDTO;
    }

    public UserInfoDTO getUserInfo() {
        UserDTO userDTO = utilityService.userDTO();
        Long myBooks = bookService.countByOwner(userDTO.getEmail());
        Long myCheckouts = checkoutService.countByUser(userDTO.getEmail());

        return new UserInfoDTO(userDTO.getName(), myBooks, myCheckouts);
    }
}
