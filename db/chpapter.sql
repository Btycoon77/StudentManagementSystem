
CREATE TABLE chapter (
    chapter_id INT PRIMARY KEY,
    chapter_name VARCHAR(255),
    description TEXT,
    parent_id INT,
    subject_id INT,
    FOREIGN KEY (parent_id) REFERENCES chapter(chapter_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

-- Add a foreign key constraint(parent_id)
ALTER TABLE chapter
ADD CONSTRAINT chapter_parent_id_fkey
FOREIGN KEY (parent_id)
REFERENCES chapter(chapter_id);

-- Add a foreign key constraint(subject_id)

ALTER TABLE chapter
ADD CONSTRAINT chapter_subject_id_fkey
FOREIGN KEY (subject_id)
REFERENCES subjects(subject_id);

--  updating chapter_name to all the data of the chapter table to uppercase;
update chapter set chapter_name = upper(chapter_name); 


-- adding datatype serial to chapter_id 

alter table chapter drop constraint  chapter_parent_id_fkey;

alter table chapter drop constraint  chapter_subject_id_fkey;


alter table chapter drop column chapter_id ;


alter table chapter add column chapter_id serial primary key;

-- adding unique constriant in chapter table;

ALTER TABLE chapter
ADD CONSTRAINT unique_chapter_name UNIQUE ( chapter_name);



-- Inserting data into the chapter table
-- INSERT INTO chapter (chapter_id, chapter_name, description, parent_id, subject_id)
-- VALUES (1, 'Unit1', 'This is chapter 1', NULL, 227)

-- INSERT INTO chapter (chapter_id, chapter_name, description, parent_id, subject_id)
-- VALUES (2, 'Unit1.1', 'This is chapter 1.1', 1, 227);

-- INSERT INTO chapter (chapter_id, chapter_name, description, parent_id, subject_id)
-- VALUES (4, 'Unit1.1.1', 'This is chapter 1.1.1', 2, 227);

-- INSERT INTO chapter (chapter_id, chapter_name, description, parent_id, subject_id)
-- VALUES (5, 'Unit1.1.2', 'This is chapter 1.1.2', 2, 227);

-- INSERT INTO chapter (chapter_id, chapter_name, description, parent_id, subject_id)
-- VALUES (3, 'Unit1.2', 'This is chapter 1.2', 1, 227);

select * from chapter;

===================================================
===================================================

-- FUNCTION: public.get_chapters(integer)

-- DROP FUNCTION IF EXISTS public.get_chapters(integer);



{
"chapter_name": "Unit2",
"chapter_id": 8,
"description": "This is chapter 2",
"parent_id": null,
"subject_id": 227,
"children": [
        {
    "chapter_name": "Unit2.1",
    "chapter_id": 9,
    "description": "This is chapter 2.1",
    "parent_id": null,
    "subject_id": 227,
    "children": []
        }
]
}
























