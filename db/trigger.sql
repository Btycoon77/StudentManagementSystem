--  creating a function for student_soft_Delete;

create or REPLACE function student_soft_delete_trigger_function()
returns TRIGGER 
AS $$

BEGIN

--  inserting the deleted row into the studentHistory table;

    INSERT INTO studentHistory(student_name,age,datedeleted,datecreated,student_id,operation)
    VALUES(old.student_name,old.age,null,old.datecreated,old.student_id,'I');

    return new;
end;
$$ language plpgsql;

-- creating a trigger for student_soft_Delete;



CREATE TRIGGER student_soft_delete_trigger
AFTER  UPDATE OR   INSERT ON students
FOR EACH ROW 

EXECUTE FUNCTION student_soft_delete_trigger_function()

-- CREATING A TRIGGER FOR HARD DELETE (BEFORE DELETE)

CREATE TRIGGER student_hard_delete_trigger
BEFORE  DELETE ON students
FOR EACH ROW 
EXECUTE FUNCTION student_soft_delete_trigger_function()


-- select * from students;
-- dropping a triiger

drop trigger student_soft_delete_trigger on students;

-- dropping a function
drop function if exists student_soft_delete_trigger_function()

-- select * from studenthistory;


-- 












-------------------------------------------
-----------------------------------------

--- creating a trigger function for subject

create or REPLACE function subject_soft_delete_trigger_function()
returns TRIGGER 
AS $$

BEGIN

--  inserting the deleted row into the subjectHistory table;

    INSERT INTO subjectHistory(subject_name,datedeleted,datecreated,subject_id)
    VALUES(old.subject_name,current_date,old.datecreated,old.subject_id);

    return new;
end;
$$ language plpgsql;


-- creating a trigger for subject_soft_Delete;

CREATE TRIGGER subject_soft_delete_trigger
BEFORE  UPDATE ON subjects
FOR EACH ROW
EXECUTE FUNCTION subject_soft_delete_trigger_function()

--  creating a trigger for subject_hard_delete;

CREATE TRIGGER subject_hard_delete_trigger
BEFORE DELETE on subjects
FOR EACH ROW
execute function subject_soft_delete_trigger_function()


-- insert =>new  
-- update => new || old
-- delete => old















