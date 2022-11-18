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
    longitude decimal NOT NULL,
    latitude decimal NOT NULL,
    opens_at text,
    closes_at text
);