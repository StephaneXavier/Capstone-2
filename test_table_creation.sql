\c gotta_go_test

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