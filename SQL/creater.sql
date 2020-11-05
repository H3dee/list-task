CREATE TABLE public.list
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    content text COLLATE pg_catalog."default",
    parent_id integer,
    CONSTRAINT list_pkey PRIMARY KEY (id),
    CONSTRAINT list_parent_id_fkey FOREIGN KEY (parent_id)
        REFERENCES public.list (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.list
    OWNER to postgres;