-- insert into employee(emp_id,emp_name,salary,dept_id,manager_id)
-- values('E1','Rahul',15000,'D1','M1');

create table employees(
emp_id varchar(20) PRIMARY KEY NOT NULL,
emp_nakme varchar(200) NOT NULL,
salary int NOT NULL ,
 dept_id varchar(20) REFERENCES Departments(dept_id),
 manager_id varchar(20) REFERENCES Managers(manager_id)
)

-- alter table department ALTER COLUMN dept_id TYPE VARCHAR(20);
-- select * from department;

-- create table departments(
-- dept_id varchar(20) PRIMARY KEY NOT NULL,
-- department_name varchar(200) NOT NULL
-- );

-- create table Managers(
-- manager_id varchar(20) PRIMARY KEY NOT NULL,
--  dept_id 	varchar(20) REFERENCES Departments(dept_id),
-- manager_name varchar(200) NOT NULL
-- )

-- create table projects(
-- project_id varchar(20) PRIMARY KEY NOT NULL,
-- project_name varchar(200) NOT NULL,
-- Team_member_id varchar(200) NOT NULL
-- );
