/* Testing setup_db.sql */

-- Testing carpools
INSERT INTO carpools (departure, destination, date_time)  
VALUES (
    "Hank Circle",
    "Chik-fil-a",
    STR_TO_DATE("2022-3-21 4:00", '%Y-%m-%d %h:%i')
);

INSERT INTO carpools (departure, destination, date_time)  
VALUES (
    "Morgan Circle",
    "Broadway",
    STR_TO_DATE("2022-3-21 6:00", '%Y-%m-%d %h:%i')
);

INSERT INTO carpools (departure, destination, date_time)  
VALUES (
    "EBI Circle",
    "BNA Airport",
    STR_TO_DATE("2022-3-22 18:00", '%Y-%m-%d %H:%i')
);


-- Testing passengers
INSERT INTO passengers (carpool_id, email, code, created_at)
VALUES (
    1,
    "example@vanderbilt.edu",
    "000000",
    NOW()
);