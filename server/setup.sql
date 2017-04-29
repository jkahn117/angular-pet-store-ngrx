SET AUTOCOMMIT=ON;
DROP DATABASE IF EXISTS dev;
CREATE DATABASE dev;

CREATE TABLE pets (
  ID       SERIAL PRIMARY_KEY,
  name     VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  age      VARCHAR DEFAULT 0,
  status   VARCHAR DEFAULT 'available',
  thumbUrl VARCHAR,
  photoUrl VARCHAR
);

INSERT INTO pets (name, category, age, status)
  VALUES ('Gronk', 'Dog', '1 year', 'sold');

INSERT INTO pets (name, category, age, status)
  VALUES ('Zoey', 'Dog', '2 years', 'sold');

INSERT INTO pets (name, category, age, status)
  VALUES ('Mr Whiskers', 'Cat', '10 years', 'available');

INSERT INTO pets (name, category, age, status)
  VALUES ('Goldie', 'Fish', '1 month', 'available');

INSERT INTO pets (name, category, age, status)
  VALUES ('Max', 'Dog', '5 months', 'available');
