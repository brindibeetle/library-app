package com.lunatech.library.config;

import com.lunatech.library.dto.UserDTO;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;

import java.util.Map;

public class CustumPrincipalExtractor implements PrincipalExtractor {
    @Override
    public Object extractPrincipal(Map<String, Object> map) {

        // name : Emile Verschuren
        // picture : url
        // email : emile.verschuren@lunatech.nl
        // locale : en
        String name = (String) map.get("name");
        String email = (String) map.get("email");
        String picture = (String) map.get("picture");

        return new UserDTO(name, email, picture);
    }
}
