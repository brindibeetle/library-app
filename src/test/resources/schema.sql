create table book (id INTEGER PRIMARY KEY auto_increment, title VARCHAR(31), authors VARCHAR(31), published_Date VARCHAR(31), description VARCHAR(400), owner VARCHAR(31), location VARCHAR(31));

create table checkout (id INTEGER PRIMARY KEY auto_increment, book_id INTEGER , date_from DATE, date_to DATE, user_email VARCHAR(31));
