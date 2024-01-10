s--  basically creating crud here using dbms sql

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



--  subequery 
-- function for pagination and subjectnode creation using join

CREATE OR REPLACE FUNCTION get_pagination_join_info(
    in_page INT,
    in_pageSize INT,
    in_search_pattern VARCHAR(255),
    in_orderBy_column VARCHAR(255),
    in_order_direction VARCHAR(4)
) RETURNS TABLE (
    student_id INTEGER,
    student_name CHARACTER VARYING(255),
    subjects JSONB
) 
AS $$
DECLARE
    offset_value INT;
BEGIN
    offset_value := (in_page - 1) * in_pageSize;

    RETURN QUERY
    SELECT
        std.guid, -- guid hunapryo
        std.student_name,
        jsonb_agg(jsonb_build_object(
            'subject_id', sub.guid, --guid hunapryo
            'subject_name', sub.subject_name
        )) AS subjects
    FROM
        students std
    JOIN
        studentsubjects studsub ON std.student_id = studsub.student_id
    JOIN
        subjects sub ON studsub.subject_id = sub.subject_id
    WHERE
        std.student_name ILIKE '%' || in_search_pattern || '%'
    GROUP BY
        std.student_id, std.student_name
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



--  function for pagination;

CREATE TYPE paginated_student_info AS (
    student_id INTEGER,
    student_name CHARACTER VARYING(255),
    age INTEGER,
    page_size INT,
    page INT,
    offset_value INT
);

CREATE OR REPLACE FUNCTION get_paginated_students(
    in_page_size INT,
    in_page INT,
    in_search_pattern VARCHAR(255),
    in_order_by_column VARCHAR(255),
    in_order_direction VARCHAR(4)
) RETURNS SETOF paginated_student_info AS $$
DECLARE
    offset_value INT;
BEGIN
    offset_value := (in_page - 1) * in_page_size;

    RETURN QUERY
    SELECT
        s.student_id,
        s.student_name,
        s.age,
        in_page_size,
        in_page,
        offset_value
    FROM
        students s
    WHERE
         s.student_name ILIKE  in_search_pattern || '%' 
    ORDER BY
        CASE
            WHEN in_order_direction = 'ASC' THEN
                CASE in_order_by_column
                    WHEN 'student_id' THEN s.student_id::TEXT
                    WHEN 'student_name' THEN s.student_name
                END
            END ASC,
        CASE
            WHEN in_order_direction = 'DESC' THEN
                CASE in_order_by_column
                    WHEN 'student_id' THEN s.student_id::TEXT
                    WHEN 'student_name' THEN s.student_name
                END
            END DESC
    OFFSET
        offset_value
    LIMIT
        in_page_size;
END;
$$ LANGUAGE plpgsql;


-- syntax of trigger

create trigger trigger_name
{BEFORE | AFTER} {event}

on table_name 

FOR EACH {ROW | STATEMENT}

EXECUTE PROCEDURE trigger_function