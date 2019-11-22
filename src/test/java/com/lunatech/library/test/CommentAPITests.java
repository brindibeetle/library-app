package com.lunatech.library.test;

import com.lunatech.library.LibraryApplication;
import com.lunatech.library.domain.Comment;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootApplication
@SpringBootTest(classes = LibraryApplication.class)
public class CommentAPITests extends AbstractTest {

    @Before
    public void doBefore() {
        super.setUp();
    }

    @Test
    public void getComments() throws Exception {
        String uri = "/api/v1/comments";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        Comment[] comments = super.mapFromJson(content, Comment[].class);
        assertTrue(comments.length > 0);
    }

    @Test
    public void getAComment() throws Exception {
        String uri = "/api/v1/comments/1";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        Comment comment = super.mapFromJson(content, Comment.class);
        assertEquals("emile@ei.nl", comment.getUserEmail());
    }

    @Test
    public void getCommentsOnABook() throws Exception {
        String uri = "/api/v1/comments/book/1";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        Comment[] comments = super.mapFromJson(content, Comment[].class);
        assertTrue(comments.length > 0);
    }

    @Test
    public void getNoCommentsOnABook() throws Exception {
        String uri = "/api/v1/comments/book/5";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        Comment[] comments = super.mapFromJson(content, Comment[].class);
        assertTrue(comments.length == 0);
    }

    @Test
    @WithMockUser(username="emile@pipo.nl")
    public void postAComment() throws Exception {
        String uri = "/api/v1/comments/";
        Comment comment = new Comment(0L, 1L, null, null, 1, "Commentaar");

        String inputJson = super.mapToJson(comment);
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        Comment comment1 = super.mapFromJson(content, Comment.class);
        assertEquals("emile@pipo.nl", comment1.getUserEmail());
    }
}
