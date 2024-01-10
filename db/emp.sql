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


QUESTION =>1. find the employee salary whose salary is more than the average salary earned by all employee;

-- select * from employees;

select avg(salary) from employees;

select * from employees 
where salary > (
	select avg(salary) as avgSalary from employees
    -- when tbale is printed then the column name is avg

);

--  in SQL , we have got three kind of subquery;

1. Scalar subquery
=> it always return one row and one column;
=> the above sub QUERY is scalar subquery;

2. Multiple row subquery
--- type 1: multiple column and multiple row:
=> subquery which returns multiple row and multiple columns;

--- type 2: subquery which return 1 column and multiple rows;

QUESTION=>2
find the employees who earn the highest salary in each department;

select * FROM employees 
where (dept_name,salary) in (select  dept_name,max(salary)
from employees
group by dept_name
);

-- you can filter two column at the same time in the above;


--  grouy by => this clause is used to group rows that have the same values in the speicfied columns into summary rows like total or agverage often used with aggregate functions;

eg: in department colum you have it , finance,sales, accounting etc. and you want to group by department_name

suppose you have employee table with columns department ,salary. so when you try to find the total salary of each department then you use sum(salary) with GROUP BY clause;

type 3: single column, multiple rows;

QUESTON NO -3: find the department who do not have any employees;

select *
from department
where 
dept_name not in 
(select distinct dept_name from employees)


CORRELATED SUBQUERY

A subquery which is related to the outer query.

QUESTION NO -4:
Find the employees in each department whose salary is greater than the average salary in that department;

=> 
select * 
from employees e1
where salary > (select avg(salary) 
				from employees e2
				where e2.dept_name = e1.dept_name
			   );

--  create table sales;


create table sales(
store_id serial primary key not null,
store_name varchar(200) not null,
product_name varchar(200) not null,
	quantity int not null,
	price int  not null
);

insert into sales(store_id,store_name,product_name,quantity,price)
values
(1,'Apple store 1','Iphone 13 pro',1,2000 ),
(1,'Apple store 1','Mac book pro 14',1,2000 ),
(1,'Apple store 1','Airpods Pro',1,2000 ),
(2,'Apple store 2','Iphone 13 pro ',2,2000 ),
(3,'Apple store 3','Iphone 12 pro',1,750 ),
(3,'Apple store 3','Mac book pro 10',1,2000 ),
(4,'Apple store 4','Iphone 12 pro',2,1500 ),
(4,'Apple store 4','MacBook pro16',1,3500 )

-- find the stores who's sales where better 
-- than the average saels acorss all stores;


WITH StoreSales AS (
    SELECT
        store_id,
        SUM(quantity * price) AS total_sales
    FROM
        sales
    GROUP BY
        store_id
),
AverageSales AS (
    SELECT
        AVG(total_sales) AS avg_sales
    FROM
        StoreSales
)
SELECT
    ss.store_id,
    ss.total_sales
FROM
    StoreSales ss, AverageSales avg
WHERE
    ss.total_sales > avg.avg_sales;
