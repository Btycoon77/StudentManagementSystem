-- FUNCTION: public.checkbox_new1(uuid, character varying, integer, jsonb)

-- DROP FUNCTION IF EXISTS public.checkbox_new1(uuid, character varying, integer, jsonb);

CREATE OR REPLACE FUNCTION public.checkbox_new1(
	p_student_id uuid,
	p_student_name character varying,
	p_age integer,
	p_subjects jsonb)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_student_id INTEGER;
    v_subject_id INTEGER;
	subj VARCHAR;
BEGIN
    -- Upsert the student
    INSERT INTO students (guid, student_name, age)
    VALUES (p_student_id, p_student_name, p_age)
    ON CONFLICT (guid,student_name)
    DO UPDATE SET student_name = EXCLUDED.student_name, age = EXCLUDED.age
    RETURNING student_id INTO v_student_id;

    -- Delete existing subjects not in the predefined list
    DELETE FROM studentsubjects
    WHERE student_id = v_student_id AND subject_id  IN (
        SELECT subject_id
        FROM subjects
        WHERE subject_name IN (select subject_name from subjects)
    );

    -- Upsert new subjects from the payload
    FOR subj IN (SELECT value->>'SubjectName' FROM jsonb_array_elements(p_subjects))
    LOOP
        -- Get the subject_id for the predefined subjects
        SELECT subject_id INTO v_subject_id
        FROM subjects
        WHERE subject_name = subj;

        -- Upsert the bridge model
        INSERT INTO studentsubjects (guid, subject_id, student_id)
        VALUES (uuid_generate_v4(), v_subject_id, v_student_id)
        ON CONFLICT (subject_id, student_id)
        DO NOTHING;
    END LOOP;
END;
$BODY$;

ALTER FUNCTION public.checkbox_new1(uuid, character varying, integer, jsonb)
    OWNER TO postgres;
