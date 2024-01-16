-- FUNCTION: public.delete_item(integer)

-- DROP FUNCTION IF EXISTS public.delete_item(integer);

CREATE OR REPLACE FUNCTION public.delete_item(
	p_itemid integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

BEGIN
    
-- 	check if itemid exists;

	IF NOT EXISTS (SELECT 1 FROM ITEMS WHERE itemid = p_itemid) THEN
	RAISE EXCEPTION 'Item with itemid % not found',p_itemid;
	END IF;
	
-- 	UPDATE 'datedeleted' for the provided itemid
	update items 
	set datedeleted = CURRENT_TIMESTAMP
	WHERE  itemid = p_itemid;

END;
$BODY$;

ALTER FUNCTION public.delete_item(integer)
    OWNER TO postgres;
