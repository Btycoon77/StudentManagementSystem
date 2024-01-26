
-- FUNCTION: public.student_insert_update()

-- DROP FUNCTION IF EXISTS public.student_insert_update();

CREATE OR REPLACE FUNCTION public.student_insert_update()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

begin
 	IF TG_OP = 'INSERT' THEN
		INSERT INTO studenthistory(student_id,student_name,age,datecreated,datedeleted,operation)
		VALUES(NEW.student_id,NEW.student_name,NEW.age,NEW.datecreated,NULL,'I');
		RETURN NEW;
	

	ELSEIF  TG_OP ='UPDATE' THEN 
-- 		check if datedeleted is NULL for the old record
		IF NEW.datedeleted IS  NULL THEN
-- 		 we need old data to be inserted into the studenthistory table so we use OLD.column_name;
			INSERT INTO studenthistory(student_id,student_name,age,datecreated,datedeleted,email,password,operation)
			VALUES(OLD.student_id,OLD.student_name,OLD.age,OLD.datecreated,NULL,old.email,old.password,'U');
			
		ELSE
-- 			insert a new record for the soft deleted ones
			INSERT INTO studenthistory(student_id,student_name,age,datedeleted,datecreated,operation)
			VALUES(OLD.student_id,OLD.student_name,OLD.age,OLD.datedeleted,OLD.datecreated,'D');

			UPDATE studentsubjects set datedeleted = CURRENT_TIMESTAMP
			WHERE student_id = old.student_id

			
		END IF;
		RETURN NEW;
		
	ELSEIF TG_OP = 'DELETE' THEN 
-- 		insert for deleted records
		 INSERT INTO studenthistory (student_id, student_name, age, datedeleted, datecreated, operation)
         VALUES (OLD.student_id, OLD.student_name, OLD.age, OLD.datedeleted, OLD.datecreated, 'R');

		 RETURN OLD;
		
	
	END IF;
	
END;
$BODY$;

ALTER FUNCTION public.student_insert_update()
    OWNER TO postgres;





--  CREATING TRIGGER


-- DROP TRIGGER IF EXISTS student_del_insert ON public.students;

CREATE OR REPLACE TRIGGER student_del_insert
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.student_insert_update();


-- ------------------FOR SUBJECTS TRIGGER

-- FUNCTION: public.subject_insert_update()

-- DROP FUNCTION IF EXISTS public.subject_insert_update();

CREATE OR REPLACE FUNCTION public.subject_insert_update()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

begin
 	IF TG_OP = 'INSERT' THEN
		INSERT INTO subjecthistory(subject_id,subject_name,datecreated,datedeleted,operation)
		VALUES(NEW.subject_id,NEW.subject_name,NEW.datecreated,NULL,'I');
		RETURN NEW;
	

	ELSEIF  TG_OP ='UPDATE' THEN 
-- 		check if datedeleted is NULL for the old record
		IF NEW.datedeleted IS  NULL THEN
-- 		 we need old data to be inserted into the subjecthistory table so we use OLD.column_name;
			INSERT INTO subjecthistory(subject_id,subject_name,datecreated,datedeleted,operation)
			VALUES(OLD.subject_id,OLD.subject_name,OLD.datecreated,NULL,'U');
			
		ELSE
-- 			insert a new record for the soft deleted ones
			INSERT INTO subjecthistory(subject_id,subject_name,datedeleted,datecreated,operation)
			VALUES(OLD.subject_id,OLD.subject_name,OLD.datedeleted,OLD.datecreated,'D');
			
			UPDATE studentsubjects set datedeleted = CURRENT_TIMESTAMP
			WHERE subject_id = old.subject_id;
			
			
		END IF;
		RETURN NEW;
		
	ELSEIF TG_OP = 'DELETE' THEN 
-- 		insert for deleted records
		 INSERT INTO subjecthistory (subject_id, subject_name, datedeleted, datecreated, operation)
         VALUES (OLD.subject_id, OLD.subject_name,  OLD.datedeleted, OLD.datecreated, 'R');
		 RETURN OLD;
		
	
	END IF;
	
END;
$BODY$;

ALTER FUNCTION public.subject_insert_update()
    OWNER TO postgres;


//////// TRIGGER FOR SUBJECTS;

CREATE OR REPLACE TRIGGER subject_del_insert
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION public.subject_insert_update();
