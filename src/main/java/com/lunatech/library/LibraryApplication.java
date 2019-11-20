package com.lunatech.library;

import com.lunatech.library.config.CustumPrincipalExtractor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@SpringBootApplication
@EnableResourceServer
public class LibraryApplication {

	@Bean
	public PrincipalExtractor principalExtractor() {
		return new CustumPrincipalExtractor();
	}

	public static void main(String[] args) {
		SpringApplication.run(LibraryApplication.class, args);
	}

}
