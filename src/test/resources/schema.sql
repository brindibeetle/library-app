create table book (id INTEGER PRIMARY KEY, title VARCHAR(31), authors VARCHAR(31), published_Date VARCHAR(31));

create table checkout (id INTEGER PRIMARY KEY, book_id INTEGER , date_from DATE, date_to DATE, who VARCHAR(31));
