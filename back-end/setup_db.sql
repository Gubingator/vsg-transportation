/* Create the tables in the database */

DROP TABLE IF EXISTS groupme_info;
DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS carpools;

-- Create carpools table
CREATE TABLE carpools (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    departure VARCHAR(255),
    destination VARCHAR(255),
    date_time DATETIME,
    filled_seats INTEGER DEFAULT 0
);

-- Create passengers table
CREATE TABLE passengers (
    passenger_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    carpool_id INTEGER, 
    name VARCHAR(255),
    email VARCHAR(255), 
    code VARCHAR(255), 
    created_at DATETIME DEFAULT NOW(), 
    verified INTEGER DEFAULT FALSE,
    CONSTRAINT carpool_fk 
        FOREIGN KEY (carpool_id) 
        REFERENCES carpools (id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
);

-- Create GroupMe info table
CREATE TABLE groupme_info (
    group_id INTEGER PRIMARY KEY,
    carpool_id INTEGER,
    bot_id INTEGER DEFAULT NULL,
    groupme_link VARCHAR(255) DEFAULT NULL,
    CONSTRAINT gm_fk
        FOREIGN KEY (carpool_id)
        REFERENCES carpools (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);