-- FUNCTION: public.update_item_with_translations(character varying, jsonb)

-- DROP FUNCTION IF EXISTS public.update_item_with_translations(character varying, jsonb);

CREATE OR REPLACE FUNCTION public.update_item_with_translations(
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
begin
-- 	Get itemid for the provided itemcode

	SELECT itemid into v_itemid
	from items 
	where itemcode = p_itemcode;
	
	IF v_itemid is not null then 
-- 		uddate the existing transaltions;

   
    FOR t IN  select * from  jsonb_array_elements(p_translations) 
    LOOP
       UPDATE translations 
	   SET text = t->>'text'
	   where translationcode = 'translation_'|| v_itemid
	   AND  lang = t->>'language';
	   
-- -- 	   if the transaltion doesn not exist 
-- 		if not found then 
-- 		INSERT INTO translations(translationcode,text,lang)
-- 		VALUES('translation_'|| v_itemid, t->>'text',t->>'language');
-- 		END IF;
    END LOOP;
	
	ELSE 
		RAISE EXCEPTION 'Item with itemcode % not found',p_itemcode;
	END IF;
END;
$BODY$;

ALTER FUNCTION public.update_item_with_translations(character varying, jsonb)
    OWNER TO postgres;
