--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (84ade85)
-- Dumped by pg_dump version 16.9

-- Started on 2025-09-02 09:20:12 UTC

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
-- TOC entry 216 (class 1259 OID 16484)
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
-- TOC entry 217 (class 1259 OID 16494)
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
-- TOC entry 218 (class 1259 OID 16503)
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
-- TOC entry 219 (class 1259 OID 16516)
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
-- TOC entry 220 (class 1259 OID 16527)
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
-- TOC entry 221 (class 1259 OID 16536)
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
-- TOC entry 222 (class 1259 OID 16545)
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
\.


--
-- TOC entry 3409 (class 0 OID 16484)
-- Dependencies: 216
-- Data for Name: news_articles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news_articles (id, title, content, excerpt, category, image_url, author_id, is_published, is_featured, published_at, created_at, updated_at) FROM stdin;
09a22afb-be95-431e-8a5d-3d650a978524	Welcome to SkyBlock Legends!	We are excited to announce the launch of SkyBlock Legends, the ultimate Minecraft SkyBlock experience! Join our community of builders, fighters, and explorers as we embark on an incredible journey together.	Join the ultimate Minecraft SkyBlock server with custom features and amazing community!	community	\N	c2cab099-29e3-4dc7-afda-33a6ae65b87b	t	f	2025-09-01 07:54:23.720495	2025-09-02 07:54:23.720495	2025-09-02 07:54:23.720495
\.


--
-- TOC entry 3410 (class 0 OID 16494)
-- Dependencies: 217
-- Data for Name: seasons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seasons (id, name, description, version, start_date, end_date, is_active, features, video_url, image_url, created_at) FROM stdin;
58aec908-da9c-4c11-a18c-2d4cdaa11240	Season Fire Sky	Fire Sky is a lorem ispum dolure 	S1	2025-09-01 00:00:00	2025-09-01 00:00:00	t	[]			2025-09-02 08:53:44.442748
532669fc-6ca9-43f4-9a71-e726619dc83c	xdcvdxdbd	xscfdsxdd	S1	2025-09-26 00:00:00	\N	t	[]			2025-09-02 08:54:02.754688
\.


--
-- TOC entry 3411 (class 0 OID 16503)
-- Dependencies: 218
-- Data for Name: server_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.server_config (id, name, ip, description, version, max_players, is_online, player_count, updated_at) FROM stdin;
\.


--
-- TOC entry 3412 (class 0 OID 16516)
-- Dependencies: 219
-- Data for Name: store_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_items (id, name, description, price, category, features, image_url, is_popular, is_active, "order", created_at) FROM stdin;
be3157eb-03d8-4d1a-bb6b-44943401b5b2	Legendary Crate Key	Open legendary crates for amazing rewards!	$4.99	item	["Rare Items", "Exclusive Tools", "Special Blocks", "Bonus Money"]	\N	f	t	2	2025-09-02 07:54:37.160574
db4bcb65-9a25-42c9-940a-bd9c3b180adf	Money Boost Package	Get a head start with instant in-game money!	$14.99	item	["$50,000 In-Game Money", "2x Money Multiplier", "Exclusive Items"]	\N	t	t	3	2025-09-02 07:54:37.160574
\.


--
-- TOC entry 3413 (class 0 OID 16527)
-- Dependencies: 220
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_members (id, name, role, description, avatar_url, "order", is_active, created_at) FROM stdin;
0ac80bae-2e0a-426e-8946-6c3a7c95072d	Alex Rahman	founder	Founder and lead developer of SkyBlock Legends. Passionate about creating amazing gaming experiences.	\N	1	t	2025-09-02 07:53:55.051052
912d440b-7cbc-4562-8049-648d9da447ab	Sarah Khan	admin	Head administrator ensuring smooth server operations and community management.	\N	2	t	2025-09-02 07:53:55.051052
4e814351-d13e-49f3-90f4-748849fc556a	Mike Johnson	developer	Backend developer working on server plugins and custom features.	\N	3	t	2025-09-02 07:53:55.051052
9a3ca22a-356f-4025-8c6a-93e4cfaa5026	Emma Wilson	moderator	Community moderator helping players and maintaining server rules.	\N	4	t	2025-09-02 07:53:55.051052
\.


--
-- TOC entry 3414 (class 0 OID 16536)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password, role, created_at, updated_at) FROM stdin;
c2cab099-29e3-4dc7-afda-33a6ae65b87b	admin	$2b$10$.LDGztY62xqPHwC.LfUN.eWkUtF1s/9iNChMROfJlfLIJZknG9ol.	admin	2025-09-02 07:41:02.61532	2025-09-02 07:41:02.61532
\.


--
-- TOC entry 3415 (class 0 OID 16545)
-- Dependencies: 222
-- Data for Name: voting_sites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.voting_sites (id, name, url, description, reward, "order", is_active, created_at) FROM stdin;
fb8694bb-2ea0-42b7-b414-921779317013	MinecraftServers.org	https://minecraftservers.org/vote/123456	Vote for us on MinecraftServers.org	$500 in-game money + 1 Diamond	1	t	2025-09-02 07:53:58.715784
18cf58e1-8c42-45e0-8d7a-9acb80969743	Minecraft-MP	https://minecraft-mp.com/server/123456/vote	Support us on Minecraft-MP	2 Vote Keys + Experience Boost	2	t	2025-09-02 07:53:58.715784
7fdfdea1-ec25-42ab-bdf3-9005bf7c42fe	TopMinecraftServers	https://topminecraftservers.org/vote/123456	Vote on TopMinecraftServers	1 Rare Crate Key + Money Boost	3	t	2025-09-02 07:53:58.715784
\.


--
-- TOC entry 3247 (class 2606 OID 16556)
-- Name: gallery_images gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_images
    ADD CONSTRAINT gallery_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3249 (class 2606 OID 16558)
-- Name: news_articles news_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_pkey PRIMARY KEY (id);


--
-- TOC entry 3251 (class 2606 OID 16560)
-- Name: seasons seasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seasons
    ADD CONSTRAINT seasons_pkey PRIMARY KEY (id);


--
-- TOC entry 3253 (class 2606 OID 16562)
-- Name: server_config server_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.server_config
    ADD CONSTRAINT server_config_pkey PRIMARY KEY (id);


--
-- TOC entry 3255 (class 2606 OID 16564)
-- Name: store_items store_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_items
    ADD CONSTRAINT store_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3257 (class 2606 OID 16566)
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- TOC entry 3259 (class 2606 OID 16568)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3261 (class 2606 OID 16570)
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- TOC entry 3263 (class 2606 OID 16572)
-- Name: voting_sites voting_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.voting_sites
    ADD CONSTRAINT voting_sites_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 16573)
-- Name: news_articles news_articles_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


-- Completed on 2025-09-02 09:20:14 UTC

--
-- PostgreSQL database dump complete
--

