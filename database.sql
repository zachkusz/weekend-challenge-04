--created new database "to-do-list"
-- CREATE OWNERS TABLE --
CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	description varchar(255),
	complete boolean
);
