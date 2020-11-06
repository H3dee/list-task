

-- parents
INSERT INTO public.big(content)
SELECT 'lorem ipsum fffffffffff gfggggggggg thrkhmt  htrhmlrthm lrlthm'
FROM generate_series(0, 500000)


-- childs
INSERT INTO public.big(content, parent_id)
SELECT 'lorem ipsum fffffffffff gfggggggggg thrkhmt  htrhmlrthm lrlthm вввввввввввввввввввввввввввввввввв', floor(random()*(500000-1+1))+1
FROM generate_series(0, 500000)