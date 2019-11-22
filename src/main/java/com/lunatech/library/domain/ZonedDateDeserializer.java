package com.lunatech.library.domain;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.time.ZonedDateTime;

public class ZonedDateDeserializer extends StdDeserializer<ZonedDateTime> {

    private static final long serialVersionUID = 1L;

    protected ZonedDateDeserializer() {
        super(ZonedDateTime.class);
    }

    @Override
    public ZonedDateTime deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {
        return ZonedDateTime.parse(jp.readValueAs(String.class));
    }
}