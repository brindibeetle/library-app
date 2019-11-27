package com.lunatech.library.test;

import com.lunatech.library.LibraryApplication;
import com.lunatech.library.dto.CheckoutDTO;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootApplication
@SpringBootTest(classes = LibraryApplication.class)
public class CheckoutAPITests extends AbstractTest {

    @Before
    public void doBefore() {
        super.setUp();
    }

    @Test
    public void getCheckouts() throws Exception {
        String uri = "/api/v1/checkouts";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        CheckoutDTO[] checkoutDTOs = super.mapFromJson(content, CheckoutDTO[].class);
        assertTrue(checkoutDTOs.length > 0);
    }

    @Test
    public void getACheckout() throws Exception {
        String uri = "/api/v1/checkouts/1";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        CheckoutDTO checkoutDTO = super.mapFromJson(content, CheckoutDTO.class);
        assertEquals("emile@ei.nl", checkoutDTO.getUserEmail());
    }
}
