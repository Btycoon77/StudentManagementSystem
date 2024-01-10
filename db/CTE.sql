--  CTE  defines  a temporary resultset that you can refer in select ,insert,update 



1. find the average of orders placed by each customer;

=> approach:  first find the total orders per customer
after that find the average number of orders placed by each customer;
 
==> solution 1: (subquery)

-- always remember while writing  inner query , you need to give alias name;

select avg(total_orders_per_customer) as avg_orders_per_customer from (
select order_customer_id,count(*) as total_orders_per_customer from orders 
group by order_customer_id) x ;// this x is an alias name given to this inner query;

==========================================
==========================================

==> solution 2: (CTE/WITH CLAUSE)

// whatever is my inner QUERY is made with clause;
// treat total_orders_per_customer this as a TABLE;

WITH total_orders_per_customer (// here you have to write the columns from the inner query
    order_customer_id,total_orders_per_customer
) as 

(
// inner query is to be placed here;
select order_customer_id,count(*) as total_orders_per_customer from orders 
group by order_customer_id) 
)
select avg(total_orders_per_customer) as avg_orders_per_customer from total_orders_per_customer 

===================================
==================================

2. find the premium customer who places more orders than the average number of orders 

=> approach: what you need to do here is , you have to find those customer whose order is greater than the average orders of the customers;

=> total order > average order 

select * from (
    select order_customer_id,count(*) as total_orders_per_customer from orders 
    group by order_customer_id
) total_orders

JOIN

    (
    select avg(total_orders_per_customer) as avg_orders_per_customer from (
    select order_customer_id,count(*) as total_orders_per_customer from orders 
    group by order_customer_id)x) average_orders


ON total_orders.total_orders_per_customer > average_orders.avg_orders_per_customer;


==========================
===========================
-- using with clause

-- 3 step process.
1. calculate total orders per customer;
2. calculate average number of orders for the customers;
3. get to know the customers who are premium.


WITH total_orders (order_customer_id,total_orders_per_customer) AS
(

    select order_customer_id,count(*) as total_orders_per_customer from orders 
    group by order_customer_id
),

-- here we are making multiple use of with 

average_orders(total_orders_per_customer,avg_orders_per_customer) AS
(
     select avg(total_orders_per_customer) as avg_orders_per_customer from total_orders
)

select  * from total_orders join average_orders ON
total_orders.total_orders_per_customer > average_orders.avg_orders_per_customer

===========================================
=========================================

RECURSIVE CTE
=> it references itself.It returns the result subset ,then it repeatedly references itself and stops when it returns all the resultsl

=> A recursive CTE has three elements:

1. non-recursive term: It is a CTE query definition that forms the base result set of the CTE structure.

2. Recursive term: One or more CTE query definition joined with non-recursive term using UNION or UNION ALL operator.ABORT

3. Termination check: the recursion stops when no rows are returned from the previous iteration.

-- SYNTAX:

WITH RECURSIVE cte_name AS (
    CTE_query_Definition    ---non recursive term  // base query

-- in order to join these two terms we use UNION ALL;

    UNION ALL                       --recursive term
    recursive_query_definition      --recursive term   // recursive query

)
SELECT * FROM cte_name


===========================
for an example:

WITH RECURSIVE my_cte AS (
    SELECT 1 AS n    ---non recursive term  // base query

-- in order to join these two terms we use UNION ALL;

    UNION ALL                       --recursive term
    SELECT n+1 FROM my_cte where n < 3      --recursive term   // recursive query

)
SELECT * FROM my_cte


=========================================

Example of RECURSIVE CTE


with recursive EmpCTE as (
-- 	base query;
 select emp_id, emp_name, manager_id
	from employees
	where emp_id = 7
	
	union all
	
-- 	recursive query
	
	select employees.emp_id, employees.emp_name,employees.manager_id
	from employees
	join EmpCTE
	ON employees.emp_id = EmpCTE.manager_id


)
select * from EmpCTE;








