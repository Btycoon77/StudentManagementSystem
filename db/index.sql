create UNIQUE INDEX idx_student on students(guid);
--  we are creating guid as unique column because it uniquely identifies the row from the table not student_name becasue , same name can be of more than one student;


create UNIQUE INDEX idx_subject on subjects(subject_name,guid);
-- we are creating subject_name as unique because every subject is unique;



create UNIQUE INDEX idx_studentsubjects on studentsubjects(subject_id,student_id);

-- create UNIQUE INDEX idx_studentsubjects on studentsubjects(guid);


--  dropping the index from the table

DROP INDEX idx_subject;

--  you can alternatively make constraint like this too.ABORT
CREATE TABLE students (
    id serial PRIMARY KEY,
    name text NOT NULL,
    height float NOT NULL CHECK (height BETWEEN 1 AND 2.7),
    UNIQUE (name, height)
);


=========================================================
==========================================================

Indexes are special lookup table that the database search engine can use to speed up data retrieval. 

types:

1. Single column indexes;

create INDEX index_name on table_name (column_name);

2. multicolumn indexes;

create index index_name on table_name(column1_name, column2_name);

3. Unique Indexes;

=> it doesnt allow duplicate values to be inserted into the table.

CREATE  UNIQUE INDEX index_name  on table_name(column_name);

4. Parial indexes;

=> It is an index built over a subset of a table; the subset is defined by a conditonal expression 

CREATE INDEX index_name on table_name( condtional_Expression);

5. Implicit Indexes;

=> CREATE INDEX salary_index ON COMPANY(salary);

====Use cases;

1. Equality searches;

create index idx_Employee_id  ON employee(Employee_id);

-- query with equality search
select * from employee where employee_id =123;

2. Range Queries;

=> create index idx_salary on employee(salary);

--  Query with range search
select * from employee where salary between 50000 and 700000;

3. Faster Sorting

create index idx_employee_name On employee(employee_name);

-- query with sorting

select * from employee order by employee_name;

4. Accelerated Joins;

-- Create B-tree index on department_id in both tables
CREATE INDEX idx_employee_department_id ON employee(department_id);
CREATE INDEX idx_department_id ON department(department_id);

-- Query with join
SELECT * FROM employee
JOIN department ON employee.department_id = department.department_id;

5. Optimizing Aggregations;

create index idx_Sale_Amount ON sales(sale_amount);

-- Query with aggregation

select product_id, AVG(sale_amount) from sales group by product_id;

