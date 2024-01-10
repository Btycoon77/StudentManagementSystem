--  create extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  

--  when you are making the foreign key from the same table;
-- at that time , you need to make references parent_table(primary_key);

alter table chapter add constraint chapter_parent_id_fkey
foreign key(parent_id) references chapter(chapter_id);


--  create table students
CREATE  TABLE students(
student_id  SERIAL  NOT NULL PRIMARY KEY,
guid uuid DEFAULT uuid_generate_v4(), 
student_name varchar(200) NOT NULL ,
age int NOT NULL,
datecreated DATE,
datedeleted DATE
);

-- creating table subjects
CREATE TABLE Subjects(
subject_id SERIAL  NOT NULL PRIMARY KEY,
guid uuid DEFAULT uuid_generate_v4(),
subject_name varchar(200) NOT NULL,
datecreated DATE,
datedeleted DATE
)
--  creating studentHistory table

CREATE  TABLE studentHistory(
studentHistory_id  SERIAL  NOT NULL PRIMARY KEY,
guid uuid DEFAULT uuid_generate_v4(), 
student_name varchar(200) NOT NULL ,
age int NOT NULL,
datecreated DATE,
datedeleted DATE,
student_id INT REFERENCES students(student_id)
);

--  creating subjectHistory table

CREATE  TABLE subjectHistory(
subjectHistory_id  SERIAL  NOT NULL PRIMARY KEY,
guid uuid DEFAULT uuid_generate_v4(), 
subject_name varchar(200) NOT NULL ,
datecreated DATE,
datedeleted DATE,
subject_id INT REFERENCES subjects(subject_id)
);



--  creating brigde table

CREATE TABLE studentSubjects (
    studSub  SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) on DELETE CASCADE,
	guid uuid DEFAULT uuid_generate_v4(), 
    subject_id INT REFERENCES subjects(subject_id) on DELETE CASCADE,
    datecreated DATE,
    datedeleted DATE
);

--  adding on cascade delete on studentsubjects table;

ALTER TABLE studentsubjects
DROP CONSTRAINT IF EXISTS studentsubjects_student_id_fkey, -- Drop the existing foreign key constraint if it exists
ADD CONSTRAINT studentsubjects_student_id_fkey
FOREIGN KEY (student_id)
REFERENCES students(student_id)
ON DELETE CASCADE;

-- adding on delete cascade on studentsubjects table;

alter table studentsubjects
drop constraint if exists studentsubjects_subject_id_fkey,
add constraint studentsubjects_subject_id_fkey
foreign key(subject_id)
references subjects(subject_id)
on delete cascade;	
	

-- setting default value null;

ALTER TABLE students
ALTER COLUMN datedeleted SET DEFAULT NULL;

setting DEFAULT value 100;
alter table subjects alter column totalmarks set default 100;



alter table subjects add totalMarks integer;

-- adding constraint SERIAL (auto increment)

ALTER TABLE studentsubjects
ADD CONSTRAINT unique_subject_student_pair UNIQUE (subject_id, student_id);

ALTER TABLE students
ADD CONSTRAINT unique_student_pair UNIQUE (guid, student_name);


ALTER TABLE students
ADD CONSTRAINT unique_student_guid UNIQUE (guid);


alter table subjects add constraint unique_subject_name UNIQUE(subject_name);


ALTER TABLE chapter
ALTER COLUMN chapter_id TYPE SERIAL;

-- dropping constraint 

ALTER TABLE tbl_name
DROP CONSTRAINT constraint_name UNIQUE (col_name);

--  dropping foreign key constraint (this is geneerated by sequelize)

ALTER TABLE subjecthistory
DROP CONSTRAINT subjecthistory_subject_id_fkey;

 create table client
create table client(
id SERIAL PRIMARY KEY,
first_name varchar(200) NOT NULL,
last_name varchar(200) NOT NULL
);

INSERT INTO client(first_name,last_name) values('Mike','Roy'),('Ram','Mahat'),('Amit','Raj');

select * from client;

create table client_Audits(
id serial primary key,
client_id int NOT NULL,
first_name varchar(200),
changed_on TIMESTAMP(5) NOT NULL
);

SELECT * FROM client_Audits;


--  trigger

-- in order to use trigger 
-- 1. creating a new Function
-- 2. creating a new Trigger

-- syntax of creating trigger function

CREATE function trigger_function()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
 -----trigger logic goes here
END;
$$

-- lets create a tirgger
-- For that first you have to create a function;

