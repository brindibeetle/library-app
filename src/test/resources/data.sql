insert into book (id, title, authors, published_Date)
 VALUES
 (1, 'Book1', 'Author1', '0001')
 , (2, 'Book2', 'Author2', '0002')
 , (3, 'Book3', 'Author3', '0003')
 , (4, 'Book4', 'Author4', '0004')
 , (5, 'Book5', 'Author5', '0005')
 ;

insert into checkout (id, book_id, date_from, date_to, user_email)
 VALUES
 (1, 1, TO_DATE('1980-05-11', 'YYYY-MM-DD'), TO_DATE('1981-08-31', 'YYYY-MM-DD'), 'emile@ei.nl')
 , (2, 1, TO_DATE('1990-12-06', 'YYYY-MM-DD'), null, 'emile@ei.nl')
 , (3, 2, TO_DATE('2019-10-06', 'YYYY-MM-DD'), null, 'emile@ei.nl')
 ;

