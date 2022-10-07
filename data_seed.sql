\c gotta_go_test

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS submitted_washrooms CASCADE;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS cleanliness;



CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE submitted_washrooms (
    id SERIAL PRIMARY KEY,
    washroom_type text NOT NULL,
    user_id text NOT NULL REFERENCES users,
    x_y_coordinates text NOT NULL,
    opens_at text,
    closes_at text
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL REFERENCES users,
    post_id integer NOT NULL REFERENCES submitted_washrooms,
    upvote integer NOT NULL    
);

CREATE TABLE cleanliness (
user_id text NOT NULL REFERENCES users,
post_id integer NOT NULL REFERENCES submitted_washrooms,
rating integer NOT NULL
);


INSERT INTO users (username, password, join_at)
VALUES ('kanzo', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', '2011-01-01'),
        ('steph', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', '2011-02-02'),
        ('tezy', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', '2011-03-03');

INSERT INTO submitted_washrooms (washroom_type, user_id, x_y_coordinates, opens_at, closes_at)
VALUES ('porta-potty', 'kanzo','45,000-55,12', '1200','1500'),
        ('gas-station', 'tezy','46,000-54,12', '0600','2100'),
        ('porta-potty', 'steph','45,000-55,12', '','');

INSERT INTO votes (user_id,post_id,upvote)
VALUES ('kanzo',1,1),
        ('kanzo',2,0),
        ('steph',3,1);

INSERT INTO cleanliness (user_id,post_id,rating)
VALUES ('tezy', 1,5),
        ('tezy',2,3),
        ('steph',3,1);