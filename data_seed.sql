\c gotta_go

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS submitted_washrooms CASCADE;
DROP TABLE IF EXISTS votes;


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
    x_coordinate decimal NOT NULL,
    y_coordinate decimal NOT NULL,
    opens_at text,
    closes_at text
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id text NOT NULL REFERENCES users,
    post_id integer NOT NULL REFERENCES submitted_washrooms ON DELETE CASCADE,
    upvote integer NOT NULL    
);


INSERT INTO users (username, password, join_at)
VALUES ('kanzo', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', '2011-01-01'),
        ('steph', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', '2011-02-02'),
        ('tezy', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', '2011-03-03');

INSERT INTO submitted_washrooms (washroom_type, user_id, x_coordinate,y_coordinate, opens_at, closes_at)
VALUES ('porta-potty', 'kanzo',45.01, 55.12, '1200','1500'),
        ('gas-station', 'tezy',46.03,-54.14, '0600','2100'),
        ('porta-potty', 'steph',45.06, -45.15, '','');

INSERT INTO votes (user_id,post_id,upvote)
VALUES ('kanzo',1,1),
        ('kanzo',2,0),
        ('steph',3,1),
        ('steph',1,1);

