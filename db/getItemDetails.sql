-- FUNCTION: public.get_item_details(integer)

-- DROP FUNCTION IF EXISTS public.get_item_details(integer);

CREATE OR REPLACE FUNCTION public.get_item_details(
	p_itemid integer)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    result JSONB;
BEGIN
    SELECT
        jsonb_build_object(
            'itemid', i.itemid,
            'itemcode', i.itemcode,
            'translations', COALESCE(jsonb_agg(t.translation), '[]'::jsonb)
        ) INTO result
    FROM
        items i
    LEFT JOIN (
        SELECT
            t.translationid,
            jsonb_build_object(
                'translationid', t.translationid,
                'text', t.text,
                'language', t.lang
            ) AS translation
        FROM
            itemTranslations it
        LEFT JOIN translations t ON it.translationid = t.translationid
        WHERE
            it.itemid = p_itemid
    ) t ON true
    WHERE i.itemid = p_itemid
    GROUP BY i.itemid, i.itemcode;

    RETURN COALESCE(result, '{}'::jsonb);
END;
$BODY$;

ALTER FUNCTION public.get_item_details(integer)
    OWNER TO postgres;
