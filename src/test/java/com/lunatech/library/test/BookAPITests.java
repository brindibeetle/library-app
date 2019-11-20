package com.lunatech.library.test;

import com.lunatech.library.LibraryApplication;
import com.lunatech.library.api.BookAPI;
import com.lunatech.library.domain.Book;
import com.lunatech.library.service.BookService;
import com.lunatech.library.service.CheckoutService;
import com.lunatech.library.test.AbstractTest;
import org.hamcrest.core.Is;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static junit.framework.TestCase.assertTrue;
import static junit.framework.TestCase.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
        Book[] books = super.mapFromJson(content, Book[].class);
        assertTrue(books.length > 0);
    }

    @Test
    public void getABook() throws Exception {
        String uri = "/api/v1/books/1";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        Book book = super.mapFromJson(content, Book.class);
        assertEquals("Book1", book.getTitle());
    }

    @Test
    public void putABook() throws Exception {
        String uri = "/api/v1/books/2";
        Book book = new Book(null, "Boek", "Auteur", "1920", "", "", "");
        String inputJson = super.mapToJson(book);
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);

        uri = "/api/v1/books/2";
        mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        String content = mvcResult.getResponse().getContentAsString();
        Book book2 = super.mapFromJson(content, Book.class);
        assertEquals(book.getTitle(), book2.getTitle());
    }

    @Test
    public void postBook() throws Exception {
        String uri = "/api/v1/books";
        Book book = new Book(0L, "Boek", "Auteur", "1920", "", "", "");

        String inputJson = super.mapToJson(book);
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
    }

}
