-- FUNCTION: public.add_item_with_translations(character varying, jsonb)

-- DROP FUNCTION IF EXISTS public.add_item_with_translations(character varying, jsonb);

CREATE OR REPLACE FUNCTION public.add_item_with_translations(
	p_itemcode character varying,
	p_translations jsonb)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

Declare 
	v_itemid int;
	t jsonb;
	v_translationid int;
begin
-- 	insert into items table;

	insert into items(itemcode,item_translationcode,datecreated)
	values(p_itemcode,'item_'|| currval('items_itemid_seq'),CURRENT_TIMESTAMP )
	returning itemid into v_itemid;
	

    -- Insert into 'translations' table
    FOR t IN  select * from  jsonb_array_elements(p_translations) 
    LOOP
        INSERT INTO translations (translationcode, text, lang)
        VALUES ('translation_' || v_itemid, t->>'text', t->>'language')
		RETURNING translationid into v_translationid;
  
	
	-- Insert into 'itemTranslations' table
		INSERT INTO itemTranslations (itemid, translationid)
		VALUES (v_itemid, v_translationid);
	END LOOP;
END;
$BODY$;

ALTER FUNCTION public.add_item_with_translations(character varying, jsonb)
    OWNER TO postgres;
