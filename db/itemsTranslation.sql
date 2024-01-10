create table items(
	ItemId serial primary key,
	itemcode varchar(200),
	item_TranslationCode varchar(200)

);

-- select * from items;

create table translations(
	translationId serial primary key,
	translationCode varchar(200),
	text varchar(200),
	language varchar(200),
	unique(translationCode)

);

alter table items add constraint unique_items unique(itemcode);

-- select * from items;

select * from translations;

CREATE TABLE items (
    itemid SERIAL PRIMARY KEY,
    itemcode VARCHAR(255) NOT NULL,
    item_translationcode VARCHAR(255) NOT NULL
);

ALTER TABLE items
ADD CONSTRAINT itemcode_format_check CHECK (itemcode = ('I' || itemid)::VARCHAR);

ALTER TABLE items
ADD CONSTRAINT item_translationcode_format_check CHECK (item_translationcode = ('item_' || itemid)::VARCHAR);

CREATE TABLE translations (
    translationid SERIAL PRIMARY KEY,
    translationcode VARCHAR(255) NOT NULL,
    text TEXT,
    langu VARCHAR(255) NOT NULL
);