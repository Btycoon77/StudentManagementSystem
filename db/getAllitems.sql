-- FUNCTION: public.get_all_items(character varying)

-- DROP FUNCTION IF EXISTS public.get_all_items(character varying);

CREATE OR REPLACE FUNCTION public.get_all_items(
	p_language character varying DEFAULT NULL::character varying)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    result JSONB;
BEGIN
    IF p_language IS NULL THEN
        -- Retrieve data without translations for all languages
        SELECT
            jsonb_agg(jsonb_build_object(
                'itemid', i.itemid,
                'itemcode', i.itemcode,
                'translations', t.translations
            )) INTO result
        FROM
            items i
        LEFT JOIN (
            SELECT
                it.itemid,
                jsonb_agg(jsonb_build_object(
                    'translationid', t.translationid,
                    'text', t.text,
                    'language', t.lang
                )) AS translations
            FROM
                itemTranslations it
            LEFT JOIN translations t ON it.translationid = t.translationid
            GROUP BY it.itemid
        ) t ON i.itemid = t.itemid;
    ELSE
        -- Retrieve data for a specific language
        SELECT
            jsonb_agg(jsonb_build_object(
                'itemid', i.itemid,
                'itemcode', i.itemcode,
                'translations', t.translations
            )) INTO result
        FROM
            items i
        LEFT JOIN (
            SELECT
                it.itemid,
                jsonb_agg(jsonb_build_object(
                    'translationid', t.translationid,
                    'text', t.text,
                    'language', t.lang
                )) AS translations
            FROM
                itemTranslations it
            LEFT JOIN translations t ON it.translationid = t.translationid
            WHERE
                t.lang = p_language
            GROUP BY it.itemid
        ) t ON i.itemid = t.itemid;
    END IF;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$BODY$;

ALTER FUNCTION public.get_all_items(character varying)
    OWNER TO postgres;
