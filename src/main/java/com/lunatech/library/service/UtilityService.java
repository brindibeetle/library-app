package com.lunatech.library.service;

import com.lunatech.library.dto.UserDTO;
import com.lunatech.library.exception.APIException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
public class UtilityService {

    private UtilityService() {
    }

    public UserDTO userDTO() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new APIException(HttpStatus.UNAUTHORIZED, "Anonymous user not allowed");
        }
        UserDTO userDTO = (UserDTO) authentication.getPrincipal();
        return userDTO;
    }

    public String userEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new APIException(HttpStatus.UNAUTHORIZED, "Anonymous user not allowed");
        }

        UserDTO userDTO = (UserDTO) authentication.getPrincipal();
//        String currentUserEmail = authentication.getName();
        return userDTO.getEmail();
    }

    private String timeZoneId;

    @Value("${time.zone.id}")
    private void setTIMEZONEID(String timeZoneId) {
        this.timeZoneId = timeZoneId;
    }

    public String timeZoneId() {
        return timeZoneId;
    }

    public ZonedDateTime infiniteDateTime() {
        return ZonedDateTime.of(2200, 1, 1, 0, 0, 0, 0, ZoneId.of(timeZoneId));
    }

    public ZonedDateTime zeroDateTime() {
        return ZonedDateTime.of(1970, 1, 1, 0, 0, 0, 0, ZoneId.of(timeZoneId));
    }

    public ZonedDateTime currentDateTime() {
        return ZonedDateTime.now(ZoneId.of(timeZoneId));
    }

}
