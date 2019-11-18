package com.lunatech.library.test;

import com.lunatech.library.LibraryApplication;
import com.lunatech.library.domain.Checkout;
import com.lunatech.library.test.AbstractTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Collection;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootApplication
@SpringBootTest(classes = LibraryApplication.class)
public class LibraryAPITests extends AbstractTest {

    @Before
    public void doBefore() {
        super.setUp();
    }

    @Test
    @WithMockUser(username="spring")
    public void doCheckout() throws Exception {
        String uri = "/api/v1/checkout/3";

        String inputJson = "{\n" +
                "\t\"username\": \"emile\"\n" +
                "}";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
    }

    @Test
    public void doCheckoutWithOpt() throws Exception {
        String uri = "/api/v1/checkoutopt/5";

        String inputJson = "{\n" +
                "\t\"username\": \"emile\"\n" +
                "}";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
    }

    @Test
    @WithMockUser(username="spring")
    // Book 2 has already been checked out: second checkout not allowed
    public void doCheckoutOfCheckedOutBookNotAllowed() throws Exception {
        String uri = "/api/v1/checkout/2";

        String inputJson = "{\n" +
                "\t\"username\": \"emile\"\n" +
                "}";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(409, status); // conflict
    }

    @Test
    // Book 1 has been checked out
    public void doCheckin() throws Exception {
        String uri = "/api/v1/checkin/1";

        String inputJson = "{\n" +
                "\t\"username\": \"emile\"\n" +
                "}";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
    }

    @Test
    // Book 4 has not been checked out
    public void doCheckinNotAllowed() throws Exception {
        String uri = "/api/v1/checkin/4";

        String inputJson = "{\n" +
                "\t\"username\": \"emile\"\n" +
                "}";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(409, status); // conflict
    }
}
