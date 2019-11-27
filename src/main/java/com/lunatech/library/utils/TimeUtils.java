package com.lunatech.library.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Component
public class TimeUtils {

    private static String timeZoneId;

    @Value("${time.zone.id}")
    private void setTIMEZONEID(String timeZoneId) {

        this.timeZoneId = timeZoneId;

    }

    public static String timeZoneId() {
        return timeZoneId;
    }

    public static ZonedDateTime infiniteDateTime() {
        return ZonedDateTime.of(2200, 1, 1, 0, 0, 0, 0, ZoneId.of(timeZoneId));
    }

    public static ZonedDateTime zeroDateTime() {
        return ZonedDateTime.of(1970, 1, 1, 0, 0, 0, 0, ZoneId.of(timeZoneId));
    }

    public static ZonedDateTime currentDateTime() {
        return ZonedDateTime.now(ZoneId.of(timeZoneId));
    }

}