CREATE function log_First_name_changes()
RETURNS TRIGGER  --Datatype (here it can be of any datatype:string, integer,trigger etc 
LANGUAGE PLPGSQL
AS $$
BEGIN
    if NEW.first_name <> OLD.first_name THEN
    INSERT INTO client_Audits(client_id,first_name,changed_on)
    VALUES(OLD.id,OLD.first_name,now());
    END IF;
RETURNS NEW;
END;
$$

-- second you have to create a trigger;
-- you are using this trigger to automatically update the changed_on to the current timestamp whenever  speicfic row is updated into the client table; 


CREATE TRIGGER First_name_changes
BEFORE UPDATE
ON Client
FOR EACH ROW
EXECUTE PROCEDURE log_First_name_changes();

update client set first_name ='Laxman' where id=2;

select * from client;
select * FROM  client_Audits;


-- to make function in postgres;

CREATE OR REPLACE FUNCTION register_employee(
first_name varchar(200),
last_name varchar(200),
salary numeric

) RETURNS SETOF employees AS $$ -- it indicates that function returns a set of rows with structure of (employees) table_name;

BEGIN
    INSERT INTO employees(first_name,last_name,salary)
    VALUES(first_name,last_name,salary)
    RETURNING * INTO STRICT employee_record;

    RETURN NEXT employee_record;
END;
$$ LANGUAGE plpgsql;


--  JOIN PAGINATION SQL FUNCTION

-- Assuming you have a students table with columns (student_id, student_name, etc.)
-- and a subjects table with columns (subject_id, subject_name, datedeleted, etc.)


CREATE TYPE student_info AS (
    student_id INTEGER,
    student_name CHARACTER VARYING(255),
    -- Add other student columns as needed
    subject_id INTEGER,
    subject_name CHARACTER VARYING(255)
    -- Add other subject columns as needed
);

CREATE OR REPLACE FUNCTION get_pagination_join(
    in_pageSize INT,
    in_page INT,
    in_search VARCHAR(255),
    in_orderBy VARCHAR(255),
    in_orderDir VARCHAR(4)
) RETURNS TABLE (
    pageSize INT,
    page INT,
    totalPages INT,
    student student_info[]
) AS $$
DECLARE
    offset_value INT;
BEGIN
    offset_value := (in_page - 1) * in_pageSize;

    RETURN QUERY
    SELECT
        in_pageSize AS pageSize,
        in_page AS page,
        CEIL(COUNT(*)::NUMERIC / in_pageSize) AS totalPages,
        ARRAY(
            SELECT
                s.student_id,
                s.student_name,
                -- Add other student columns as needed
                sub.subject_id,
                sub.subject_name
                -- Add other subject columns as needed
            FROM
                students s
            LEFT JOIN
                subjects sub ON s.student_id = sub.student_id AND sub.datedeleted IS NULL
            WHERE
                s.student_name ILIKE '%' || in_search || '%'
            ORDER BY
                CASE
                    WHEN in_orderDir = 'ASC' THEN
                        CASE in_orderBy
                            WHEN 'student_id' THEN s.student_id::TEXT
                            WHEN 'student_name' THEN s.student_name
                        END
                    END ASC,
                CASE
                    WHEN in_orderDir = 'DESC' THEN
                        CASE in_orderBy
                            WHEN 'student_id' THEN s.student_id::TEXT
                            WHEN 'student_name' THEN s.student_name
                        END
                    END DESC
            OFFSET
                offset_value
            LIMIT
                in_pageSize
        ) AS student;
END;
$$ LANGUAGE plpgsql;


--  join student and subject sql function

create or replace function get_student_subject_info()
RETURNS TABLE(
	student_id INTEGER,
	student_name character varying(255),
	subject_id INTEGER,
	subject_name character varying(255)
) AS $$

BEGIN
	RETURN QUERY -- it is used to return the result of the select query 
-- 	query that fetches the data from the tables;
	SELECT
		std.student_id,
		std.student_name,
		sub.subject_id,
		sub.subject_name
	from
		students std
	join
	studentsubjects studsub 
	on std.student_id = studsub.student_id
	
	join 
	subjects sub on studsub.subject_id = sub.subject_id;
end;
$$
language plpgsql;


-- pagination join

CREATE OR REPLACE FUNCTION get_pagination_join(
    in_page INT,
    in_pageSize INT,
    in_search_pattern VARCHAR(255),
    in_orderBy_column VARCHAR(255),
    in_order_direction VARCHAR(4)
) RETURNS TABLE (
    student_id INTEGER,
    student_name CHARACTER VARYING(255),
    subject_id INTEGER,
    subject_name CHARACTER VARYING(255)
) 
AS $$
DECLARE
    offset_value INT;
BEGIN
    offset_value := (in_page - 1) * in_pageSize;

    RETURN QUERY
    SELECT
        std.student_id,
        std.student_name,
        sub.subject_id,
        sub.subject_name
    FROM
        students std
    JOIN
        studentsubjects studsub ON std.student_id = studsub.student_id
    JOIN
        subjects sub ON studsub.subject_id = sub.subject_id
    WHERE
        std.student_name ILIKE '%' || in_search_pattern || '%'
    ORDER BY
        CASE
            WHEN in_order_direction = 'ASC' AND in_orderBy_column = 'student_id' THEN std.student_id::TEXT
            WHEN in_order_direction = 'ASC' AND in_orderBy_column = 'student_name' THEN std.student_name
        END ASC,
        CASE
            WHEN in_order_direction = 'DESC' AND in_orderBy_column = 'student_id' THEN std.student_id::TEXT
            WHEN in_order_direction = 'DESC' AND in_orderBy_column = 'student_name' THEN std.student_name
        END DESC
    OFFSET
        offset_value
    LIMIT
        in_pageSize;
END;
$$ LANGUAGE plpgsql;

-- table delete trigger function

create or REPLACE function delete_trigger_function()
returns trigger as $$
BEGIN

-- insert the deleted row into the studenthistory table;







