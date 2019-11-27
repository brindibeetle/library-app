package com.lunatech.library.test;

import com.lunatech.library.LibraryApplication;
import com.lunatech.library.dto.BookDTO;
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
public class BookAPITests extends AbstractTest {

    @Before
    public void doBefore() {
        super.setUp();
    }

    @Test
    public void getBooks() throws Exception {
        String uri = "/api/v1/books";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        BookDTO[] bookDTOs = super.mapFromJson(content, BookDTO[].class);
        assertTrue(bookDTOs.length > 0);
    }

    @Test
    public void getABook() throws Exception {
        String uri = "/api/v1/books/1";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        BookDTO bookDTO = super.mapFromJson(content, BookDTO.class);
        assertEquals("Book1", bookDTO.getTitle());
    }

    @Test
    public void putABook() throws Exception {
        String uri = "/api/v1/books/2";
        BookDTO bookDTO = new BookDTO(null, "Boek", "Auteur", "1920", "", "", "");
        String inputJson = super.mapToJson(bookDTO);
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
    }

    @Test
    public void postBook() throws Exception {
        String uri = "/api/v1/books";
        BookDTO bookDTO = new BookDTO(0L, "Boek", "Auteur", "1920", "", "", "");

        String inputJson = super.mapToJson(bookDTO);
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
    }

}
