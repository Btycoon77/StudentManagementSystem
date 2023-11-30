--  create extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  

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


--  creating brigde table

CREATE TABLE studentSubjects (
    studSub  SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
	guid uuid DEFAULT uuid_generate_v4(), 
    subject_id INT REFERENCES subjects(subject_id),
    datecreated DATE,
    datedeleted DATE
);



-- adding constraint SERIAL (auto increment)

ALTER TABLE studentssubject ADD CONSTRAINT SERIAL

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

