package com.lunatech.library;

import com.lunatech.library.api.BookAPI;
import com.lunatech.library.domain.Book;
import com.lunatech.library.service.BookService;
import com.lunatech.library.service.CheckoutService;
import org.hamcrest.core.Is;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(BookAPI.class)
public class BookAPITests {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CheckoutService checkoutService;
    @MockBean
    private BookService bookService;

    private Book book1 = new Book(0L, "Test1", "Authors1", null);
    private Book book2 = new Book(0L, "Test2", "Authors2", null);

    @Before
    public void addSomeBooks() {
        bookService.save(book1);
    }

    @Test
    public void testGet() throws Exception {
        mvc.perform(get("/api/v1/books")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", Is.is(book1.getTitle())));
    }

}
