-- this is how we bulk insert

- separate all chapters in json to single rows
- create temp table chapters_temp with columns chapter_name, description, parent_chapter
- insert chapters from single rows to chapters_temp table
- bulk insert into chapters table from chapters_temp with parentid null for all chapters
- bulk update parentid in chapters table by matching chapter_name and parent_chapter_name from chapters_temp

==================================================================

CREATE OR REPLACE FUNCTION public.insert_hierarchical_chapters1(
    chapter_data jsonb
)
RETURNS void
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    -- Check if a chapter with the same name already exists
    IF EXISTS (
        SELECT 1
        FROM chapter
        WHERE UPPER(chapter_name COLLATE "C") = UPPER(chapter_data->>'ChapterName')
    ) THEN
        RAISE EXCEPTION 'Chapter with name % already exists', chapter_data->>'ChapterName';
    END IF;

    -- Create a temporary table to hold chapter data
    CREATE TEMPORARY TABLE chapters_temp (
        chapter_name VARCHAR(200),
        description VARCHAR(200),
        parent_chapter_name VARCHAR(200)
    );

    -- Insert chapters from single rows to chapters_temp table
    INSERT INTO chapters_temp (chapter_name, description, parent_chapter_name)
    SELECT
        UPPER(chapter_data->>'ChapterName') COLLATE "C",
        chapter_data->>'Description',
        UPPER(chapter_data->>'ParentChapter') COLLATE "C";

    -- Bulk insert into chapters table from chapters_temp with parentid null for all chapters
    INSERT INTO chapter (chapter_name, description, parent_id)
    SELECT
        ct.chapter_name,
        ct.description,
        NULL
    FROM
        chapters_temp ct
    WHERE
        NOT EXISTS (
            SELECT 1
            FROM chapter c
            WHERE c.chapter_name = ct.chapter_name
        );

    -- Bulk update parentid in chapters table by matching chapter_name and parent_chapter_name from chapters_temp
    UPDATE chapter c
    SET parent_id = parent.parent_id
    FROM (
        SELECT
            c1.chapter_id,
            c2.chapter_id AS parent_id
        FROM
            chapters_temp c1
            JOIN chapter c2 ON c1.parent_chapter_name = c2.chapter_name
    ) parent
    WHERE
        c.chapter_name = parent.chapter_name;

    -- Drop the temporary table
    DROP TABLE IF EXISTS chapters_temp;
END;
$BODY$;
