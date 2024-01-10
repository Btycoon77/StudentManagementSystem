select * from employee;

select dept_name,max(salary) as maxSalary
from employee  group by dept_name;

-- ===this same thing can be achieved by window function

select e.*,max(salary) over(partition by dept_name) as max_salary
from employee e;
-- only the difference here is instead of uisng group by I am using partition by 

--  row_number,rank, dense_rank, lead and lag;

select e.*, row_number() over(partition by dept_name) as rn
from employee e;

-- fetch the first 2 employees from each department to join the company

select * from (
	select e.*, row_number() over(partition by dept_name order by emp_id) as rn
	from employee e
)x

where x.rn <= 2;

--  fetch the top 3 employees in each department earning the max salary;
-- this is where rank comes into picture;

select * from (
	select e.*,
	rank() over(partition by dept_name order by salary desc) as rnk
	from employee e)x
where x.rnk <4;

-- update  employee set salary = 1000 where emp_id = 42;
SELECT * FROM EMPLOYEE


-- DENSE RANK
IT WILL SKIP THE DUPLICATE VALUE;


select * from (
	select e.*,
	rank() over(partition by dept_name order by salary desc) as rnk,
	rank() over(partition by dept_name order by salary desc) as DENSE_rnk
	from employee e)x
where x.rnk <4;


-- LEAD AND LAG

-- fetch a query to display if the salary of an employee is higher,
-- lower or equal to the previous employee.

-- it only returns the previous employee salary;
select e.* ,
lag(salary) over (partition by dept_name order by emp_id) as prev_emp_salary,
lead(salary) over (partition by dept_name order by emp_id) as next_emp_salary

from employee e;


select e.* ,
lag(salary) over (partition by dept_name order by emp_id) as prev_emp_salary,
case when e.salary >lag(salary) over (partition by dept_name order by emp_id) then 'Higher than previous employee'
	when e.salary >lag(salary) over (partition by dept_name order by emp_id) then 'Lower than previous employee'
	when e.salary >lag(salary) over (partition by dept_name order by emp_id) then 'Same as  than previous employee'
	end sal_range

from employee e;































