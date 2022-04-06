/* Testing setup_db.sql */

-- Testing carpools
INSERT INTO carpools (student_list, departure, destination, date_time)  
VALUES (
    "Student 1, Student 2",
    "Hank Circle",
    "Chik-fil-a",
    STR_TO_DATE("2022-3-21 4:00", '%Y-%m-%d %h:%i')
);

INSERT INTO carpools (student_list, departure, destination, date_time)  
VALUES (
    "Student 3, Student 4",
    "Morgan Circle",
    "Broadway",
    STR_TO_DATE("2022-3-21 6:00", '%Y-%m-%d %h:%i')
);

INSERT INTO carpools (student_list, departure, destination, date_time)  
VALUES (
    "Student 5",
    "EBI Circle",
    "BNA Airport",
    STR_TO_DATE("2022-3-22 18:00", '%Y-%m-%d %H:%i')
);

SELECT * FROM carpools;


-- Testing passengers
INSERT INTO passengers (carpool_id, email, code, created_at)
VALUES (
    1,
    "example@vanderbilt.edu",
    "000000",
    NOW()
);