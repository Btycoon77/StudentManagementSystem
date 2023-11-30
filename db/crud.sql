--  basically creating crud here using dbms sql

CREATE OR REPLACE function register_Student(
student_name VARCHAR(200),
age integer
-- you dont need guid and student_id as parameter bcoz you ha
-- that is by default passed from the schema;
) RETURNS SETOF students AS $$

DECLARE
	student_record students;-- you are creating object of student
begin
 	insert into students(student_name,age)
	values(student_name,age)
	returning * into strict student_record;
	
-- 	add the following line to return the inserted student_record
	return next student_record;
end;
$$ language plpgsql;


--  function for pagination;


--  subequery 

CREATE OR REPLACE FUNCTION get_paginated_students(
    page_size INT,
    page INT,
    search_pattern VARCHAR(255),
    order_by_column VARCHAR(255),
    order_direction VARCHAR(4)
) RETURNS table(student_id integer,student_name character varying(255),age integer) 
AS $$
DECLARE
    offset_value INT;
BEGIN
    offset_value := (page - 1) * page_size;

    RETURN QUERY
    SELECT
        s.student_id,
        s.student_name,
        s.age
    
    FROM
        students AS s
    WHERE
         s.student_name ILIKE  search_pattern || '%' 
    ORDER BY
        CASE
            WHEN order_direction = 'ASC' AND order_by_column = 'student_id' THEN s.student_id::TEXT
            WHEN order_direction = 'ASC' AND order_by_column = 'student_name' THEN s.student_name
        END ASC,
        CASE
            WHEN order_direction = 'DESC' AND order_by_column = 'student_id' THEN s.student_id::TEXT
            WHEN order_direction = 'DESC' AND order_by_column = 'student_name' THEN s.student_name
        END DESC
    OFFSET
        offset_value
    LIMIT
        page_size;
END;
$$ LANGUAGE plpgsql;


-- SELECT
--         (student_id)::integer AS student_id,
--         student_name::varchar(255),
--         age::integer,
--        	guid:: uuid,
--         datedeleted::date,
--         datecreated::date
--     FROM
--         students
--     WHERE
--         student_name ILIKE  'Ram' 
--     ORDER BY
--        student_id ASC

CREATE TYPE paginated_student_info AS (
    student_id INTEGER,
    student_name CHARACTER VARYING(255),
    age INTEGER,
    page_size INT,
    page INT,
    offset_value INT
);

CREATE OR REPLACE FUNCTION get_paginated_students(
    page_size INT,
    page INT,
    search_pattern VARCHAR(255),
    order_by_column VARCHAR(255),
    order_direction VARCHAR(4)
) RETURNS TABLE (
    student_id INTEGER,
    student_name CHARACTER VARYING(255),
    age INTEGER,
    page_size INT,
    page INT,
    offset_value INT
) 
AS $$
DECLARE
    offset_value INT;
BEGIN
    offset_value := (page - 1) * page_size;

    RETURN QUERY
    SELECT
        s.student_id,
        s.student_name,
        s.age,
        page_size,
        page,
        offset_value
    FROM
        students AS s
    WHERE
         s.student_name ILIKE  search_pattern || '%' 
    ORDER BY
        CASE
            WHEN order_direction = 'ASC' AND order_by_column = 'student_id' THEN s.student_id::TEXT
            WHEN order_direction = 'ASC' AND order_by_column = 'student_name' THEN s.student_name
        END ASC,
        CASE
            WHEN order_direction = 'DESC' AND order_by_column = 'student_id' THEN s.student_id::TEXT
            WHEN order_direction = 'DESC' AND order_by_column = 'student_name' THEN s.student_name
        END DESC
    OFFSET
        offset_value
    LIMIT
        page_size;
END;
$$ LANGUAGE plpgsql;

