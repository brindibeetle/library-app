package com.lunatech.library.test;

import com.lunatech.library.LibraryApplication;
import com.lunatech.library.domain.Checkout;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static junit.framework.TestCase.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootApplication
@SpringBootTest(classes = LibraryApplication.class)
public class LibraryAPITests extends AbstractTest {

    @Before
    public void doBefore() {
        super.setUp();
    }

    @Test
    @WithMockUser(username="emile@pipo.nl")
    public void doCheckout() throws Exception {
        String uri = "/api/v1/checkout/3";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);

        String content = mvcResult.getResponse().getContentAsString();
        Checkout checkout = super.mapFromJson(content, Checkout.class);
        assertEquals("emile@pipo.nl", checkout.getUserEmail());
    }

    @Test
    public void doCheckoutWithOpt() throws Exception {
        String uri = "/api/v1/checkout/5?email=emile1@pipo.nl";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);

        String content = mvcResult.getResponse().getContentAsString();
        Checkout checkout = super.mapFromJson(content, Checkout.class);
        assertEquals("emile1@pipo.nl", checkout.getUserEmail());
    }

    @Test
    @WithMockUser(username="emile@ei.nl")
    // Book 2 has already been checked out: second checkout not allowed
    public void doCheckoutOfCheckedOutBookNotAllowed() throws Exception {
        String uri = "/api/v1/checkout/2";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(409, status); // conflict
    }

    @Test
    // Book 1 has been checked out
    public void doCheckin() throws Exception {
        String uri = "/api/v1/checkin/1";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
    }

    @Test
    // Book 4 has not been checked out
    public void doCheckinNotAllowed() throws Exception {
        String uri = "/api/v1/checkin/4";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(409, status); // conflict
    }
}
