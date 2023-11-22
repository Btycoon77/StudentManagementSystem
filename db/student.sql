--  create extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  

--  create table students
CREATE  TABLE students(
student_id  SERIAL  NOT NULL PRIMARY KEY,
guid uuid DEFAULT uuid_generate_v4(), 
student_name varchar(200) NOT NULL ,
age int NOT NULL
);

-- creating table subjects
CREATE TABLE Subjects(
subject_id SERIAL  NOT NULL PRIMARY KEY,
guid uuid DEFAULT uuid_generate_v4(),
subject_name varchar(200) NOT NULL
)


--  creating brigde table

CREATE TABLE studentSubjects (
    studSub  SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
	guid uuid DEFAULT uuid_generate_v4(), 
    subject_id INT REFERENCES subjects(subject_id)
);



-- adding constraint SERIAL (auto increment)

ALTER TABLE studentssubject ADD CONSTRAINT SERIAL


