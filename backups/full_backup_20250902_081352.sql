--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (84ade85)
-- Dumped by pg_dump version 16.9

-- Started on 2025-09-02 08:13:52 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.news_articles DROP CONSTRAINT news_articles_author_id_users_id_fk;
ALTER TABLE ONLY public.voting_sites DROP CONSTRAINT voting_sites_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_unique;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.team_members DROP CONSTRAINT team_members_pkey;
ALTER TABLE ONLY public.store_items DROP CONSTRAINT store_items_pkey;
ALTER TABLE ONLY public.server_config DROP CONSTRAINT server_config_pkey;
ALTER TABLE ONLY public.seasons DROP CONSTRAINT seasons_pkey;
ALTER TABLE ONLY public.news_articles DROP CONSTRAINT news_articles_pkey;
ALTER TABLE ONLY public.gallery_images DROP CONSTRAINT gallery_images_pkey;
DROP TABLE public.voting_sites;
DROP TABLE public.users;
DROP TABLE public.team_members;
DROP TABLE public.store_items;
DROP TABLE public.server_config;
DROP TABLE public.seasons;
DROP TABLE public.news_articles;
DROP TABLE public.gallery_images;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16475)
-- Name: gallery_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_images (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    author text,
    category text,
    "order" integer DEFAULT 0 NOT NULL,
    is_visible boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 216 (class 1259 OID 16486)
-- Name: news_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_articles (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    excerpt text NOT NULL,
    category text NOT NULL,
    image_url text,
    author_id character varying,
    is_published boolean DEFAULT false NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 217 (class 1259 OID 16498)
-- Name: seasons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seasons (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    version text NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    is_active boolean DEFAULT false NOT NULL,
    features jsonb DEFAULT '[]'::jsonb NOT NULL,
    video_url text,
    image_url text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 218 (class 1259 OID 16509)
-- Name: server_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.server_config (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text DEFAULT 'SkyBlock Legends'::text NOT NULL,
    ip text DEFAULT 'play.skyblocklegends.net'::text NOT NULL,
    description text NOT NULL,
    version text DEFAULT '1.20.1'::text NOT NULL,
    max_players integer DEFAULT 2000 NOT NULL,
    is_online boolean DEFAULT true NOT NULL,
    player_count integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 219 (class 1259 OID 16524)
-- Name: store_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price text NOT NULL,
    category text NOT NULL,
    features jsonb DEFAULT '[]'::jsonb NOT NULL,
    image_url text,
    is_popular boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 220 (class 1259 OID 16537)
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    description text,
    avatar_url text,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 221 (class 1259 OID 16548)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 222 (class 1259 OID 16561)
-- Name: voting_sites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.voting_sites (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    description text,
    reward text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 3408 (class 0 OID 16475)
-- Dependencies: 215
-- Data for Name: gallery_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gallery_images (id, title, description, image_url, author, category, "order", is_visible, created_at) FROM stdin;
3488eac1-0cf4-44e2-ae36-267d857557e3	Epic Island Build	Amazing player island with custom architecture	https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800	PlayerOne	build	1	t	2025-09-02 07:54:11.800392
1b663eaf-4765-4b5e-8d78-f90d39b372b0	Community Event	Last weekends PvP tournament highlights	https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800	AdminTeam	event	2	t	2025-09-02 07:54:11.800392
3fa3380b-04ce-4912-8bec-942b96703481	Spawn Area	Our beautiful server spawn with custom details	data:image/jpeg;base64,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	BuildTeam	build	3	t	2025-09-02 07:54:11.800392
\.


--
-- TOC entry 3409 (class 0 OID 16486)
-- Dependencies: 216
-- Data for Name: news_articles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news_articles (id, title, content, excerpt, category, image_url, author_id, is_published, is_featured, published_at, created_at, updated_at) FROM stdin;
a4194a68-9bb6-43f0-9edd-a9fde941269e	sdfdsfd	sdgsdgsd	dsgsdgs	update		c2cab099-29e3-4dc7-afda-33a6ae65b87b	t	t	2025-09-02 07:53:45.189908	2025-09-02 07:47:45.480821	2025-09-02 07:47:45.480821
09a22afb-be95-431e-8a5d-3d650a978524	Welcome to SkyBlock Legends!	We are excited to announce the launch of SkyBlock Legends, the ultimate Minecraft SkyBlock experience! Join our community of builders, fighters, and explorers as we embark on an incredible journey together.	Join the ultimate Minecraft SkyBlock server with custom features and amazing community!	community	\N	c2cab099-29e3-4dc7-afda-33a6ae65b87b	t	f	2025-09-01 07:54:23.720495	2025-09-02 07:54:23.720495	2025-09-02 07:54:23.720495
\.


--
-- TOC entry 3410 (class 0 OID 16498)
-- Dependencies: 217
-- Data for Name: seasons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seasons (id, name, description, version, start_date, end_date, is_active, features, video_url, image_url, created_at) FROM stdin;
30cdb0df-c4ed-423e-b81d-e5b3886ecb01	Winter Season	Experience the magical winter season with snowy islands, ice challenges, and exclusive winter items!	S3	2025-01-01 00:00:00	\N	t	["Snow Biomes", "Ice Challenges", "Winter Crates", "Christmas Events", "Frozen Bosses"]	\N	\N	2025-09-02 07:54:07.404237
\.


--
-- TOC entry 3411 (class 0 OID 16509)
-- Dependencies: 218
-- Data for Name: server_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.server_config (id, name, ip, description, version, max_players, is_online, player_count, updated_at) FROM stdin;
\.


--
-- TOC entry 3412 (class 0 OID 16524)
-- Dependencies: 219
-- Data for Name: store_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_items (id, name, description, price, category, features, image_url, is_popular, is_active, "order", created_at) FROM stdin;
ea8696c5-2568-472f-b22a-4956d6d6c3cb	VIP Rank	Unlock VIP privileges with exclusive perks and benefits!	$9.99	rank	["Priority Support", "Exclusive Chat Colors", "VIP Commands", "Island Size Boost"]	\N	t	t	1	2025-09-02 07:54:37.160574
be3157eb-03d8-4d1a-bb6b-44943401b5b2	Legendary Crate Key	Open legendary crates for amazing rewards!	$4.99	item	["Rare Items", "Exclusive Tools", "Special Blocks", "Bonus Money"]	\N	f	t	2	2025-09-02 07:54:37.160574
db4bcb65-9a25-42c9-940a-bd9c3b180adf	Money Boost Package	Get a head start with instant in-game money!	$14.99	item	["$50,000 In-Game Money", "2x Money Multiplier", "Exclusive Items"]	\N	t	t	3	2025-09-02 07:54:37.160574
\.


--
-- TOC entry 3413 (class 0 OID 16537)
-- Dependencies: 220
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_members (id, name, role, description, avatar_url, "order", is_active, created_at) FROM stdin;
0ac80bae-2e0a-426e-8946-6c3a7c95072d	Alex Rahman	founder	Founder and lead developer of SkyBlock Legends. Passionate about creating amazing gaming experiences.	\N	1	t	2025-09-02 07:53:55.051052
912d440b-7cbc-4562-8049-648d9da447ab	Sarah Khan	admin	Head administrator ensuring smooth server operations and community management.	\N	2	t	2025-09-02 07:53:55.051052
4e814351-d13e-49f3-90f4-748849fc556a	Mike Johnson	developer	Backend developer working on server plugins and custom features.	\N	3	t	2025-09-02 07:53:55.051052
9a3ca22a-356f-4025-8c6a-93e4cfaa5026	Emma Wilson	moderator	Community moderator helping players and maintaining server rules.	\N	4	t	2025-09-02 07:53:55.051052
3da5300d-cca9-40df-96e4-fb8df508d77c	cxsdfgrs	dev11	fcgfvgsdgrgwr		0	t	2025-09-02 08:06:53.660712
\.


--
-- TOC entry 3414 (class 0 OID 16548)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password, role, created_at, updated_at) FROM stdin;
c2cab099-29e3-4dc7-afda-33a6ae65b87b	admin	$2b$10$.LDGztY62xqPHwC.LfUN.eWkUtF1s/9iNChMROfJlfLIJZknG9ol.	admin	2025-09-02 07:41:02.61532	2025-09-02 07:41:02.61532
\.


--
-- TOC entry 3415 (class 0 OID 16561)
-- Dependencies: 222
-- Data for Name: voting_sites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.voting_sites (id, name, url, description, reward, "order", is_active, created_at) FROM stdin;
fb8694bb-2ea0-42b7-b414-921779317013	MinecraftServers.org	https://minecraftservers.org/vote/123456	Vote for us on MinecraftServers.org	$500 in-game money + 1 Diamond	1	t	2025-09-02 07:53:58.715784
18cf58e1-8c42-45e0-8d7a-9acb80969743	Minecraft-MP	https://minecraft-mp.com/server/123456/vote	Support us on Minecraft-MP	2 Vote Keys + Experience Boost	2	t	2025-09-02 07:53:58.715784
7fdfdea1-ec25-42ab-bdf3-9005bf7c42fe	TopMinecraftServers	https://topminecraftservers.org/vote/123456	Vote on TopMinecraftServers	1 Rare Crate Key + Money Boost	3	t	2025-09-02 07:53:58.715784
5c075fe5-8bea-4585-ab94-93f260818c14	dsdfd	https://github.com/asiful2004/MinePortal.git	sdsdfde	11	0	t	2025-09-02 08:07:53.339718
\.


--
-- TOC entry 3247 (class 2606 OID 16485)
-- Name: gallery_images gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_images
    ADD CONSTRAINT gallery_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3249 (class 2606 OID 16497)
-- Name: news_articles news_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_pkey PRIMARY KEY (id);


--
-- TOC entry 3251 (class 2606 OID 16508)
-- Name: seasons seasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seasons
    ADD CONSTRAINT seasons_pkey PRIMARY KEY (id);


--
-- TOC entry 3253 (class 2606 OID 16523)
-- Name: server_config server_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.server_config
    ADD CONSTRAINT server_config_pkey PRIMARY KEY (id);


--
-- TOC entry 3255 (class 2606 OID 16536)
-- Name: store_items store_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_items
    ADD CONSTRAINT store_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3257 (class 2606 OID 16547)
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- TOC entry 3259 (class 2606 OID 16558)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3261 (class 2606 OID 16560)
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- TOC entry 3263 (class 2606 OID 16571)
-- Name: voting_sites voting_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.voting_sites
    ADD CONSTRAINT voting_sites_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 16572)
-- Name: news_articles news_articles_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


-- Completed on 2025-09-02 08:13:54 UTC

--
-- PostgreSQL database dump complete
--

