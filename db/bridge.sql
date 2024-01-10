
-- drop function if exists upsert_student_and_subject;

CREATE OR REPLACE FUNCTION public.upsert_student_and_subject(
	p_student_name character varying,
	p_age integer,
	p_subjects jsonb,
	studentuuid uuid)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_student_id INTEGER;
    v_subject_id INTEGER;
    subject_data_subject_name VARCHAR;
    v_student_exists BOOLEAN;
BEGIN
    -- Upsert the student
    SELECT EXISTS (
        SELECT 1
        FROM students
        WHERE guid = StudentUUID
    ) INTO v_student_exists;

--     IF NOT v_student_exists THEN
        -- Insert a new student and retrieve the student_id
        INSERT INTO students (guid, student_name, age)
        VALUES (StudentUUID, p_student_name, p_age)
        ON CONFLICT (guid,student_name)
        DO UPDATE SET age = p_age
        RETURNING student_id INTO v_student_id;
--     ELSE
--         -- If the student exists, retrieve the student_id
--         SELECT student_id INTO v_student_id
--         FROM students
--         WHERE guid = StudentUUID;
--     END IF;

    -- Upsert the subjects
    FOR subject_data_subject_name IN (SELECT value->>'SubjectName' FROM jsonb_array_elements(p_subjects) AS x(value))
    LOOP
        -- Upsert the subject
		
		
        INSERT INTO subjects (guid, subject_name)
        VALUES (uuid_generate_v4(), subject_data_subject_name)
        ON CONFLICT (subject_name)
        DO NOTHING
        RETURNING subject_id INTO v_subject_id;

        -- Upsert the bridge model
        INSERT INTO studentsubjects (guid, subject_id, student_id)
        VALUES (uuid_generate_v4(), v_subject_id, v_student_id)
        ON CONFLICT (subject_id, student_id)
        DO NOTHING;
    END LOOP;
END;
$BODY$;