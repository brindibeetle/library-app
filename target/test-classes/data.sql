insert into book (id, title, authors, published_Date)
 values
 (1, 'Book1', 'Author1', '0001')
 , (2, 'Book2', 'Author2', '0002')
 , (3, 'Book3', 'Author3', '0003')
 , (4, 'Book4', 'Author4', '0004')
 , (5, 'Book5', 'Author5', '0005')
 ;

insert into checkout (id, book_id, date_time_from, date_time_to, user_email)
 values
 (1, 1, to_date('1980-05-11', 'YYYY-MM-DD'), to_date('1981-08-31', 'YYYY-MM-DD'), 'emile@ei.nl')
 , (2, 1, TO_DATE('1990-12-06', 'YYYY-MM-DD'), null, 'emile@ei.nl')
 , (3, 2, TO_DATE('2019-02-06', 'YYYY-MM-DD'), null, 'emile@ei.nl')
 ;

insert into comment (id, book_id, date_time, user_email, rating, remarks)
 VALUES
 (1, 1, TO_DATE('1980-05-11', 'YYYY-MM-DD'), 'emile@ei.nl', 1, 'Not good')
 , (2, 1, TO_DATE('1980-06-11', 'YYYY-MM-DD'), 'emile@ui.nl', 3, 'Pretty good')
 , (3, 1, TO_DATE('1980-07-11', 'YYYY-MM-DD'), 'emile@oei.nl', 5, 'Very good')
 ;
