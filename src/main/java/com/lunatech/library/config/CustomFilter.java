package com.lunatech.library.config;

import com.lunatech.library.exception.APIAuthorizationException;
import com.lunatech.library.exception.APIException;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(2)
public class CustomFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String XForwardedProto = req.getHeader("X-Forwarded-Proto");
        if (XForwardedProto != null  && ! XForwardedProto.equals("https")) {
            throw new APIAuthorizationException(HttpStatus.HTTP_VERSION_NOT_SUPPORTED, "Only secured https requests are allowed");
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}

