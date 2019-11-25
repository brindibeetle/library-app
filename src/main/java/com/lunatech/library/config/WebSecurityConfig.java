package com.lunatech.library.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.AuthoritiesExtractor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    public void configure(WebSecurity web) throws Exception {

        web.ignoring().antMatchers("/v2/api-docs", "/configuration/ui", "/swagger-resources/**", "/configuration/**", "/swagger-ui.html", "/webjars/**");

    }

    @Bean
    public AuthoritiesExtractor authoritiesExtractor(
            @Value("#{'${security.allowed.domains}'.split(',')}") final List<String> allowedDomains) {

         return new AuthoritiesExtractor() {
            @Override
            public List<GrantedAuthority> extractAuthorities(final Map<String, Object> map) {
                String email = (String)map.get("email");
                String[] emailparts = email.split("@");
                String emaildomain = emailparts[emailparts.length -1];
                if (!allowedDomains.contains(emaildomain)) {
                    throw new BadCredentialsException("Not an allowed domain");
                }
                return AuthorityUtils.commaSeparatedStringToAuthorityList("ROLE_USER");
            }
        };
    }
}