Windows function
1. RANK
2. DENSE
3. LEAD/LAG

-- -- create table employee(
-- -- emp_id serial primary key ,
-- -- emp_name varchar(200),
-- -- 	dept_name varchar(200),
-- -- 	salary integer
-- -- );

-- select * from employee;

-- -- SELECT * FROM DEPARTMENT;

-- -- Inserting 50 employees with random data
-- INSERT INTO employee (emp_name, dept_name, salary)
-- SELECT
--     'Employee' || emp_id,
--     CASE
--         WHEN emp_id % 5 = 0 THEN 'IT'
--         WHEN emp_id % 5 = 1 THEN 'HR'
--         WHEN emp_id % 5 = 2 THEN 'Finance'
--         WHEN emp_id % 5 = 3 THEN 'Marketing'
--         WHEN emp_id % 5 = 4 THEN 'Sales'
--     END,
--     (emp_id % 5 + 1) * 1000  -- Salary ranges from 1000 to 5000
-- FROM
--     generate_series(1, 50) emp_id;
