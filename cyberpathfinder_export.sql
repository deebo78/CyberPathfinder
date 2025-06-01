--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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

ALTER TABLE IF EXISTS ONLY public.work_roles DROP CONSTRAINT IF EXISTS work_roles_specialty_area_id_specialty_areas_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_roles DROP CONSTRAINT IF EXISTS work_roles_category_id_categories_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_role_tasks DROP CONSTRAINT IF EXISTS work_role_tasks_work_role_id_work_roles_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_role_tasks DROP CONSTRAINT IF EXISTS work_role_tasks_task_id_tasks_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_role_skills DROP CONSTRAINT IF EXISTS work_role_skills_work_role_id_work_roles_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_role_skills DROP CONSTRAINT IF EXISTS work_role_skills_skill_id_skills_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_role_knowledge DROP CONSTRAINT IF EXISTS work_role_knowledge_work_role_id_work_roles_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_role_knowledge DROP CONSTRAINT IF EXISTS work_role_knowledge_knowledge_item_id_knowledge_items_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_role_certifications DROP CONSTRAINT IF EXISTS work_role_certifications_work_role_id_work_roles_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_role_certifications DROP CONSTRAINT IF EXISTS work_role_certifications_certification_id_certifications_id_fk;
ALTER TABLE IF EXISTS ONLY public.specialty_areas DROP CONSTRAINT IF EXISTS specialty_areas_category_id_categories_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_track_categories DROP CONSTRAINT IF EXISTS career_track_categories_category_id_categories_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_track_categories DROP CONSTRAINT IF EXISTS career_track_categories_career_track_id_career_tracks_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_positions DROP CONSTRAINT IF EXISTS career_positions_nice_work_role_id_work_roles_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_positions DROP CONSTRAINT IF EXISTS career_positions_career_level_id_career_levels_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_levels DROP CONSTRAINT IF EXISTS career_levels_career_track_id_career_tracks_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_level_certifications DROP CONSTRAINT IF EXISTS career_level_certifications_certification_id_certifications_id_;
ALTER TABLE IF EXISTS ONLY public.career_level_certifications DROP CONSTRAINT IF EXISTS career_level_certifications_career_level_id_career_levels_id_fk;
ALTER TABLE IF EXISTS ONLY public.work_roles DROP CONSTRAINT IF EXISTS work_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.work_roles DROP CONSTRAINT IF EXISTS work_roles_code_unique;
ALTER TABLE IF EXISTS ONLY public.work_role_tasks DROP CONSTRAINT IF EXISTS work_role_tasks_pkey;
ALTER TABLE IF EXISTS ONLY public.work_role_skills DROP CONSTRAINT IF EXISTS work_role_skills_pkey;
ALTER TABLE IF EXISTS ONLY public.work_role_knowledge DROP CONSTRAINT IF EXISTS work_role_knowledge_pkey;
ALTER TABLE IF EXISTS ONLY public.work_role_certifications DROP CONSTRAINT IF EXISTS work_role_certifications_pkey;
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS tasks_pkey;
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS tasks_code_unique;
ALTER TABLE IF EXISTS ONLY public.specialty_areas DROP CONSTRAINT IF EXISTS specialty_areas_pkey;
ALTER TABLE IF EXISTS ONLY public.specialty_areas DROP CONSTRAINT IF EXISTS specialty_areas_code_unique;
ALTER TABLE IF EXISTS ONLY public.skills DROP CONSTRAINT IF EXISTS skills_pkey;
ALTER TABLE IF EXISTS ONLY public.skills DROP CONSTRAINT IF EXISTS skills_code_unique;
ALTER TABLE IF EXISTS ONLY public.knowledge_items DROP CONSTRAINT IF EXISTS knowledge_items_pkey;
ALTER TABLE IF EXISTS ONLY public.knowledge_items DROP CONSTRAINT IF EXISTS knowledge_items_code_unique;
ALTER TABLE IF EXISTS ONLY public.import_history DROP CONSTRAINT IF EXISTS import_history_pkey;
ALTER TABLE IF EXISTS ONLY public.certifications DROP CONSTRAINT IF EXISTS certifications_pkey;
ALTER TABLE IF EXISTS ONLY public.certifications DROP CONSTRAINT IF EXISTS certifications_code_unique;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_code_unique;
ALTER TABLE IF EXISTS ONLY public.career_tracks DROP CONSTRAINT IF EXISTS career_tracks_pkey;
ALTER TABLE IF EXISTS ONLY public.career_tracks DROP CONSTRAINT IF EXISTS career_tracks_name_unique;
ALTER TABLE IF EXISTS ONLY public.career_track_categories DROP CONSTRAINT IF EXISTS career_track_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.career_positions DROP CONSTRAINT IF EXISTS career_positions_pkey;
ALTER TABLE IF EXISTS ONLY public.career_levels DROP CONSTRAINT IF EXISTS career_levels_pkey;
ALTER TABLE IF EXISTS ONLY public.career_level_certifications DROP CONSTRAINT IF EXISTS career_level_certifications_pkey;
ALTER TABLE IF EXISTS public.work_roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.work_role_tasks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.work_role_skills ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.work_role_knowledge ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.work_role_certifications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tasks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.specialty_areas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.skills ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.knowledge_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.import_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.certifications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_tracks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_track_categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_positions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_levels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_level_certifications ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.work_roles_id_seq;
DROP TABLE IF EXISTS public.work_roles;
DROP SEQUENCE IF EXISTS public.work_role_tasks_id_seq;
DROP TABLE IF EXISTS public.work_role_tasks;
DROP SEQUENCE IF EXISTS public.work_role_skills_id_seq;
DROP TABLE IF EXISTS public.work_role_skills;
DROP SEQUENCE IF EXISTS public.work_role_knowledge_id_seq;
DROP TABLE IF EXISTS public.work_role_knowledge;
DROP SEQUENCE IF EXISTS public.work_role_certifications_id_seq;
DROP TABLE IF EXISTS public.work_role_certifications;
DROP SEQUENCE IF EXISTS public.tasks_id_seq;
DROP TABLE IF EXISTS public.tasks;
DROP SEQUENCE IF EXISTS public.specialty_areas_id_seq;
DROP TABLE IF EXISTS public.specialty_areas;
DROP SEQUENCE IF EXISTS public.skills_id_seq;
DROP TABLE IF EXISTS public.skills;
DROP SEQUENCE IF EXISTS public.knowledge_items_id_seq;
DROP TABLE IF EXISTS public.knowledge_items;
DROP SEQUENCE IF EXISTS public.import_history_id_seq;
DROP TABLE IF EXISTS public.import_history;
DROP SEQUENCE IF EXISTS public.certifications_id_seq;
DROP TABLE IF EXISTS public.certifications;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.career_tracks_id_seq;
DROP TABLE IF EXISTS public.career_tracks;
DROP SEQUENCE IF EXISTS public.career_track_categories_id_seq;
DROP TABLE IF EXISTS public.career_track_categories;
DROP SEQUENCE IF EXISTS public.career_positions_id_seq;
DROP TABLE IF EXISTS public.career_positions;
DROP SEQUENCE IF EXISTS public.career_levels_id_seq;
DROP TABLE IF EXISTS public.career_levels;
DROP SEQUENCE IF EXISTS public.career_level_certifications_id_seq;
DROP TABLE IF EXISTS public.career_level_certifications;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: career_level_certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_level_certifications (
    id integer NOT NULL,
    career_level_id integer NOT NULL,
    certification_id integer NOT NULL,
    priority integer DEFAULT 1,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: career_level_certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_level_certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_level_certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_level_certifications_id_seq OWNED BY public.career_level_certifications.id;


--
-- Name: career_levels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_levels (
    id integer NOT NULL,
    career_track_id integer NOT NULL,
    name text NOT NULL,
    experience_range text,
    description text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: career_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_levels_id_seq OWNED BY public.career_levels.id;


--
-- Name: career_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_positions (
    id integer NOT NULL,
    career_level_id integer NOT NULL,
    job_title text NOT NULL,
    nice_work_role_id integer,
    description text,
    notes text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: career_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_positions_id_seq OWNED BY public.career_positions.id;


--
-- Name: career_track_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_track_categories (
    id integer NOT NULL,
    career_track_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: career_track_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_track_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_track_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_track_categories_id_seq OWNED BY public.career_track_categories.id;


--
-- Name: career_tracks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_tracks (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    overview text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: career_tracks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_tracks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_tracks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_tracks_id_seq OWNED BY public.career_tracks.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certifications (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    issuer text,
    level text,
    domain text,
    renewal_period text,
    prerequisites text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.certifications_id_seq OWNED BY public.certifications.id;


--
-- Name: import_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.import_history (
    id integer NOT NULL,
    filename text NOT NULL,
    import_type text NOT NULL,
    records_imported integer NOT NULL,
    status text NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: import_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.import_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: import_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.import_history_id_seq OWNED BY public.import_history.id;


--
-- Name: knowledge_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_items (
    id integer NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: knowledge_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knowledge_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knowledge_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knowledge_items_id_seq OWNED BY public.knowledge_items.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: specialty_areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.specialty_areas (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    category_id integer,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: specialty_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.specialty_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: specialty_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.specialty_areas_id_seq OWNED BY public.specialty_areas.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: work_role_certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_role_certifications (
    id integer NOT NULL,
    work_role_id integer NOT NULL,
    certification_id integer NOT NULL,
    required boolean DEFAULT false
);


--
-- Name: work_role_certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.work_role_certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: work_role_certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.work_role_certifications_id_seq OWNED BY public.work_role_certifications.id;


--
-- Name: work_role_knowledge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_role_knowledge (
    id integer NOT NULL,
    work_role_id integer NOT NULL,
    knowledge_item_id integer NOT NULL
);


--
-- Name: work_role_knowledge_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.work_role_knowledge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: work_role_knowledge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.work_role_knowledge_id_seq OWNED BY public.work_role_knowledge.id;


--
-- Name: work_role_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_role_skills (
    id integer NOT NULL,
    work_role_id integer NOT NULL,
    skill_id integer NOT NULL
);


--
-- Name: work_role_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.work_role_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: work_role_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.work_role_skills_id_seq OWNED BY public.work_role_skills.id;


--
-- Name: work_role_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_role_tasks (
    id integer NOT NULL,
    work_role_id integer NOT NULL,
    task_id integer NOT NULL
);


--
-- Name: work_role_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.work_role_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: work_role_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.work_role_tasks_id_seq OWNED BY public.work_role_tasks.id;


--
-- Name: work_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_roles (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    specialty_area_id integer,
    category_id integer,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: work_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.work_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: work_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.work_roles_id_seq OWNED BY public.work_roles.id;


--
-- Name: career_level_certifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_level_certifications ALTER COLUMN id SET DEFAULT nextval('public.career_level_certifications_id_seq'::regclass);


--
-- Name: career_levels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_levels ALTER COLUMN id SET DEFAULT nextval('public.career_levels_id_seq'::regclass);


--
-- Name: career_positions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_positions ALTER COLUMN id SET DEFAULT nextval('public.career_positions_id_seq'::regclass);


--
-- Name: career_track_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_track_categories ALTER COLUMN id SET DEFAULT nextval('public.career_track_categories_id_seq'::regclass);


--
-- Name: career_tracks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_tracks ALTER COLUMN id SET DEFAULT nextval('public.career_tracks_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: certifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications ALTER COLUMN id SET DEFAULT nextval('public.certifications_id_seq'::regclass);


--
-- Name: import_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_history ALTER COLUMN id SET DEFAULT nextval('public.import_history_id_seq'::regclass);


--
-- Name: knowledge_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_items ALTER COLUMN id SET DEFAULT nextval('public.knowledge_items_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Name: specialty_areas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_areas ALTER COLUMN id SET DEFAULT nextval('public.specialty_areas_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: work_role_certifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_certifications ALTER COLUMN id SET DEFAULT nextval('public.work_role_certifications_id_seq'::regclass);


--
-- Name: work_role_knowledge id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_knowledge ALTER COLUMN id SET DEFAULT nextval('public.work_role_knowledge_id_seq'::regclass);


--
-- Name: work_role_skills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_skills ALTER COLUMN id SET DEFAULT nextval('public.work_role_skills_id_seq'::regclass);


--
-- Name: work_role_tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_tasks ALTER COLUMN id SET DEFAULT nextval('public.work_role_tasks_id_seq'::regclass);


--
-- Name: work_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_roles ALTER COLUMN id SET DEFAULT nextval('public.work_roles_id_seq'::regclass);


--
-- Data for Name: career_level_certifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_level_certifications (id, career_level_id, certification_id, priority, notes, created_at) FROM stdin;
1	1	1	1	Recommended for Entry-Level in SOC Operations	2025-05-30 17:27:03.135878
2	2	3	1	Recommended for Mid-Level in SOC Operations	2025-05-30 17:27:03.459251
3	3	5	3	Recommended for Senior-Level in SOC Operations	2025-05-30 17:27:03.872581
4	5	6	1	Recommended for Executive-Level in SOC Operations	2025-05-30 17:27:04.337671
5	5	25	3	Recommended for Executive-Level in SOC Operations	2025-05-30 17:27:04.485596
6	6	4	1	Recommended for Mid-Level in Red Team Operations	2025-05-30 18:08:13.81207
7	9	25	5	Recommended for Executive-Level in Red Team Operations	2025-05-30 18:08:14.866635
13	10	1	1	Recommended for Entry-Level in Vulnerability Management	2025-05-30 18:51:48.673274
14	11	3	1	Recommended for Mid-Level in Vulnerability Management	2025-05-30 18:51:49.014496
15	11	13	4	Recommended for Mid-Level in Vulnerability Management	2025-05-30 18:51:49.205449
16	12	6	2	Recommended for Senior-Level in Vulnerability Management	2025-05-30 18:51:49.454352
17	12	25	3	Recommended for Senior-Level in Vulnerability Management	2025-05-30 18:51:49.567778
18	12	4	4	Recommended for Senior-Level in Vulnerability Management	2025-05-30 18:51:49.681889
19	14	6	1	Recommended for Executive-Level in Vulnerability Management	2025-05-30 18:51:50.127928
20	14	25	2	Recommended for Executive-Level in Vulnerability Management	2025-05-30 18:51:50.245429
21	15	1	2	Recommended for Entry-Level in Digital Forensics	2025-05-30 19:01:22.760809
22	16	16	1	Recommended for Mid-Level in Digital Forensics	2025-05-30 19:01:23.09376
23	18	11	3	Recommended for Expert-Level in Digital Forensics	2025-05-30 19:01:23.822446
24	19	6	1	Recommended for Executive-Level in Digital Forensics	2025-05-30 19:01:24.081348
25	19	25	2	Recommended for Executive-Level in Digital Forensics	2025-05-30 19:01:24.211238
26	93	1	1	\N	2025-05-31 21:21:12.709275
27	93	13	1	\N	2025-05-31 21:21:12.800482
28	94	3	1	\N	2025-05-31 21:21:12.917292
29	105	1	1	\N	2025-05-31 21:25:29.45554
30	105	2	1	\N	2025-05-31 21:25:29.533738
31	105	13	1	\N	2025-05-31 21:25:29.60991
32	106	1	1	\N	2025-05-31 21:25:29.776005
33	106	2	1	\N	2025-05-31 21:25:29.858794
34	106	13	1	\N	2025-05-31 21:25:29.935261
35	107	3	1	\N	2025-05-31 21:25:30.096783
36	107	5	1	\N	2025-05-31 21:25:30.17271
37	107	10	1	\N	2025-05-31 21:25:30.248326
38	107	13	1	\N	2025-05-31 21:25:30.32312
39	108	3	1	\N	2025-05-31 21:25:30.478445
40	108	5	1	\N	2025-05-31 21:25:30.557167
41	108	10	1	\N	2025-05-31 21:25:30.632641
42	108	13	1	\N	2025-05-31 21:25:30.708109
43	109	9	1	\N	2025-05-31 21:25:30.880605
44	110	9	1	\N	2025-05-31 21:25:31.044818
45	110	23	1	\N	2025-05-31 21:25:31.125552
46	111	9	1	\N	2025-05-31 21:25:31.433718
47	112	1	1	\N	2025-05-31 21:27:23.182501
48	112	23	1	\N	2025-05-31 21:27:23.285113
49	116	25	1	\N	2025-05-31 21:27:23.748694
50	116	8	1	\N	2025-05-31 21:27:23.831523
51	117	1	1	\N	2025-05-31 21:33:46.679111
52	117	23	1	\N	2025-05-31 21:33:46.766529
53	118	23	1	\N	2025-05-31 21:33:46.92358
54	118	3	1	\N	2025-05-31 21:33:47.011939
55	119	23	1	\N	2025-05-31 21:33:47.175205
56	120	8	1	\N	2025-05-31 21:33:47.344228
57	120	23	1	\N	2025-05-31 21:33:47.423853
58	121	9	1	\N	2025-05-31 21:33:47.581923
59	122	1	1	\N	2025-05-31 21:35:54.017085
60	122	22	1	\N	2025-05-31 21:35:54.096465
61	123	22	1	\N	2025-05-31 21:35:54.246661
62	123	3	1	\N	2025-05-31 21:35:54.321414
63	124	22	1	\N	2025-05-31 21:35:54.469948
64	124	23	1	\N	2025-05-31 21:35:54.54426
65	125	9	1	\N	2025-05-31 21:35:54.69318
66	126	25	1	\N	2025-05-31 21:35:54.868421
67	127	1	1	\N	2025-05-31 21:38:47.84444
68	128	17	1	\N	2025-05-31 21:38:47.998762
69	128	3	1	\N	2025-05-31 21:38:48.074419
70	129	17	1	\N	2025-05-31 21:38:48.232261
71	130	9	1	\N	2025-05-31 21:38:48.382238
72	130	17	1	\N	2025-05-31 21:38:48.461339
73	132	1	1	\N	2025-05-31 21:40:22.44506
74	132	17	1	\N	2025-05-31 21:40:22.543216
75	133	17	1	\N	2025-05-31 21:40:22.695625
76	133	3	1	\N	2025-05-31 21:40:22.776224
77	134	17	1	\N	2025-05-31 21:40:22.934939
78	134	9	1	\N	2025-05-31 21:40:23.01289
79	135	11	1	\N	2025-05-31 21:40:23.17568
80	135	17	1	\N	2025-05-31 21:40:23.250694
81	135	9	1	\N	2025-05-31 21:40:23.323996
82	136	25	1	\N	2025-05-31 21:40:23.477142
83	136	9	1	\N	2025-05-31 21:40:23.554419
89	142	25	1	\N	2025-05-31 21:43:22.0091
90	142	9	1	\N	2025-05-31 21:43:22.091406
91	142	26	1	\N	2025-05-31 21:43:22.174922
92	143	9	1	\N	2025-05-31 21:43:22.330618
93	146	1	1	\N	2025-05-31 21:46:42.958359
94	147	25	1	\N	2025-05-31 21:46:43.115487
95	150	1	1	\N	2025-05-31 21:48:02.314164
96	151	17	1	\N	2025-05-31 21:48:02.511231
97	151	10	1	\N	2025-05-31 21:48:02.599204
98	151	23	1	\N	2025-05-31 21:48:02.703309
99	152	17	1	\N	2025-05-31 21:48:02.872867
100	152	9	1	\N	2025-05-31 21:48:03.003914
101	153	17	1	\N	2025-05-31 21:48:03.16738
102	153	23	1	\N	2025-05-31 21:48:03.24846
103	154	9	1	\N	2025-05-31 21:48:03.408203
104	155	1	1	\N	2025-05-31 21:50:08.905274
105	156	17	1	\N	2025-05-31 21:50:09.055162
106	156	3	1	\N	2025-05-31 21:50:09.12725
107	156	23	1	\N	2025-05-31 21:50:09.199364
108	157	17	1	\N	2025-05-31 21:50:09.345982
109	158	9	1	\N	2025-05-31 21:50:09.493133
110	160	1	1	\N	2025-05-31 21:57:49.502804
111	161	3	1	\N	2025-05-31 21:57:49.667969
112	161	10	1	\N	2025-05-31 21:57:49.752143
113	161	9	1	\N	2025-05-31 21:57:49.834123
114	162	23	1	\N	2025-05-31 21:57:50.003293
115	162	9	1	\N	2025-05-31 21:57:50.094037
116	163	9	1	\N	2025-05-31 21:57:50.289053
117	163	17	1	\N	2025-05-31 21:57:50.366731
118	163	25	1	\N	2025-05-31 21:57:50.443022
119	165	1	1	\N	2025-05-31 22:01:31.928446
120	165	3	1	\N	2025-05-31 22:01:32.026686
121	166	17	1	\N	2025-05-31 22:01:32.199043
122	166	3	1	\N	2025-05-31 22:01:32.275398
123	167	17	1	\N	2025-05-31 22:01:32.436487
124	167	10	1	\N	2025-05-31 22:01:32.518444
125	168	9	1	\N	2025-05-31 22:01:32.68224
126	168	17	1	\N	2025-05-31 22:01:32.7669
127	169	9	1	\N	2025-05-31 22:01:32.948404
128	170	1	1	\N	2025-05-31 22:02:57.298606
129	171	9	1	\N	2025-05-31 22:02:57.479715
130	172	9	1	\N	2025-05-31 22:02:57.653527
131	173	9	1	\N	2025-05-31 22:02:57.852968
132	6	36	5	Recommended for Mid-Level in Red Team Operations	2025-05-31 22:48:53.776324
133	7	33	2	Recommended for Senior-Level in Red Team Operations	2025-05-31 22:48:54.018696
134	7	38	3	Recommended for Senior-Level in Red Team Operations	2025-05-31 22:48:54.127129
135	7	36	4	Recommended for Senior-Level in Red Team Operations	2025-05-31 22:48:54.264289
136	8	39	1	Recommended for Expert-Level in Red Team Operations	2025-05-31 22:48:54.444195
137	8	40	2	Recommended for Expert-Level in Red Team Operations	2025-05-31 22:48:54.555664
138	8	41	3	Recommended for Expert-Level in Red Team Operations	2025-05-31 22:48:54.663558
139	8	32	5	Recommended for Expert-Level in Red Team Operations	2025-05-31 22:48:54.807104
140	9	42	1	Recommended for Executive-Level in Red Team Operations	2025-05-31 22:48:54.986387
141	9	43	2	Recommended for Executive-Level in Red Team Operations	2025-05-31 22:48:55.09791
142	121	42	1	\N	2025-05-31 23:17:25.57295
143	163	43	1	\N	2025-05-31 23:17:28.677992
144	164	42	1	\N	2025-05-31 23:17:28.840347
145	132	43	1	\N	2025-05-31 23:17:31.1811
146	133	43	1	\N	2025-05-31 23:17:31.289773
147	134	43	1	\N	2025-05-31 23:17:31.434155
148	135	43	1	\N	2025-05-31 23:17:31.633625
149	136	42	1	\N	2025-05-31 23:17:31.783058
150	1	68	2	Recommended for Entry-Level in SOC Operations	2025-05-31 23:18:37.23823
151	1	69	3	Recommended for Entry-Level in SOC Operations	2025-05-31 23:18:37.352597
152	1	70	4	Recommended for Entry-Level in SOC Operations	2025-05-31 23:18:37.46693
153	2	71	2	Recommended for Mid-Level in SOC Operations	2025-05-31 23:18:37.732524
154	2	72	3	Recommended for Mid-Level in SOC Operations	2025-05-31 23:18:37.853109
155	2	73	4	Recommended for Mid-Level in SOC Operations	2025-05-31 23:18:37.962957
156	3	74	1	Recommended for Senior-Level in SOC Operations	2025-05-31 23:18:38.152631
157	3	75	2	Recommended for Senior-Level in SOC Operations	2025-05-31 23:18:38.262129
158	3	76	4	Recommended for Senior-Level in SOC Operations	2025-05-31 23:18:38.44555
159	4	42	1	Recommended for Expert-Level in SOC Operations	2025-05-31 23:18:38.642068
160	4	77	2	Recommended for Expert-Level in SOC Operations	2025-05-31 23:18:38.751682
161	4	78	3	Recommended for Expert-Level in SOC Operations	2025-05-31 23:18:38.862619
162	5	42	2	Recommended for Executive-Level in SOC Operations	2025-05-31 23:18:39.11806
163	5	79	4	Recommended for Executive-Level in SOC Operations	2025-05-31 23:18:39.299279
164	10	68	2	Recommended for Entry-Level in Vulnerability Management	2025-05-31 23:18:48.01644
165	10	69	3	Recommended for Entry-Level in Vulnerability Management	2025-05-31 23:18:48.163059
166	11	80	2	Recommended for Mid-Level in Vulnerability Management	2025-05-31 23:18:48.501676
167	11	83	3	Recommended for Mid-Level in Vulnerability Management	2025-05-31 23:18:48.619176
168	11	124	4	Recommended for Mid-Level in Vulnerability Management	2025-05-31 23:18:48.741455
169	13	87	3	Recommended for Expert-Level in Vulnerability Management	2025-05-31 23:18:49.402401
170	14	78	1	Recommended for Executive-Level in Vulnerability Management	2025-05-31 23:18:49.684073
171	14	26	2	Recommended for Executive-Level in Vulnerability Management	2025-05-31 23:18:49.804694
172	14	42	3	Recommended for Executive-Level in Vulnerability Management	2025-05-31 23:18:49.920863
173	15	94	1	Recommended for Entry-Level in Digital Forensics	2025-05-31 23:18:53.396923
174	15	96	4	Recommended for Entry-Level in Digital Forensics	2025-05-31 23:18:53.737048
175	16	98	2	Recommended for Mid-Level in Digital Forensics	2025-05-31 23:18:54.008164
176	16	99	3	Recommended for Mid-Level in Digital Forensics	2025-05-31 23:18:54.117808
177	16	102	4	Recommended for Mid-Level in Digital Forensics	2025-05-31 23:18:54.228442
178	17	104	2	Recommended for Senior-Level in Digital Forensics	2025-05-31 23:18:54.452884
179	17	105	3	Recommended for Senior-Level in Digital Forensics	2025-05-31 23:18:54.56528
180	93	130	1	\N	2025-05-31 23:22:12.068177
181	93	96	1	\N	2025-05-31 23:22:12.150724
182	93	114	1	\N	2025-05-31 23:22:12.263223
183	94	115	1	\N	2025-05-31 23:22:12.411048
184	95	86	1	\N	2025-05-31 23:22:12.522069
185	95	116	1	\N	2025-05-31 23:22:12.600097
186	95	118	1	\N	2025-05-31 23:22:12.694826
187	96	119	1	\N	2025-05-31 23:22:12.806891
188	96	86	1	\N	2025-05-31 23:22:12.881145
189	96	121	1	\N	2025-05-31 23:22:12.95517
190	97	110	1	\N	2025-05-31 23:22:13.061647
191	97	119	1	\N	2025-05-31 23:22:13.134094
192	97	123	1	\N	2025-05-31 23:22:13.205789
193	117	133	1	\N	2025-05-31 23:22:18.819937
194	117	130	1	\N	2025-05-31 23:22:18.891735
195	118	133	1	\N	2025-05-31 23:22:19.001328
196	118	124	1	\N	2025-05-31 23:22:19.073382
197	119	134	1	\N	2025-05-31 23:22:19.219114
198	119	133	1	\N	2025-05-31 23:22:19.290426
199	119	127	1	\N	2025-05-31 23:22:19.362694
200	120	134	1	\N	2025-05-31 23:22:19.470609
201	120	133	1	\N	2025-05-31 23:22:19.541743
202	120	130	1	\N	2025-05-31 23:22:19.613149
203	121	110	1	\N	2025-05-31 23:22:19.720779
204	121	136	1	\N	2025-05-31 23:22:19.792298
205	121	134	1	\N	2025-05-31 23:22:19.863765
206	121	130	1	\N	2025-05-31 23:22:19.942705
207	105	130	1	\N	2025-05-31 23:22:27.843463
208	105	124	1	\N	2025-05-31 23:22:27.95947
209	106	130	1	\N	2025-05-31 23:22:28.16347
210	106	124	1	\N	2025-05-31 23:22:28.281962
211	107	125	1	\N	2025-05-31 23:22:28.469231
212	107	126	1	\N	2025-05-31 23:22:28.555901
213	107	127	1	\N	2025-05-31 23:22:28.635128
214	108	125	1	\N	2025-05-31 23:22:28.820913
215	108	126	1	\N	2025-05-31 23:22:28.899712
216	108	127	1	\N	2025-05-31 23:22:28.974416
217	109	134	1	\N	2025-05-31 23:22:29.096379
218	109	129	1	\N	2025-05-31 23:22:29.176652
219	109	130	1	\N	2025-05-31 23:22:29.251253
220	110	131	1	\N	2025-05-31 23:22:29.375796
221	110	132	1	\N	2025-05-31 23:22:29.473893
222	110	133	1	\N	2025-05-31 23:22:29.563075
223	110	134	1	\N	2025-05-31 23:22:29.640416
224	111	134	1	\N	2025-05-31 23:22:29.783614
225	111	110	1	\N	2025-05-31 23:22:29.861655
226	111	136	1	\N	2025-05-31 23:22:29.94114
227	111	137	1	\N	2025-05-31 23:22:30.017374
228	127	130	1	\N	2025-05-31 23:22:35.754314
229	127	96	1	\N	2025-05-31 23:22:35.877811
230	128	143	1	\N	2025-05-31 23:22:36.003861
231	129	143	1	\N	2025-05-31 23:22:36.348152
232	130	134	1	\N	2025-05-31 23:22:36.486647
233	130	143	1	\N	2025-05-31 23:22:36.570567
234	130	129	1	\N	2025-05-31 23:22:36.651224
235	131	110	1	\N	2025-05-31 23:22:36.771472
236	131	130	1	\N	2025-05-31 23:22:36.852177
237	122	96	1	\N	2025-05-31 23:22:42.405145
238	122	130	1	\N	2025-05-31 23:22:42.478666
239	123	130	1	\N	2025-05-31 23:22:42.596555
240	124	130	1	\N	2025-05-31 23:22:42.741623
241	124	133	1	\N	2025-05-31 23:22:42.813442
242	125	134	1	\N	2025-05-31 23:22:42.921547
243	125	129	1	\N	2025-05-31 23:22:42.994439
244	126	110	1	\N	2025-05-31 23:22:43.101713
245	126	86	1	\N	2025-05-31 23:22:43.175094
246	170	130	1	\N	2025-05-31 23:22:48.517402
247	171	134	1	\N	2025-05-31 23:22:48.661889
248	171	115	1	\N	2025-05-31 23:22:48.733657
249	172	134	1	\N	2025-05-31 23:22:48.840746
250	173	116	1	\N	2025-05-31 23:22:48.948649
251	173	134	1	\N	2025-05-31 23:22:49.018774
252	173	136	1	\N	2025-05-31 23:22:49.089227
253	173	65	1	\N	2025-05-31 23:22:49.158938
254	174	110	1	\N	2025-05-31 23:22:49.270133
255	174	136	1	\N	2025-05-31 23:22:49.432004
256	145	130	1	\N	2025-05-31 23:22:54.728607
257	146	114	1	\N	2025-05-31 23:22:54.895947
258	147	86	1	\N	2025-05-31 23:22:55.017306
259	148	136	1	\N	2025-05-31 23:22:55.140854
260	149	110	1	\N	2025-05-31 23:22:55.265205
261	149	136	1	\N	2025-05-31 23:22:55.342027
262	149	65	1	\N	2025-05-31 23:22:55.420909
263	155	96	1	\N	2025-05-31 23:23:00.968085
264	156	143	1	\N	2025-05-31 23:23:01.07993
265	156	133	1	\N	2025-05-31 23:23:01.195749
266	157	143	1	\N	2025-05-31 23:23:01.308131
267	157	124	1	\N	2025-05-31 23:23:01.382636
268	158	130	1	\N	2025-05-31 23:23:01.500159
269	158	129	1	\N	2025-05-31 23:23:01.573478
270	158	134	1	\N	2025-05-31 23:23:01.651796
271	159	110	1	\N	2025-05-31 23:23:01.771566
272	159	136	1	\N	2025-05-31 23:23:01.850245
273	159	130	1	\N	2025-05-31 23:23:01.927195
274	160	96	1	\N	2025-05-31 23:23:27.492866
275	160	130	1	\N	2025-05-31 23:23:27.568946
276	161	125	1	\N	2025-05-31 23:23:27.725331
277	161	130	1	\N	2025-05-31 23:23:27.802933
278	161	134	1	\N	2025-05-31 23:23:27.874969
279	162	133	1	\N	2025-05-31 23:23:27.986519
280	162	134	1	\N	2025-05-31 23:23:28.059219
281	163	131	1	\N	2025-05-31 23:23:28.210988
282	163	143	1	\N	2025-05-31 23:23:28.281915
283	163	86	1	\N	2025-05-31 23:23:28.35574
284	164	110	1	\N	2025-05-31 23:23:28.466958
285	164	136	1	\N	2025-05-31 23:23:28.542196
286	164	130	1	\N	2025-05-31 23:23:28.614258
287	142	86	1	\N	2025-05-31 23:23:31.343155
288	142	134	1	\N	2025-05-31 23:23:31.427928
289	142	115	1	\N	2025-05-31 23:23:31.550715
290	143	110	1	\N	2025-05-31 23:23:31.676491
291	143	136	1	\N	2025-05-31 23:23:31.762875
292	143	134	1	\N	2025-05-31 23:23:31.841475
293	143	130	1	\N	2025-05-31 23:23:31.914494
294	144	110	1	\N	2025-05-31 23:23:32.031859
295	144	136	1	\N	2025-05-31 23:23:32.113196
296	144	65	1	\N	2025-05-31 23:23:32.191106
297	144	134	1	\N	2025-05-31 23:23:32.302193
298	112	133	1	\N	2025-05-31 23:54:07.672033
299	112	140	1	\N	2025-05-31 23:54:07.756361
300	112	141	1	\N	2025-05-31 23:54:07.829277
301	113	143	1	\N	2025-05-31 23:54:07.944832
302	116	110	1	\N	2025-05-31 23:54:08.138018
303	116	86	1	\N	2025-05-31 23:54:08.219967
304	112	152	1	\N	2025-05-31 23:54:24.774814
305	112	153	1	\N	2025-05-31 23:54:24.852934
306	113	154	1	\N	2025-05-31 23:54:24.96465
307	113	151	1	\N	2025-05-31 23:54:25.040439
308	114	145	1	\N	2025-05-31 23:54:25.157458
309	114	146	1	\N	2025-05-31 23:54:25.232099
310	114	148	1	\N	2025-05-31 23:54:25.305327
311	115	145	1	\N	2025-05-31 23:54:25.416344
312	115	146	1	\N	2025-05-31 23:54:25.491333
313	115	150	1	\N	2025-05-31 23:54:25.566793
314	122	155	1	\N	2025-05-31 23:55:53.431029
315	123	156	1	\N	2025-05-31 23:55:53.639369
316	124	158	1	\N	2025-05-31 23:55:53.827342
317	124	159	1	\N	2025-05-31 23:55:53.94466
318	124	160	1	\N	2025-05-31 23:55:54.019864
319	125	161	1	\N	2025-05-31 23:55:54.186114
320	125	162	1	\N	2025-05-31 23:55:54.261397
321	126	163	1	\N	2025-05-31 23:55:54.513055
322	127	164	1	\N	2025-06-01 00:00:48.317427
323	128	171	1	\N	2025-06-01 00:00:48.547735
324	128	166	1	\N	2025-06-01 00:00:48.665174
325	128	167	1	\N	2025-06-01 00:00:48.743051
326	129	165	1	\N	2025-06-01 00:00:48.873967
327	129	171	1	\N	2025-06-01 00:00:48.957667
328	129	169	1	\N	2025-06-01 00:00:49.062121
329	129	170	1	\N	2025-06-01 00:00:49.159999
330	130	171	1	\N	2025-06-01 00:00:49.340932
331	131	172	1	\N	2025-06-01 00:00:49.56094
332	131	173	1	\N	2025-06-01 00:00:49.645438
340	40	96	1	\N	2025-06-01 00:04:05.88567
341	40	155	2	\N	2025-06-01 00:04:05.88567
342	41	22	1	\N	2025-06-01 00:04:05.88567
343	41	156	2	\N	2025-06-01 00:04:05.88567
344	41	157	3	\N	2025-06-01 00:04:05.88567
345	42	158	1	\N	2025-06-01 00:04:05.88567
346	42	159	2	\N	2025-06-01 00:04:05.88567
347	43	161	1	\N	2025-06-01 00:04:05.88567
348	43	162	2	\N	2025-06-01 00:04:05.88567
349	44	25	1	\N	2025-06-01 00:04:05.88567
350	44	119	2	\N	2025-06-01 00:04:05.88567
351	45	164	1	\N	2025-06-01 00:04:18.740614
352	45	96	2	\N	2025-06-01 00:04:18.740614
353	46	165	1	\N	2025-06-01 00:04:18.740614
354	46	166	2	\N	2025-06-01 00:04:18.740614
355	47	168	1	\N	2025-06-01 00:04:18.740614
356	47	169	2	\N	2025-06-01 00:04:18.740614
357	47	170	3	\N	2025-06-01 00:04:18.740614
358	48	171	1	\N	2025-06-01 00:04:18.740614
359	49	172	1	\N	2025-06-01 00:04:18.740614
383	55	1	1	\N	2025-06-01 00:15:34.364086
384	55	130	1	\N	2025-06-01 00:15:34.364086
385	55	174	1	\N	2025-06-01 00:15:34.364086
386	55	176	1	\N	2025-06-01 00:15:34.364086
387	56	9	1	\N	2025-06-01 00:15:34.364086
388	56	134	1	\N	2025-06-01 00:15:34.364086
389	56	125	1	\N	2025-06-01 00:15:34.364086
390	56	76	1	\N	2025-06-01 00:15:34.364086
391	56	174	1	\N	2025-06-01 00:15:34.364086
392	56	177	1	\N	2025-06-01 00:15:34.364086
393	56	178	1	\N	2025-06-01 00:15:34.364086
394	57	9	1	\N	2025-06-01 00:15:34.364086
395	57	5	1	\N	2025-06-01 00:15:34.364086
396	57	134	1	\N	2025-06-01 00:15:34.364086
397	57	179	1	\N	2025-06-01 00:15:34.364086
398	57	180	1	\N	2025-06-01 00:15:34.364086
399	57	181	1	\N	2025-06-01 00:15:34.364086
400	58	9	1	\N	2025-06-01 00:15:34.364086
401	58	134	1	\N	2025-06-01 00:15:34.364086
402	58	76	1	\N	2025-06-01 00:15:34.364086
403	58	179	1	\N	2025-06-01 00:15:34.364086
404	58	178	1	\N	2025-06-01 00:15:34.364086
405	58	183	1	\N	2025-06-01 00:15:34.364086
406	59	110	1	\N	2025-06-01 00:15:34.364086
407	59	136	1	\N	2025-06-01 00:15:34.364086
408	59	65	1	\N	2025-06-01 00:15:34.364086
409	59	185	1	\N	2025-06-01 00:15:34.364086
410	59	184	1	\N	2025-06-01 00:15:34.364086
411	142	179	1	\N	2025-06-01 00:17:03.655807
412	60	25	1	\N	2025-06-01 00:17:59.490368
413	60	9	1	\N	2025-06-01 00:17:59.490368
414	60	26	1	\N	2025-06-01 00:17:59.490368
415	60	86	1	\N	2025-06-01 00:17:59.490368
416	60	134	1	\N	2025-06-01 00:17:59.490368
417	60	115	1	\N	2025-06-01 00:17:59.490368
418	60	179	1	\N	2025-06-01 00:17:59.490368
419	61	9	1	\N	2025-06-01 00:17:59.490368
420	61	110	1	\N	2025-06-01 00:17:59.490368
421	61	136	1	\N	2025-06-01 00:17:59.490368
422	61	134	1	\N	2025-06-01 00:17:59.490368
423	61	130	1	\N	2025-06-01 00:17:59.490368
424	62	110	1	\N	2025-06-01 00:17:59.490368
425	62	136	1	\N	2025-06-01 00:17:59.490368
426	62	65	1	\N	2025-06-01 00:17:59.490368
427	62	134	1	\N	2025-06-01 00:17:59.490368
428	146	179	1	\N	2025-06-01 00:19:06.770646
429	147	182	1	\N	2025-06-01 00:19:06.969721
430	147	179	1	\N	2025-06-01 00:19:07.045883
431	148	182	1	\N	2025-06-01 00:19:07.202798
432	145	186	1	\N	2025-06-01 00:19:37.500788
433	145	187	1	\N	2025-06-01 00:19:37.582962
434	145	188	1	\N	2025-06-01 00:19:37.672891
435	146	189	1	\N	2025-06-01 00:19:37.860636
436	146	190	1	\N	2025-06-01 00:19:38.012303
437	147	192	1	\N	2025-06-01 00:19:38.248199
438	148	193	1	\N	2025-06-01 00:19:38.367232
439	148	194	1	\N	2025-06-01 00:19:38.519619
440	149	195	1	\N	2025-06-01 00:19:38.755573
441	63	130	1	\N	2025-06-01 00:19:57.526923
442	63	186	1	\N	2025-06-01 00:19:57.526923
443	63	187	1	\N	2025-06-01 00:19:57.526923
444	63	188	1	\N	2025-06-01 00:19:57.526923
445	64	1	1	\N	2025-06-01 00:19:57.526923
446	64	114	1	\N	2025-06-01 00:19:57.526923
447	64	179	1	\N	2025-06-01 00:19:57.526923
448	64	189	1	\N	2025-06-01 00:19:57.526923
449	64	190	1	\N	2025-06-01 00:19:57.526923
450	65	25	1	\N	2025-06-01 00:19:57.526923
451	65	86	1	\N	2025-06-01 00:19:57.526923
452	65	182	1	\N	2025-06-01 00:19:57.526923
453	65	179	1	\N	2025-06-01 00:19:57.526923
454	65	192	1	\N	2025-06-01 00:19:57.526923
455	66	136	1	\N	2025-06-01 00:19:57.526923
456	66	182	1	\N	2025-06-01 00:19:57.526923
457	66	193	1	\N	2025-06-01 00:19:57.526923
458	66	194	1	\N	2025-06-01 00:19:57.526923
459	67	110	1	\N	2025-06-01 00:19:57.526923
460	67	136	1	\N	2025-06-01 00:19:57.526923
461	67	65	1	\N	2025-06-01 00:19:57.526923
462	67	195	1	\N	2025-06-01 00:19:57.526923
\.


--
-- Data for Name: career_levels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_levels (id, career_track_id, name, experience_range, description, sort_order, created_at) FROM stdin;
1	31	Entry-Level	\N	Entry-Level positions in SOC Operations	1	2025-05-29 16:58:03.278812
2	31	Mid-Level	\N	Mid-Level positions in SOC Operations	2	2025-05-29 16:58:03.3818
3	31	Senior-Level	\N	Senior-Level positions in SOC Operations	3	2025-05-29 16:58:03.47127
4	31	Expert-Level	\N	Expert-Level positions in SOC Operations	4	2025-05-29 16:58:03.563359
5	31	Executive-Level	\N	Executive-Level positions in SOC Operations	5	2025-05-29 16:58:03.65098
6	4	Mid-Level	\N	Mid-Level positions in Red Team Operations	2	2025-05-29 16:59:58.596512
7	4	Senior-Level	\N	Senior-Level positions in Red Team Operations	3	2025-05-29 16:59:58.596512
8	4	Expert-Level	\N	Expert-Level positions in Red Team Operations	4	2025-05-29 16:59:58.596512
9	4	Executive-Level	\N	Executive-Level positions in Red Team Operations	5	2025-05-29 16:59:58.596512
10	5	Entry-Level	\N	Entry-Level positions in Vulnerability Management	1	2025-05-29 17:01:08.731923
11	5	Mid-Level	\N	Mid-Level positions in Vulnerability Management	2	2025-05-29 17:01:08.731923
12	5	Senior-Level	\N	Senior-Level positions in Vulnerability Management	3	2025-05-29 17:01:08.731923
13	5	Expert-Level	\N	Expert-Level positions in Vulnerability Management	4	2025-05-29 17:01:08.731923
14	5	Executive-Level	\N	Executive-Level positions in Vulnerability Management	5	2025-05-29 17:01:08.731923
15	6	Entry-Level	\N	Entry-Level positions in Digital Forensics	1	2025-05-29 17:03:10.730952
16	6	Mid-Level	\N	Mid-Level positions in Digital Forensics	2	2025-05-29 17:03:10.730952
17	6	Senior-Level	\N	Senior-Level positions in Digital Forensics	3	2025-05-29 17:03:10.730952
18	6	Expert-Level	\N	Expert-Level positions in Digital Forensics	4	2025-05-29 17:03:10.730952
19	6	Executive-Level	\N	Executive-Level positions in Digital Forensics	5	2025-05-29 17:03:10.730952
20	8	Entry-Level	\N	Entry-Level positions in GRC	1	2025-05-29 17:07:57.194109
21	8	Mid-Level	\N	Mid-Level positions in GRC	2	2025-05-29 17:07:57.194109
22	8	Senior-Level	\N	Senior-Level positions in GRC	3	2025-05-29 17:07:57.194109
23	8	Expert-Level	\N	Expert-Level positions in GRC	4	2025-05-29 17:07:57.194109
24	8	Executive-Level	\N	Executive-Level positions in GRC	5	2025-05-29 17:07:57.194109
25	35	Entry-Level	\N	Entry-Level positions in Cybersecurity Architecture & Engineering	1	2025-05-29 17:09:45.118518
26	35	Mid-Level	\N	Mid-Level positions in Cybersecurity Architecture & Engineering	2	2025-05-29 17:09:45.118518
27	35	Senior-Level	\N	Senior-Level positions in Cybersecurity Architecture & Engineering	3	2025-05-29 17:09:45.118518
28	35	Expert-Level	\N	Expert-Level positions in Cybersecurity Architecture & Engineering	4	2025-05-29 17:09:45.118518
29	35	Executive-Level	\N	Executive-Level positions in Cybersecurity Architecture & Engineering	5	2025-05-29 17:09:45.118518
30	14	Entry-Level	\N	Entry-Level positions in Secure Software Development	1	2025-05-29 17:11:20.942345
31	14	Mid-Level	\N	Mid-Level positions in Secure Software Development	2	2025-05-29 17:11:20.942345
32	14	Senior-Level	\N	Senior-Level positions in Secure Software Development	3	2025-05-29 17:11:20.942345
33	14	Expert-Level	\N	Expert-Level positions in Secure Software Development	4	2025-05-29 17:11:20.942345
34	14	Executive-Level	\N	Executive-Level positions in Secure Software Development	5	2025-05-29 17:11:20.942345
35	37	Entry-Level	\N	Entry-Level positions in Cloud and Infrastructure Security	1	2025-05-29 17:12:43.530092
36	37	Mid-Level	\N	Mid-Level positions in Cloud and Infrastructure Security	2	2025-05-29 17:12:43.530092
37	37	Senior-Level	\N	Senior-Level positions in Cloud and Infrastructure Security	3	2025-05-29 17:12:43.530092
38	37	Expert-Level	\N	Expert-Level positions in Cloud and Infrastructure Security	4	2025-05-29 17:12:43.530092
39	37	Executive-Level	\N	Executive-Level positions in Cloud and Infrastructure Security	5	2025-05-29 17:12:43.530092
40	38	Entry-Level	\N	Entry-Level positions in Identity and Access Management	1	2025-05-29 17:17:26.791628
41	38	Mid-Level	\N	Mid-Level positions in Identity and Access Management	2	2025-05-29 17:17:26.791628
42	38	Senior-Level	\N	Senior-Level positions in Identity and Access Management	3	2025-05-29 17:17:26.791628
43	38	Expert-Level	\N	Expert-Level positions in Identity and Access Management	4	2025-05-29 17:17:26.791628
44	38	Executive-Level	\N	Executive-Level positions in Identity and Access Management	5	2025-05-29 17:17:26.791628
45	39	Entry-Level	\N	Entry-Level positions in OT Security	1	2025-05-29 17:21:53.538204
46	39	Mid-Level	\N	Mid-Level positions in OT Security	2	2025-05-29 17:21:53.538204
47	39	Senior-Level	\N	Senior-Level positions in OT Security	3	2025-05-29 17:21:53.538204
48	39	Expert-Level	\N	Expert-Level positions in OT Security	4	2025-05-29 17:21:53.538204
49	39	Executive-Level	\N	Executive-Level positions in OT Security	5	2025-05-29 17:21:53.538204
50	22	Entry-Level	\N	Entry-Level positions in Cybercrime Investigation	1	2025-05-29 17:24:09.20278
51	22	Mid-Level	\N	Mid-Level positions in Cybercrime Investigation	2	2025-05-29 17:24:09.20278
52	22	Senior-Level	\N	Senior-Level positions in Cybercrime Investigation	3	2025-05-29 17:24:09.20278
53	22	Expert-Level	\N	Expert-Level positions in Cybercrime Investigation	4	2025-05-29 17:24:09.20278
54	22	Executive-Level	\N	Executive-Level positions in Cybercrime Investigation	5	2025-05-29 17:24:09.20278
55	41	Entry-Level	\N	Entry-Level positions in Cybersecurity Education & Training	1	2025-05-29 17:27:12.027308
56	41	Mid-Level	\N	Mid-Level positions in Cybersecurity Education & Training	2	2025-05-29 17:27:12.027308
57	41	Senior-Level	\N	Senior-Level positions in Cybersecurity Education & Training	3	2025-05-29 17:27:12.027308
58	41	Expert-Level	\N	Expert-Level positions in Cybersecurity Education & Training	4	2025-05-29 17:27:12.027308
59	41	Executive-Level	\N	Executive-Level positions in Cybersecurity Education & Training	5	2025-05-29 17:27:12.027308
60	42	Senior-Level	\N	Senior-Level positions in Executive Leadership CISO Track	3	2025-05-29 17:28:28.494499
61	42	Expert-Level	\N	Expert-Level positions in Executive Leadership CISO Track	4	2025-05-29 17:28:28.494499
62	42	Executive-Level	\N	Executive-Level positions in Executive Leadership CISO Track	5	2025-05-29 17:28:28.494499
63	43	Entry-Level	\N	Entry-Level positions in Program and Project Management	1	2025-05-29 17:30:27.051426
64	43	Mid-Level	\N	Mid-Level positions in Program and Project Management	2	2025-05-29 17:30:27.051426
65	43	Senior-Level	\N	Senior-Level positions in Program and Project Management	3	2025-05-29 17:30:27.051426
66	43	Expert-Level	\N	Expert-Level positions in Program and Project Management	4	2025-05-29 17:30:27.051426
67	43	Executive-Level	\N	Executive-Level positions in Program and Project Management	5	2025-05-29 17:30:27.051426
68	44	Entry-Level	\N	Entry-Level positions in Technology Research and Tool Development	1	2025-05-29 17:31:35.652608
69	44	Mid-Level	\N	Mid-Level positions in Technology Research and Tool Development	2	2025-05-29 17:31:35.652608
70	44	Senior-Level	\N	Senior-Level positions in Technology Research and Tool Development	3	2025-05-29 17:31:35.652608
71	44	Expert-Level	\N	Expert-Level positions in Technology Research and Tool Development	4	2025-05-29 17:31:35.652608
72	44	Executive-Level	\N	Executive-Level positions in Technology Research and Tool Development	5	2025-05-29 17:31:35.652608
73	45	Entry-Level	\N	Entry-Level positions in Security Automation and Orchestration	1	2025-05-29 17:34:01.107993
74	45	Mid-Level	\N	Mid-Level positions in Security Automation and Orchestration	2	2025-05-29 17:34:01.107993
75	45	Senior-Level	\N	Senior-Level positions in Security Automation and Orchestration	3	2025-05-29 17:34:01.107993
76	45	Expert-Level	\N	Expert-Level positions in Security Automation and Orchestration	4	2025-05-29 17:34:01.107993
77	45	Executive-Level	\N	Executive-Level positions in Security Automation and Orchestration	5	2025-05-29 17:34:01.107993
78	46	Entry-Level	\N	Entry-Level positions in Customer Facing Security Roles	1	2025-05-29 17:43:58.357151
79	46	Mid-Level	\N	Mid-Level positions in Customer Facing Security Roles	2	2025-05-29 17:43:58.357151
80	46	Senior-Level	\N	Senior-Level positions in Customer Facing Security Roles	3	2025-05-29 17:43:58.357151
81	46	Expert-Level	\N	Expert-Level positions in Customer Facing Security Roles	4	2025-05-29 17:43:58.357151
82	46	Executive-Level	\N	Executive-Level positions in Customer Facing Security Roles	5	2025-05-29 17:43:58.357151
83	2	Entry-Level	\N	Entry-Level positions in Threat Intelligence	1	2025-05-29 17:50:10.927806
84	2	Mid-Level	\N	Mid-Level positions in Threat Intelligence	2	2025-05-29 17:50:10.927806
85	2	Senior-Level	\N	Senior-Level positions in Threat Intelligence	3	2025-05-29 17:50:10.927806
86	2	Expert-Level	\N	Expert-Level positions in Threat Intelligence	4	2025-05-29 17:50:10.927806
87	2	Executive-Level	\N	Executive-Level positions in Threat Intelligence	5	2025-05-29 17:50:10.927806
88	48	Entry-Level	\N	Entry-Level positions in Privacy Policy Legal Affairs	1	2025-05-29 17:52:27.81442
89	48	Mid-Level	\N	Mid-Level positions in Privacy Policy Legal Affairs	2	2025-05-29 17:52:27.81442
90	48	Senior-Level	\N	Senior-Level positions in Privacy Policy Legal Affairs	3	2025-05-29 17:52:27.81442
91	48	Expert-Level	\N	Expert-Level positions in Privacy Policy Legal Affairs	4	2025-05-29 17:52:27.81442
92	48	Executive-Level	\N	Executive-Level positions in Privacy Policy Legal Affairs	5	2025-05-29 17:52:27.81442
93	8	IT Auditor / Compliance Analyst	\N	Performs basic compliance assessments and supports audits. Familiar with industry standards (e.g., NIST, ISO).	0	2025-05-31 16:15:39.595008
94	8	Governance, Risk, and Compliance (GRC) Analyst	\N	Assesses risk, develops controls, and supports compliance initiatives. Conducts internal reviews and documentation.	0	2025-05-31 16:15:39.69508
95	8	GRC Manager / Risk Program Manager	\N	Oversees organizational compliance and risk programs. Coordinates with departments and ensures adherence to policies.	0	2025-05-31 16:15:39.772034
96	8	Chief Risk Advisor / Senior Compliance Strategist	\N	Leads enterprise risk assessment and mitigation strategies. Consults executive leadership and external stakeholders.	0	2025-05-31 16:15:39.84861
97	8	Chief Risk Officer / VP of Governance & Compliance	\N	Sets strategic direction for risk and compliance functions. Represents organization in regulatory and board-level matters.	0	2025-05-31 16:15:39.935166
98	13	Security Control Assessor (Junior)	\N	Assists with assessing security controls and documenting compliance posture under supervision.	0	2025-05-31 16:16:11.464681
99	13	Security Engineer (Associate)	\N	Supports system security engineering tasks and helps implement technical security measures.	0	2025-05-31 16:16:11.537359
100	13	Security Engineer	\N	Designs and implements secure systems, evaluates tools, and develops security solutions.	0	2025-05-31 16:16:11.609519
101	13	Systems Security Analyst	\N	Performs detailed security analysis and provides recommendations for enhancing system defenses.	0	2025-05-31 16:16:11.681414
102	13	Cybersecurity Architect	\N	Develops high-level security architectures across systems and environments.	0	2025-05-31 16:16:11.753956
103	13	Lead Security Architect	\N	Leads enterprise-level architecture projects, integrates security into system designs.	0	2025-05-31 16:16:11.824739
104	13	Chief Security Architect / Director of Enterprise Security	\N	Oversees all architectural and engineering functions, aligns with enterprise security strategy.	0	2025-05-31 16:16:11.897418
105	35	Security Control Assessor (Junior)	\N	Assists with assessing security controls and documenting compliance posture under supervision.	0	2025-05-31 21:25:29.364128
106	35	Security Engineer (Associate)	\N	Supports system security engineering tasks and helps implement technical security measures.	0	2025-05-31 21:25:29.689777
107	35	Security Engineer	\N	Designs and implements secure systems, evaluates tools, and develops security solutions.	0	2025-05-31 21:25:30.011732
108	35	Systems Security Analyst	\N	Performs detailed security analysis and provides recommendations for enhancing system defenses.	0	2025-05-31 21:25:30.39923
109	35	Cybersecurity Architect	\N	Develops high-level security architectures across systems and environments.	0	2025-05-31 21:25:30.787882
110	35	Lead Security Architect	\N	Leads enterprise-level architecture projects, integrates security into system designs.	0	2025-05-31 21:25:30.966459
111	35	Chief Security Architect / Director of Enterprise Security	\N	Oversees all architectural and engineering functions, aligns with enterprise security strategy.	0	2025-05-31 21:25:31.238427
112	14	Software Developer (Secure Coding Focus)	\N	Focuses on developing applications with security in mind, understanding secure coding practices.	0	2025-05-31 21:27:23.093754
113	14	Secure Software Engineer	\N	Implements secure software designs and performs code reviews; collaborates with security teams.	0	2025-05-31 21:27:23.392054
114	14	Senior Secure Application Developer	\N	Leads software development projects, ensures security is embedded across SDLC.	0	2025-05-31 21:27:23.488217
115	14	Lead Application Security Architect	\N	Designs enterprise-wide secure architecture strategies for applications; leads security reviews.	0	2025-05-31 21:27:23.580357
116	14	Director of Application Security	\N	Oversees secure software initiatives and policy integration; manages teams and budget.	0	2025-05-31 21:27:23.660104
117	37	Cloud Security Support Technician / IT Support Specialist	\N	Supports basic configuration and security monitoring in cloud or hybrid environments. Gains familiarity with IAM, network security, and cloud tools.	0	2025-05-31 21:33:46.576918
118	37	Cloud Security Analyst / Infrastructure Security Analyst	\N	Performs security monitoring, assessments, and configuration validation across cloud and infrastructure platforms. Implements cloud policies.	0	2025-05-31 21:33:46.842517
119	37	Cloud Security Engineer / Infrastructure Security Engineer	\N	Leads implementation of security controls in complex multi-cloud and hybrid environments. Handles automation, policy enforcement, and coordination.	0	2025-05-31 21:33:47.090586
120	37	Cloud Security Architect / Senior Cloud Security Engineer	\N	Designs secure cloud architecture aligned to business goals. Defines infrastructure standards and mentors engineers.	0	2025-05-31 21:33:47.262064
121	37	Chief Cloud Security Officer / Director of Infrastructure Security	\N	Owns enterprise-wide cloud and infrastructure security strategy. Oversees security posture across all cloud platforms and critical infrastructure.	0	2025-05-31 21:33:47.506493
122	19	IAM Analyst / Access Control Technician	\N	Supports basic access control processes, user provisioning, and credential management under supervision.	0	2025-05-31 21:35:53.925773
123	19	Identity & Access Management Specialist	\N	Implements IAM systems and enforces identity governance policies. Manages lifecycle of user accounts and access rights.	0	2025-05-31 21:35:54.170853
124	19	IAM Engineer / Lead Identity Architect	\N	Designs and manages scalable IAM infrastructure. Leads major IAM initiatives and ensures integration across systems.	0	2025-05-31 21:35:54.395811
125	19	Identity Services Architect / IAM Program Lead	\N	Oversees architectural design of identity services. Manages enterprise-wide IAM policies and leads strategic IAM efforts.	0	2025-05-31 21:35:54.618193
126	19	Director of Identity & Access Management / Chief Identity Officer	\N	Sets vision and direction for IAM across the organization. Aligns identity strategy with enterprise risk and compliance goals.	0	2025-05-31 21:35:54.795637
127	11	Cybersecurity Support Technician (OT Focus)	\N	Provides technical support and assists in monitoring and maintaining OT systems under supervision. Builds foundational knowledge of ICS/SCADA environments.	0	2025-05-31 21:38:47.686572
128	11	OT Security Analyst	\N	Analyzes data and system configurations to detect vulnerabilities and threats in operational technology environments. Supports incident response efforts specific to OT.	0	2025-05-31 21:38:47.922753
129	11	Industrial Control Systems (ICS) Security Engineer	\N	Designs, configures, and maintains security controls for industrial control systems. Collaborates with engineering teams to ensure secure operations.	0	2025-05-31 21:38:48.156301
130	11	OT Security Architect	\N	Develops architecture for secure ICS/SCADA systems and ensures alignment with organizational security standards and regulatory requirements.	0	2025-05-31 21:38:48.30778
131	11	Director of OT Cybersecurity / VP of Operational Security	\N	Oversees the cybersecurity strategy for OT environments across the enterprise. Manages policy development, budgeting, compliance, and cross-departmental coordination.	0	2025-05-31 21:38:48.537604
132	22	Digital Evidence Technician	\N	Assists with collecting, preserving, and processing digital evidence. Entry-level support role.	0	2025-05-31 21:40:22.348651
133	22	Cybercrime Investigator	\N	Conducts detailed investigations of cybercrimes, including fraud, hacking, and digital theft.	0	2025-05-31 21:40:22.616994
134	22	Forensic Analyst Lead	\N	Leads investigative efforts and complex digital forensic cases, providing oversight and mentoring.	0	2025-05-31 21:40:22.855677
135	22	Cybercrime Operations Manager	\N	Manages teams and processes for investigating high-level cybercrimes and coordinating with law enforcement.	0	2025-05-31 21:40:23.095091
136	22	Director of Cybercrime & Digital Investigations	\N	Oversees enterprise-wide cybercrime investigation and forensic response strategy; liaises with executive stakeholders and external partners.	0	2025-05-31 21:40:23.400801
142	25	Cybersecurity Program Manager / Senior Information Security Officer	\N	Oversees major components of the cybersecurity program, aligning it with enterprise risk. Coordinates with departments, manages projects, and ensures compliance with cybersecurity standards.	0	2025-05-31 21:43:21.917462
143	25	Deputy Chief Information Security Officer (Deputy CISO)	\N	Serves as the CISO’s senior technical and operational advisor. Helps execute the vision and strategy of the cybersecurity program and may lead internal committees or working groups.	0	2025-05-31 21:43:22.251057
144	25	Chief Information Security Officer (CISO)	\N	Leads the entire cybersecurity program, defining vision, strategy, policies, and objectives. Communicates cybersecurity posture to executives and board members and ensures organization-wide alignment.	0	2025-05-31 21:43:22.401872
145	24	Cybersecurity Project Coordinator	\N	Supports project planning, status tracking, and documentation. Assists project leads with schedules and deliverables.	0	2025-05-31 21:46:42.783119
146	24	Cybersecurity Project Manager	\N	Manages individual cybersecurity projects with responsibility for scope, schedule, and cost. Coordinates technical teams.	0	2025-05-31 21:46:42.873426
147	24	Cybersecurity Program Manager	\N	Leads large or complex programs composed of multiple projects. Aligns program objectives with organizational goals.	0	2025-05-31 21:46:43.038489
148	24	Cybersecurity Portfolio Manager	\N	Oversees multiple programs and ensures alignment with enterprise-wide cybersecurity strategy and resources.	0	2025-05-31 21:46:43.190412
149	24	Chief Program Officer / Executive Director of Cyber Programs	\N	Sets strategic direction for major cybersecurity portfolios. Provides executive leadership, stakeholder engagement, and resource oversight.	0	2025-05-31 21:46:43.265937
150	44	Junior Security Tool Developer / Research Assistant	\N	Assists in basic security tool coding, documentation, and lab work under supervision.	0	2025-05-31 21:48:02.219524
151	44	Security Tool Developer / Security Researcher	\N	Develops cybersecurity tools, scripts, and utilities to improve threat detection or system security.	0	2025-05-31 21:48:02.431245
152	44	Senior Security Researcher / Security Engineer - Tooling	\N	Designs and leads development of internal tools and automation for enterprise-scale security use cases.	0	2025-05-31 21:48:02.78629
153	44	Principal Cybersecurity Researcher / R&D Lead	\N	Leads innovation efforts in tooling and new cybersecurity technologies. Engages with external research bodies.	0	2025-05-31 21:48:03.089243
154	44	Director of Cybersecurity Research & Innovation	\N	Establishes vision and strategy for cyber R&D and internal tool development. Leads external partnerships and funding acquisition.	0	2025-05-31 21:48:03.32819
155	28	Security Automation Analyst	\N	Supports development of automated detection and response workflows under supervision. Learns scripting and automation tools such as SOAR platforms.	0	2025-05-31 21:50:08.816811
156	28	Security Automation Engineer	\N	Develops and maintains scripts and tools for automating security tasks. Works on SOAR integration and playbook implementation.	0	2025-05-31 21:50:08.982313
157	28	Security Orchestration Engineer	\N	Leads orchestration of complex security processes across multiple systems. Focuses on performance, efficiency, and scalability.	0	2025-05-31 21:50:09.274351
158	28	Automation & Orchestration Architect	\N	Designs organization-wide automation strategies. Evaluates, architects, and integrates orchestration solutions at scale.	0	2025-05-31 21:50:09.419926
159	28	Director of Security Automation	\N	Establishes enterprise strategy for security automation and orchestration. Aligns efforts with business goals and risk posture.	0	2025-05-31 21:50:09.571708
160	30	Cybersecurity Support Specialist	\N	Handles initial customer inquiries and support tickets related to cybersecurity products and services. Explains basic security practices to non-technical audiences.	0	2025-05-31 21:57:49.405643
161	30	Cybersecurity Account Manager / Sales Engineer	\N	Serves as the liaison between security solution providers and clients. Translates client needs into technical specifications and supports pre-sales discussions.	0	2025-05-31 21:57:49.590213
162	30	Solutions Architect (Security)	\N	Designs and implements security solutions based on customer needs. Collaborates with engineering teams to tailor offerings.	0	2025-05-31 21:57:49.922011
163	30	Principal Security Advisor / Technical Account Manager	\N	Leads strategic customer engagements and provides expert-level technical guidance on product implementations and integrations.	0	2025-05-31 21:57:50.212103
164	30	Chief Customer Security Officer / VP of Customer Security	\N	Leads the customer security strategy across large accounts or client portfolios. Represents the organization’s security vision to external stakeholders.	0	2025-05-31 21:57:50.521467
165	2	Cyber Threat Analyst (Junior)	\N	Assists in collecting and analyzing cyber threat information. Learns to interpret basic threat indicators and tools.	0	2025-05-31 22:01:31.810616
166	2	Cyber Threat Analyst	\N	Performs cyber threat intelligence analysis to identify threats, TTPs, and adversary behavior using intelligence sources.	0	2025-05-31 22:01:32.111222
167	2	Threat Intelligence Specialist	\N	Develops threat profiles, strategic analysis, and attribution assessments. Interfaces with SOC, IR, and Red/Blue Teams.	0	2025-05-31 22:01:32.356645
168	2	Threat Intelligence Lead / Threat Hunter Lead	\N	Oversees advanced threat modeling, hunting programs, and coordination with law enforcement or industry groups.	0	2025-05-31 22:01:32.598405
169	2	Director of Threat Intelligence	\N	Leads the enterprise-wide threat intelligence strategy, manages teams, defines investment areas, and informs senior leadership.	0	2025-05-31 22:01:32.865919
170	10	Privacy Analyst / Legal & Policy Support Assistant	\N	Supports legal and privacy teams with research, documentation, and compliance tasks. Entry into privacy and legal domain, often through internships or compliance support roles.	0	2025-05-31 22:02:57.224987
171	10	Privacy Specialist / Cyber Legal Advisor	\N	Performs legal and policy analysis related to cybersecurity, privacy, and compliance. Drafts documentation and provides legal insights under supervision.	0	2025-05-31 22:02:57.383063
172	10	Privacy Officer / Policy Advisor	\N	Oversees compliance with privacy regulations and internal policies. Advises on policy changes and regulatory impacts. Works cross-functionally.	0	2025-05-31 22:02:57.558463
173	10	Chief Privacy Officer / Lead Policy Strategist	\N	Leads enterprise-wide privacy programs and provides expert guidance on legal and regulatory issues. Shapes organizational privacy posture and strategic policy direction.	0	2025-05-31 22:02:57.748751
174	10	VP of Privacy & Legal Affairs / Chief Legal Counsel	\N	Directs the privacy, legal, and compliance functions. Advises executive leadership on legal risks, policy formation, and regulatory alignment. Represents organization externally.	0	2025-05-31 22:02:57.934932
\.


--
-- Data for Name: career_positions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_positions (id, career_level_id, job_title, nice_work_role_id, description, notes, sort_order, created_at) FROM stdin;
1	1	Cyber Defense Analyst	114	Monitors, analyzes, and responds to cyber threats in real-time.	Maps to NICE work role: Defensive Cybersecurity	0	2025-05-29 16:58:03.327982
2	2	Threat Intelligence Analyst	117	Develops threat intelligence to inform defensive actions.	Maps to NICE work role: Infrastructure Support	0	2025-05-29 16:58:03.427031
3	3	SOC Manager	\N	Oversees SOC team operations, escalations, and KPIs.	Custom position title	0	2025-05-29 16:58:03.515422
4	4	Director of Security Operations	\N	Leads organizational security operations strategy.	Custom position title	0	2025-05-29 16:58:03.607653
5	5	Chief Information Security Officer (CISO)	\N	Executive leadership role with overall security oversight.	Custom position title	0	2025-05-29 16:58:03.694288
6	6	Red Team Operator (Associate) / Penetration Tester / Exp	\N	Conducts penetration tests and participates in red team engagements under supervision. Focuses on executing defined tactics, techniques, and procedures (TTPs) and documenting findings.	Offensive security specialization - custom position title	0	2025-05-29 17:00:10.106359
7	7	Red Team Operator / Exploitation Analyst	\N	Leads complex penetration tests and red team engagements. Develops custom exploits, advanced TTPs, and innovative attack methodologies. Mentors junior operators.	Offensive security specialization - custom position title	0	2025-05-29 17:00:10.106359
8	8	Red Team Lead / Offensive Cyber Operations Lead	\N	Plans, scopes, and directs full-scope red team engagements and advanced adversary simulations. Manages the red team capabilities, methodologies, and reporting. Provides technical leadership.	Offensive security specialization - custom position title	0	2025-05-29 17:00:10.106359
9	9	Director of Offensive Security / Head of Red Team Operations	\N	Establishes the vision, strategy, and budget for the organization offensive security program. Ensures alignment with enterprise risk and communicates program value to executive leadership.	Offensive security specialization - custom position title	0	2025-05-29 17:00:10.106359
10	10	Vulnerability Analyst (Junior)	\N	Supports vulnerability scanning and assessment tasks. Assists with documentation and tracking of vulnerabilities.	Entry-level vulnerability management role	0	2025-05-29 17:01:13.331199
11	11	Vulnerability Analyst	\N	Performs vulnerability scans and analysis. Coordinates with system owners and engineers to remediate findings.	Core vulnerability analyst position	0	2025-05-29 17:01:13.331199
12	12	Vulnerability Management Lead	\N	Oversees enterprise vulnerability management program. Prioritizes findings based on risk and ensures timely remediation.	Leadership role in vulnerability management	0	2025-05-29 17:01:13.331199
13	13	Principal Vulnerability Engineer	\N	Designs and optimizes enterprise vulnerability assessment architecture. Advises on advanced mitigation techniques.	Senior technical specialist role	0	2025-05-29 17:01:13.331199
14	14	Director of Vulnerability Management / CISO	\N	Sets strategic direction for vulnerability risk reduction. Communicates program metrics and business impact to executive stakeholders.	Executive leadership position	0	2025-05-29 17:01:13.331199
15	15	Forensic Technician	\N	Supports collection and preservation of digital evidence. Assists in basic forensic tasks under guidance.	Entry-level digital forensics support role	0	2025-05-29 17:03:24.849657
16	16	Digital Forensics Analyst	\N	Performs forensic imaging, evidence analysis, and reports findings to incident response or legal teams.	Core forensic analyst position	0	2025-05-29 17:03:24.849657
17	17	Senior Digital Forensics Specialist / Malware Analyst	\N	Leads forensic investigations, reverse engineers malware, and provides deep analysis for advanced incidents.	Senior technical specialist with malware analysis expertise	0	2025-05-29 17:03:24.849657
18	18	Forensics Lead / Incident Response Lead	\N	Oversees all forensic engagements, mentors junior analysts, and ensures process quality and integrity.	Leadership role in forensic investigations	0	2025-05-29 17:03:24.849657
19	19	Director of Digital Forensics / Head of Incident Response	\N	Leads the organizational strategy for forensic readiness, compliance, and high-profile investigations.	Executive leadership position	0	2025-05-29 17:03:24.849657
20	20	IT Auditor / Compliance Analyst	\N	Performs basic compliance assessments and supports audits. Familiar with industry standards (e.g., NIST, ISO).	Entry-level compliance and audit support role	0	2025-05-29 17:08:07.903536
21	21	Governance, Risk, and Compliance (GRC) Analyst	\N	Assesses risk, develops controls, and supports compliance initiatives. Conducts internal reviews and documentation.	Core GRC analyst position	0	2025-05-29 17:08:07.903536
22	22	GRC Manager / Risk Program Manager	\N	Oversees organizational compliance and risk programs. Coordinates with departments and ensures adherence to policies.	Management role overseeing compliance programs	0	2025-05-29 17:08:07.903536
23	23	Chief Risk Advisor / Senior Compliance Strategist	\N	Leads enterprise risk assessment and mitigation strategies. Consults executive leadership and external stakeholders.	Strategic advisory role for enterprise risk	0	2025-05-29 17:08:07.903536
24	24	Chief Risk Officer / VP of Governance & Compliance	\N	Sets strategic direction for risk and compliance functions. Represents organization in regulatory and board-level matters.	Executive leadership position	0	2025-05-29 17:08:07.903536
25	25	Security Control Assessor (Junior)	\N	Assists with assessing security controls and documenting compliance posture under supervision.	Entry-level compliance assessment role	0	2025-05-29 17:09:57.011352
26	25	Security Engineer (Associate)	\N	Supports system security engineering tasks and helps implement technical security measures.	Entry-level technical implementation role	0	2025-05-29 17:09:57.011352
27	26	Security Engineer	\N	Designs and implements secure systems, evaluates tools, and develops security solutions.	Core security engineering position	0	2025-05-29 17:09:57.011352
28	26	Systems Security Analyst	\N	Performs detailed security analysis and provides recommendations for enhancing system defenses.	Security analysis and recommendations role	0	2025-05-29 17:09:57.011352
29	27	Cybersecurity Architect	\N	Develops high-level security architectures across systems and environments.	Senior architectural design role	0	2025-05-29 17:09:57.011352
30	28	Lead Security Architect	\N	Leads enterprise-level architecture projects, integrates security into system designs.	Expert-level architectural leadership	0	2025-05-29 17:09:57.011352
31	29	Chief Security Architect / Director of Enterprise Security	\N	Oversees all architectural and engineering functions, aligns with enterprise security strategy.	Executive leadership position	0	2025-05-29 17:09:57.011352
32	30	Software Developer (Secure Coding Focus)	\N	Focuses on developing applications with security in mind, understanding secure coding practices.	Entry-level secure development with NICE work role DD-WRL-003	0	2025-05-29 17:11:34.625409
33	31	Secure Software Engineer	\N	Implements secure software designs and performs code reviews; collaborates with security teams.	Mid-level secure engineering with NICE work role DD-WRL-003	0	2025-05-29 17:11:34.625409
34	32	Senior Secure Application Developer	\N	Leads software development projects, ensures security is embedded across SDLC.	Senior development leadership with NICE work role DD-WRL-003	0	2025-05-29 17:11:34.625409
35	33	Lead Application Security Architect	\N	Designs enterprise-wide secure architecture strategies for applications; leads security reviews.	Expert-level architecture with NICE work role DD-WRL-005	0	2025-05-29 17:11:34.625409
36	34	Director of Application Security	\N	Oversees secure software initiatives and policy integration; manages teams and budget.	Executive leadership position	0	2025-05-29 17:11:34.625409
37	35	Cloud Security Support Technician / IT Support Specialist	\N	Supports basic configuration and security monitoring in cloud or hybrid environments. Gains familiarity with IAM, network security, and cloud tools.	Entry-level cloud support with NICE work role IO-WRL-002	0	2025-05-29 17:12:57.82764
38	36	Cloud Security Analyst / Infrastructure Security Analyst	\N	Performs security monitoring, assessments, and configuration validation across cloud and infrastructure platforms. Implements cloud policies.	Mid-level security analysis with NICE work role PD-WRL-004	0	2025-05-29 17:12:57.82764
39	37	Cloud Security Engineer / Infrastructure Security Engineer	\N	Leads implementation of security controls in complex multi-cloud and hybrid environments. Handles automation, policy enforcement, and coordination.	Senior engineering with NICE work role PD-WRL-007	0	2025-05-29 17:12:57.82764
40	38	Cloud Security Architect / Senior Cloud Security Engineer	\N	Designs secure cloud architecture aligned to business goals. Defines infrastructure standards and mentors engineers.	Expert-level architecture with NICE work role DD-WRL-007	0	2025-05-29 17:12:57.82764
41	39	Chief Cloud Security Officer / Director of Infrastructure Security	\N	Owns enterprise-wide cloud and infrastructure security strategy. Oversees security posture across all cloud platforms and critical infrastructure.	Executive leadership position	0	2025-05-29 17:12:57.82764
42	40	IAM Analyst / Access Control Technician	\N	Supports basic access control processes, user provisioning, and credential management under supervision.	Entry-level access control support role	0	2025-05-29 17:17:37.799684
43	41	Identity & Access Management Specialist	\N	Implements IAM systems and enforces identity governance policies. Manages lifecycle of user accounts and access rights.	Core IAM specialist position	0	2025-05-29 17:17:37.799684
44	42	IAM Engineer / Lead Identity Architect	\N	Designs and manages scalable IAM infrastructure. Leads major IAM initiatives and ensures integration across systems.	Senior engineering and architecture role	0	2025-05-29 17:17:37.799684
45	43	Identity Services Architect / IAM Program Lead	\N	Oversees architectural design of identity services. Manages enterprise-wide IAM policies and leads strategic IAM efforts.	Expert-level program leadership	0	2025-05-29 17:17:37.799684
46	44	Director of Identity & Access Management / Chief Identity Officer	\N	Sets vision and direction for IAM across the organization. Aligns identity strategy with enterprise risk and compliance goals.	Executive leadership position	0	2025-05-29 17:17:37.799684
47	45	Cybersecurity Support Technician (OT Focus)	\N	Provides technical support and assists in monitoring and maintaining OT systems under supervision. Builds foundational knowledge of ICS/SCADA environments.	Entry-level OT support with ICS/SCADA focus	0	2025-05-29 17:22:05.571696
48	46	OT Security Analyst	\N	Analyzes data and system configurations to detect vulnerabilities and threats in operational technology environments. Supports incident response efforts specific to OT.	Core OT security analysis position	0	2025-05-29 17:22:05.571696
49	47	Industrial Control Systems (ICS) Security Engineer	\N	Designs, configures, and maintains security controls for industrial control systems. Collaborates with engineering teams to ensure secure operations.	Senior ICS security engineering role	0	2025-05-29 17:22:05.571696
50	48	OT Security Architect	\N	Develops architecture for secure ICS/SCADA systems and ensures alignment with organizational security standards and regulatory requirements.	Expert-level OT architecture	0	2025-05-29 17:22:05.571696
51	49	Director of OT Cybersecurity / VP of Operational Security	\N	Oversees the cybersecurity strategy for OT environments across the enterprise. Manages policy development, budgeting, compliance, and cross-departmental coordination.	Executive leadership position	0	2025-05-29 17:22:05.571696
52	50	Digital Evidence Technician	\N	Assists with collecting, preserving, and processing digital evidence. Entry-level support role.	Entry-level evidence support with NICE work role PD-WRL-002	0	2025-05-29 17:24:23.32193
53	51	Cybercrime Investigator	\N	Conducts detailed investigations of cybercrimes, including fraud, hacking, and digital theft.	Core investigative role with NICE work role IN-WRL-001	0	2025-05-29 17:24:23.32193
54	52	Forensic Analyst Lead	\N	Leads investigative efforts and complex digital forensic cases, providing oversight and mentoring.	Senior forensic leadership role	0	2025-05-29 17:24:23.32193
55	53	Cybercrime Operations Manager	\N	Manages teams and processes for investigating high-level cybercrimes and coordinating with law enforcement.	Expert-level operations management	0	2025-05-29 17:24:23.32193
56	54	Director of Cybercrime & Digital Investigations	\N	Oversees enterprise-wide cybercrime investigation and forensic response strategy; liaises with executive stakeholders and external partners.	Executive leadership position	0	2025-05-29 17:24:23.32193
57	55	Cybersecurity Instructor (Associate)	\N	Supports basic cyber education and instruction efforts. Delivers prepared content to learners under supervision or as part of a team.	Entry-level instructional support role	0	2025-05-29 17:27:26.691214
58	56	Cybersecurity Instructor / Curriculum Developer	\N	Develops and delivers technical cybersecurity training. Creates curriculum and adapts materials for diverse audiences and delivery methods.	Core instructor and curriculum development position	0	2025-05-29 17:27:26.691214
59	57	Lead Cybersecurity Instructor / Program Manager	\N	Oversees course quality, leads teams of instructors, and ensures alignment with industry needs. May manage instructional contracts or partner programs.	Senior instructional leadership role	0	2025-05-29 17:27:26.691214
60	58	Director of Cybersecurity Education	\N	Sets strategy for cybersecurity education programs. Collaborates with stakeholders to expand training pipelines and manage major initiatives.	Expert-level education strategy	0	2025-05-29 17:27:26.691214
61	59	VP of Cybersecurity Education & Workforce Development	\N	Leads enterprise-wide cyber workforce development strategy, partnerships, and funding. Represents the organization in national education and workforce forums.	Executive leadership position	0	2025-05-29 17:27:26.691214
62	60	Cybersecurity Program Manager / Senior Information Security Officer	\N	Oversees major components of the cybersecurity program, aligning it with enterprise risk. Coordinates with departments, manages projects, and ensures compliance with cybersecurity standards.	Senior-level program management role	0	2025-05-29 17:29:04.777154
63	61	Deputy Chief Information Security Officer (Deputy CISO)	\N	Serves as the CISO's senior technical and operational advisor. Helps execute the vision and strategy of the cybersecurity program and may lead internal committees or working groups.	Expert-level deputy leadership position	0	2025-05-29 17:29:04.777154
64	62	Chief Information Security Officer (CISO)	\N	Leads the entire cybersecurity program, defining vision, strategy, policies, and objectives. Communicates cybersecurity posture to executives and board members and ensures organization-wide alignment.	Executive-level cybersecurity leadership	0	2025-05-29 17:29:04.777154
65	63	Cybersecurity Project Coordinator	\N	Supports project planning, status tracking, and documentation. Assists project leads with schedules and deliverables.	Entry-level project support role	0	2025-05-29 17:30:38.758869
66	64	Cybersecurity Project Manager	\N	Manages individual cybersecurity projects with responsibility for scope, schedule, and cost. Coordinates technical teams.	Mid-level project management position	0	2025-05-29 17:30:38.758869
67	65	Cybersecurity Program Manager	\N	Leads large or complex programs composed of multiple projects. Aligns program objectives with organizational goals.	Senior-level program leadership role	0	2025-05-29 17:30:38.758869
68	66	Cybersecurity Portfolio Manager	\N	Oversees multiple programs and ensures alignment with enterprise-wide cybersecurity strategy and resources.	Expert-level portfolio oversight	0	2025-05-29 17:30:38.758869
69	67	Chief Program Officer / Executive Director of Cyber Programs	\N	Sets strategic direction for major cybersecurity portfolios. Provides executive leadership, stakeholder engagement, and resource oversight.	Executive-level strategic program leadership	0	2025-05-29 17:30:38.758869
70	68	Junior Security Tool Developer / Research Assistant	\N	Assists in basic security tool coding, documentation, and lab work under supervision.	Entry-level development and research support role	0	2025-05-29 17:31:49.925213
71	69	Security Tool Developer / Security Researcher	\N	Develops cybersecurity tools, scripts, and utilities to improve threat detection or system security.	Mid-level tool development position	0	2025-05-29 17:31:49.925213
72	70	Senior Security Researcher / Security Engineer - Tooling	\N	Designs and leads development of internal tools and automation for enterprise-scale security use cases.	Senior-level research and engineering leadership	0	2025-05-29 17:31:49.925213
73	71	Principal Cybersecurity Researcher / R&D Lead	\N	Leads innovation efforts in tooling and new cybersecurity technologies. Engages with external research bodies.	Expert-level research leadership	0	2025-05-29 17:31:49.925213
74	72	Director of Cybersecurity Research & Innovation	\N	Establishes vision and strategy for cyber R&D and internal tool development. Leads external partnerships and funding acquisition.	Executive-level innovation strategy	0	2025-05-29 17:31:49.925213
75	73	Security Automation Analyst	\N	Supports development of automated detection and response workflows under supervision. Learns scripting and automation tools such as SOAR platforms.	Entry-level automation support role	0	2025-05-29 17:34:16.531567
76	74	Security Automation Engineer	\N	Develops and maintains scripts and tools for automating security tasks. Works on SOAR integration and playbook implementation.	Mid-level automation engineering position	0	2025-05-29 17:34:16.531567
77	75	Security Orchestration Engineer	\N	Leads orchestration of complex security processes across multiple systems. Focuses on performance, efficiency, and scalability.	Senior-level orchestration leadership	0	2025-05-29 17:34:16.531567
78	76	Automation & Orchestration Architect	\N	Designs organization-wide automation strategies. Evaluates, architects, and integrates orchestration solutions at scale.	Expert-level architecture role	0	2025-05-29 17:34:16.531567
79	77	Director of Security Automation	\N	Establishes enterprise strategy for security automation and orchestration. Aligns efforts with business goals and risk posture.	Executive-level automation strategy	0	2025-05-29 17:34:16.531567
80	78	Cybersecurity Support Specialist	\N	Handles initial customer inquiries and support tickets related to cybersecurity products and services. Explains basic security practices to non-technical audiences.	Entry-level customer support role	0	2025-05-29 17:44:10.159856
81	79	Cybersecurity Account Manager / Sales Engineer	\N	Serves as the liaison between security solution providers and clients. Translates client needs into technical specifications and supports pre-sales discussions.	Mid-level client engagement position	0	2025-05-29 17:44:10.159856
82	80	Solutions Architect (Security)	\N	Designs and implements security solutions based on customer needs. Collaborates with engineering teams to tailor offerings.	Senior-level solution design role	0	2025-05-29 17:44:10.159856
83	81	Principal Security Advisor / Technical Account Manager	\N	Leads strategic customer engagements and provides expert-level technical guidance on product implementations and integrations.	Expert-level strategic customer role	0	2025-05-29 17:44:10.159856
84	82	Chief Customer Security Officer / VP of Customer Security	\N	Leads the customer security strategy across large accounts or client portfolios. Represents the organization's security vision to external stakeholders.	Executive-level customer strategy leadership	0	2025-05-29 17:44:10.159856
85	83	Cyber Threat Analyst (Junior)	\N	Assists in collecting and analyzing cyber threat information. Learns to interpret basic threat indicators and tools.	Entry-level threat analysis support role	0	2025-05-29 17:50:21.651817
86	84	Cyber Threat Analyst	\N	Performs cyber threat intelligence analysis to identify threats, TTPs, and adversary behavior using intelligence sources.	Mid-level threat intelligence analysis position	0	2025-05-29 17:50:21.651817
87	85	Threat Intelligence Specialist	\N	Develops threat profiles, strategic analysis, and attribution assessments. Interfaces with SOC, IR, and Red/Blue Teams.	Senior-level threat intelligence specialization	0	2025-05-29 17:50:21.651817
88	86	Threat Intelligence Lead / Threat Hunter Lead	\N	Oversees advanced threat modeling, hunting programs, and coordination with law enforcement or industry groups.	Expert-level threat intelligence leadership	0	2025-05-29 17:50:21.651817
89	87	Director of Threat Intelligence	\N	Leads the enterprise-wide threat intelligence strategy, manages teams, defines investment areas, and informs senior leadership.	Executive-level threat intelligence strategy	0	2025-05-29 17:50:21.651817
90	88	Privacy Analyst / Legal & Policy Support Assistant	\N	Supports legal and privacy teams with research, documentation, and compliance tasks. Entry into privacy and legal domain, often through internships or compliance support roles.	Entry-level privacy and legal support role	0	2025-05-29 17:52:41.938526
91	89	Privacy Specialist / Cyber Legal Advisor	\N	Performs legal and policy analysis related to cybersecurity, privacy, and compliance. Drafts documentation and provides legal insights under supervision.	Mid-level privacy and legal analysis position	0	2025-05-29 17:52:41.938526
92	90	Privacy Officer / Policy Advisor	\N	Oversees compliance with privacy regulations and internal policies. Advises on policy changes and regulatory impacts. Works cross-functionally.	Senior-level privacy oversight role	0	2025-05-29 17:52:41.938526
93	91	Chief Privacy Officer / Lead Policy Strategist	\N	Leads enterprise-wide privacy programs and provides expert guidance on legal and regulatory issues. Shapes organizational privacy posture and strategic policy direction.	Expert-level privacy leadership	0	2025-05-29 17:52:41.938526
94	92	VP of Privacy & Legal Affairs / Chief Legal Counsel	\N	Directs the privacy, legal, and compliance functions. Advises executive leadership on legal risks, policy formation, and regulatory alignment. Represents organization externally.	Executive-level legal strategy leadership	0	2025-05-29 17:52:41.938526
100	10	Vulnerability Management Analyst	\N	\N	\N	1	2025-05-31 23:18:47.769621
101	11	Vulnerability Management Specialist	\N	\N	\N	2	2025-05-31 23:18:48.317323
102	12	Vulnerability Program Manager	\N	\N	\N	3	2025-05-31 23:18:48.85185
103	13	Vulnerability Assessment Lead / Engineer	\N	\N	\N	4	2025-05-31 23:18:49.174101
104	14	Director of Vulnerability Management	\N	\N	\N	5	2025-05-31 23:18:49.560223
\.


--
-- Data for Name: career_track_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_track_categories (id, career_track_id, category_id, created_at) FROM stdin;
2	2	33	2025-05-28 22:55:35.801155
3	2	30	2025-05-28 22:55:35.838765
4	3	33	2025-05-28 22:55:35.9141
5	4	33	2025-05-28 22:55:35.992165
6	5	33	2025-05-28 22:55:36.066157
7	6	30	2025-05-28 22:55:36.141902
8	7	33	2025-05-28 22:55:36.21606
9	8	29	2025-05-28 22:55:36.290741
10	9	29	2025-05-28 22:55:36.364539
11	10	29	2025-05-28 22:55:36.439299
12	11	29	2025-05-28 22:55:36.514412
13	12	29	2025-05-28 22:55:36.588864
14	13	31	2025-05-28 22:55:36.66371
15	13	29	2025-05-28 22:55:36.701089
16	14	31	2025-05-28 22:55:36.776429
17	15	31	2025-05-28 22:55:36.851355
18	16	32	2025-05-28 22:55:36.926021
19	17	32	2025-05-28 22:55:37.002947
20	18	31	2025-05-28 22:55:37.080109
21	19	32	2025-05-28 22:55:37.158366
22	20	32	2025-05-28 22:55:37.237119
23	21	31	2025-05-28 22:55:37.312682
24	22	30	2025-05-28 22:55:37.387873
25	23	29	2025-05-28 22:55:37.463591
26	24	29	2025-05-28 22:55:37.539188
27	25	29	2025-05-28 22:55:37.613574
28	26	31	2025-05-28 22:55:37.687908
29	27	31	2025-05-28 22:55:37.762755
30	28	31	2025-05-28 22:55:37.837992
31	29	29	2025-05-28 22:55:37.913122
32	30	29	2025-05-28 22:55:37.988
33	31	33	2025-05-29 16:58:03.153911
34	5	33	2025-05-29 17:01:14.76599
35	6	30	2025-05-29 17:03:29.079001
36	8	29	2025-05-29 17:08:20.374258
37	35	31	2025-05-29 17:10:01.31059
38	35	32	2025-05-29 17:10:05.143051
39	14	31	2025-05-29 17:11:38.979539
40	37	32	2025-05-29 17:13:02.793918
41	37	33	2025-05-29 17:13:07.046487
42	37	31	2025-05-29 17:13:07.046487
43	38	32	2025-05-29 17:17:43.088568
44	38	33	2025-05-29 17:17:43.088568
45	39	33	2025-05-29 17:22:11.46936
46	39	32	2025-05-29 17:22:11.46936
47	22	30	2025-05-29 17:24:28.113927
48	22	33	2025-05-29 17:24:28.113927
49	41	29	2025-05-29 17:27:31.638666
50	42	29	2025-05-29 17:29:08.538627
51	43	29	2025-05-29 17:30:43.86897
52	44	31	2025-05-29 17:31:56.120274
53	44	32	2025-05-29 17:31:56.120274
54	45	32	2025-05-29 17:34:21.869273
55	45	33	2025-05-29 17:34:21.869273
56	46	29	2025-05-29 17:44:14.357951
57	2	30	2025-05-29 17:50:26.742814
58	2	33	2025-05-29 17:50:26.742814
59	48	29	2025-05-29 17:52:46.596017
\.


--
-- Data for Name: career_tracks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_tracks (id, name, description, overview, created_at) FROM stdin;
2	Threat Intelligence	Career pathway for Threat Intelligence professionals	\N	2025-05-28 22:55:35.763405
3	Incident Response	Career pathway for Incident Response professionals	\N	2025-05-28 22:55:35.876364
4	Red Team Operations	Career pathway for Red Team Operations professionals	\N	2025-05-28 22:55:35.951863
5	Vulnerability Management	Career pathway for Vulnerability Management professionals	\N	2025-05-28 22:55:36.029828
6	Digital Forensics	Career pathway for Digital Forensics professionals	\N	2025-05-28 22:55:36.104314
7	Security Operations Management	Career pathway for Security Operations Management professionals	\N	2025-05-28 22:55:36.179904
8	GRC (Governance, Risk, Compliance)	Career pathway for GRC (Governance, Risk, Compliance) professionals	\N	2025-05-28 22:55:36.253279
9	Cybersecurity Awareness & Training	Career pathway for Cybersecurity Awareness & Training professionals	\N	2025-05-28 22:55:36.327039
10	Cyber Policy & Legal Strategy	Career pathway for Cyber Policy & Legal Strategy professionals	\N	2025-05-28 22:55:36.401035
11	Privacy & Data Protection	Career pathway for Privacy & Data Protection professionals	\N	2025-05-28 22:55:36.476857
12	Risk Analysis & Management	Career pathway for Risk Analysis & Management professionals	\N	2025-05-28 22:55:36.551702
13	Cybersecurity Architecture	Career pathway for Cybersecurity Architecture professionals	\N	2025-05-28 22:55:36.626436
14	Secure Software Development	Career pathway for Secure Software Development professionals	\N	2025-05-28 22:55:36.73905
15	DevSecOps	Career pathway for DevSecOps professionals	\N	2025-05-28 22:55:36.813941
16	Cloud Security	Career pathway for Cloud Security professionals	\N	2025-05-28 22:55:36.888706
17	Network & Systems Administration	Career pathway for Network & Systems Administration professionals	\N	2025-05-28 22:55:36.964534
18	Security Engineering	Career pathway for Security Engineering professionals	\N	2025-05-28 22:55:37.042533
19	Identity & Access Management (IAM)	Career pathway for Identity & Access Management (IAM) professionals	\N	2025-05-28 22:55:37.118545
20	Database & Storage Security	Career pathway for Database & Storage Security professionals	\N	2025-05-28 22:55:37.198985
21	Operational Technology (OT) Security	Career pathway for Operational Technology (OT) Security professionals	\N	2025-05-28 22:55:37.275473
22	Cybercrime Investigation	Career pathway for Cybercrime Investigation professionals	\N	2025-05-28 22:55:37.350434
23	Cybersecurity Education	Career pathway for Cybersecurity Education professionals	\N	2025-05-28 22:55:37.425628
24	Program & Project Management	Career pathway for Program & Project Management professionals	\N	2025-05-28 22:55:37.503047
25	Executive Leadership (CISO Path)	Career pathway for Executive Leadership (CISO Path) professionals	\N	2025-05-28 22:55:37.576437
26	Technology Research & Innovation	Career pathway for Technology Research & Innovation professionals	\N	2025-05-28 22:55:37.650204
27	Security Tool Development	Career pathway for Security Tool Development professionals	\N	2025-05-28 22:55:37.725419
28	Security Automation & Orchestration	Career pathway for Security Automation & Orchestration professionals	\N	2025-05-28 22:55:37.800537
29	Security Compliance Auditing	Career pathway for Security Compliance Auditing professionals	\N	2025-05-28 22:55:37.876082
30	Customer-Facing Security Roles	Career pathway for Customer-Facing Security Roles professionals	\N	2025-05-28 22:55:37.950745
31	SOC Operations	Security Operations Center career pathway focusing on real-time threat monitoring, analysis, and response	Comprehensive career progression from entry-level analyst to executive security leadership roles	2025-05-29 16:58:03.076494
35	Cybersecurity Architecture & Engineering	Career pathway focusing on security system design, implementation, and architectural solutions	Complete progression from technical security implementation to enterprise-level security architecture and strategic system design	2025-05-29 17:09:40.482928
37	Cloud and Infrastructure Security	Career pathway focusing on cloud security, infrastructure protection, and hybrid environment security management	Complete progression from cloud support roles to executive infrastructure security leadership with authentic NICE Framework work role alignments across multiple categories	2025-05-29 17:12:37.723538
38	Identity and Access Management	Career pathway focusing on access control, identity governance, and user lifecycle management	Complete progression from basic access control support to executive identity strategy leadership	2025-05-29 17:17:22.066584
39	OT (Operational Technology) Security	Career pathway focusing on industrial control systems, SCADA security, and operational technology protection	Complete progression from OT support roles to executive operational security leadership with focus on ICS/SCADA environments	2025-05-29 17:21:48.784949
41	Cybersecurity Education & Training	Career pathway focusing on cybersecurity education, workforce development, and instructional design	Complete progression from associate instructor roles to executive workforce development leadership	2025-05-29 17:27:05.380482
42	Executive Leadership CISO Track	Specialized career pathway focused on preparation for Chief Information Security Officer roles and executive cybersecurity leadership	Strategic progression from senior program management to executive CISO leadership, starting at senior level due to experience requirements	2025-05-29 17:28:23.847584
43	Program and Project Management	Career pathway for cybersecurity professionals focused on project coordination, program management, and strategic portfolio oversight	Progression from project coordination to executive program leadership with responsibility for cybersecurity initiatives and strategic alignment	2025-05-29 17:30:21.575614
44	Technology Research and Tool Development	Career pathway for cybersecurity professionals focused on research, innovation, and development of security tools and technologies	Progression from junior tool development to executive research leadership with responsibility for cybersecurity innovation and R&D strategy	2025-05-29 17:31:30.004142
45	Security Automation and Orchestration	Career pathway for cybersecurity professionals focused on automating security processes, developing SOAR platforms, and orchestrating complex security workflows	Progression from automation analysis to executive strategy with responsibility for enterprise-wide security automation and orchestration initiatives	2025-05-29 17:33:53.098718
46	Customer Facing Security Roles	Career pathway for cybersecurity professionals focused on client engagement, technical sales, and customer success in security solutions	Progression from customer support to executive customer security leadership with responsibility for client relationships and security solution delivery	2025-05-29 17:43:53.423413
48	Privacy Policy Legal Affairs	Career pathway for cybersecurity professionals focused on privacy law, policy development, regulatory compliance, and legal aspects of cybersecurity	Progression from privacy analysis to executive legal leadership with responsibility for enterprise privacy strategy and regulatory compliance	2025-05-29 17:52:22.450693
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, code, name, description, created_at) FROM stdin;
29	OG	OVERSIGHT and GOVERNANCE	Develops and provides leadership, management, direction, or development and advocacy so the organization may effectively conduct cybersecurity work.	2025-05-26 20:50:04.956237
30	IN	INVESTIGATION	Investigates cybersecurity events or crimes related to information technology (IT) systems, networks, and digital evidence.	2025-05-26 20:50:04.956237
31	DD	DESIGN and DEVELOPMENT	Designs, develops, tests, and evaluates information systems throughout the systems development lifecycle.	2025-05-26 20:50:04.956237
32	IO	IMPLEMENTATION and OPERATION	Provides support for or maintains the day-to-day operation of cybersecurity systems.	2025-05-26 20:50:04.956237
33	PD	PROTECTION and DEFENSE	Identifies, analyzes, and mitigates threats to internal information technology (IT) systems and/or networks.	2025-05-26 20:50:04.956237
\.


--
-- Data for Name: certifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.certifications (id, code, name, description, issuer, level, domain, renewal_period, prerequisites, created_at) FROM stdin;
1	COMP-SEC+	CompTIA Security+	Entry-level certification covering basic cybersecurity principles and practices	CompTIA	Foundation	General	3 years	None	2025-05-30 14:07:23.997086
2	COMP-NET+	CompTIA Network+	Foundational networking skills with security focus	CompTIA	Foundation	Technical	3 years	None	2025-05-30 14:07:24.046608
3	COMP-CYSA+	CompTIA CySA+	Cybersecurity analyst skills for threat detection and analysis	CompTIA	Associate	Technical	3 years	Network+ and Security+ or equivalent experience	2025-05-30 14:07:24.08222
4	COMP-PENTEST+	CompTIA PenTest+	Penetration testing and vulnerability assessment skills	CompTIA	Associate	Technical	3 years	Network+ and Security+ or equivalent experience	2025-05-30 14:07:24.117807
5	COMP-CASP+	CompTIA CASP+	Advanced-level cybersecurity practitioner certification	CompTIA	Expert	Technical	3 years	10+ years IT experience with 5+ years security experience	2025-05-30 14:07:24.153372
6	ISC2-CISSP	Certified Information Systems Security Professional	Advanced cybersecurity management and architecture certification	ISC2	Professional	Management	3 years	5 years paid security experience	2025-05-30 14:07:24.188833
7	ISC2-SSCP	Systems Security Certified Practitioner	Hands-on security skills for IT administrators and security professionals	ISC2	Associate	Technical	3 years	1 year paid security experience	2025-05-30 14:07:24.22414
8	ISC2-CCSP	Certified Cloud Security Professional	Cloud security architecture, design, operations, and service orchestration	ISC2	Professional	Technical	3 years	5 years IT experience with 3+ years security and 1+ year cloud security	2025-05-30 14:07:24.260552
9	ISC2-CISSP-ISSAP	CISSP - Information Systems Security Architecture Professional	Advanced security architecture and engineering concentration	ISC2	Expert	Technical	3 years	CISSP certification plus additional experience	2025-05-30 14:07:24.295978
10	EC-CEH	Certified Ethical Hacker	Ethical hacking and penetration testing methodology	EC-Council	Associate	Technical	3 years	2 years security experience or training	2025-05-30 14:07:24.332214
11	EC-CHFI	Computer Hacking Forensic Investigator	Digital forensics and incident response capabilities	EC-Council	Professional	Technical	3 years	2 years security/forensics experience	2025-05-30 14:07:24.368899
12	EC-ECSA	EC-Council Certified Security Analyst	Advanced penetration testing and security analysis	EC-Council	Professional	Technical	3 years	CEH certification or equivalent experience	2025-05-30 14:07:24.404024
13	GIAC-GSEC	GIAC Security Essentials	Foundational cybersecurity knowledge and hands-on skills	GIAC	Associate	General	4 years	None	2025-05-30 14:07:24.439066
14	GIAC-GCIH	GIAC Certified Incident Handler	Incident response and digital forensics skills	GIAC	Professional	Technical	4 years	GSEC or equivalent experience	2025-05-30 14:07:24.474227
15	GIAC-GPEN	GIAC Penetration Tester	Penetration testing methodology and tools	GIAC	Professional	Technical	4 years	Security experience recommended	2025-05-30 14:07:24.509445
16	GIAC-GCFA	GIAC Certified Forensic Analyst	Advanced incident response and digital forensics	GIAC	Professional	Technical	4 years	GCIH or equivalent experience	2025-05-30 14:07:24.54512
17	GIAC-GSLC	GIAC Security Leadership	Information security leadership and management	GIAC	Expert	Management	4 years	5+ years security leadership experience	2025-05-30 14:07:24.581241
18	CISCO-CCNA-SEC	Cisco Certified Network Associate Security	Network security implementation and monitoring	Cisco	Associate	Technical	3 years	CCNA or equivalent knowledge	2025-05-30 14:07:24.620598
19	CISCO-CCNP-SEC	Cisco Certified Network Professional Security	Advanced network security design and implementation	Cisco	Professional	Technical	3 years	CCNA Security or equivalent experience	2025-05-30 14:07:24.656376
20	MS-SC-900	Microsoft Security, Compliance, and Identity Fundamentals	Microsoft security, compliance, and identity fundamentals	Microsoft	Foundation	Technical	None	None	2025-05-30 14:07:24.695361
21	MS-SC-200	Microsoft Security Operations Analyst	Security operations using Microsoft Sentinel and Defender	Microsoft	Associate	Technical	Annual	Fundamental knowledge of Microsoft 365 and Azure	2025-05-30 14:07:24.73351
22	MS-SC-300	Microsoft Identity and Access Administrator	Identity and access management using Microsoft Azure AD	Microsoft	Associate	Technical	Annual	Experience with Azure and identity solutions	2025-05-30 14:07:24.770901
23	AWS-SEC-SPEC	AWS Certified Security - Specialty	Specialized knowledge in securing AWS workloads and applications	Amazon Web Services	Professional	Technical	3 years	2+ years hands-on experience securing AWS workloads	2025-05-30 14:07:24.807714
24	ISACA-CISA	Certified Information Systems Auditor	Information systems auditing, control, and assurance	ISACA	Professional	Governance	3 years	5 years information systems experience	2025-05-30 14:07:24.842743
25	ISACA-CISM	Certified Information Security Manager	Information security management and governance	ISACA	Professional	Management	3 years	5 years information security experience with 3+ years management	2025-05-30 14:07:24.883272
26	ISACA-CRISC	Certified in Risk and Information Systems Control	IT risk identification, assessment, and mitigation	ISACA	Professional	Governance	3 years	3 years experience in IS/IT risk and control	2025-05-30 14:07:24.922691
27	CSA-CCSK	Certificate of Cloud Security Knowledge	Fundamental cloud security knowledge and best practices	Cloud Security Alliance	Foundation	Technical	3 years	None	2025-05-30 14:07:24.959216
28	NIST-NICE	NICE Cybersecurity Workforce Framework	National Initiative for Cybersecurity Education framework competency	NIST	Foundation	General	None	None	2025-05-30 14:07:24.997584
29	ISF-CISMP	Certificate in Information Security Management Principles	Information security management fundamentals	Information Security Forum	Foundation	Management	3 years	None	2025-05-30 14:07:25.032654
30	OS-OSCP	Offensive Security Certified Professional	Hands-on penetration testing certification requiring exploitation of vulnerable machines	Offensive Security	Professional	Penetration Testing	3 years	Basic networking and Linux knowledge	2025-05-31 22:48:45.369842
31	OS-OSEP	Offensive Security Experienced Penetration Tester	Advanced penetration testing focusing on evasion and advanced exploitation	Offensive Security	Expert	Advanced Penetration Testing	3 years	OSCP or equivalent experience	2025-05-31 22:48:45.369842
32	OS-OSEE	Offensive Security Exploitation Expert	Advanced Windows exploitation and development certification	Offensive Security	Expert	Exploit Development	3 years	OSCP and programming experience	2025-05-31 22:48:45.369842
33	GIAC-GXPN	GIAC Exploit Researcher and Advanced Penetration Tester	Advanced exploit research and penetration testing certification	GIAC	Expert	Exploit Research	4 years	SEC660 course or equivalent	2025-05-31 22:48:45.369842
34	ELEARN-ECPPT	eLearnSecurity Certified Professional Penetration Tester	Practical penetration testing certification with real-world scenarios	eLearnSecurity	Professional	Penetration Testing	3 years	Basic penetration testing knowledge	2025-05-31 22:48:45.369842
35	TCM-PNPT	TCM Security Practical Network Penetration Tester	Practical network penetration testing certification	TCM Security	Professional	Network Penetration Testing	2 years	Basic networking and security knowledge	2025-05-31 22:48:45.369842
36	CRTO-I	Certified Red Team Operator I	Red team operator certification focusing on initial access and lateral movement	ZERO-POINT SECURITY	Professional	Red Team Operations	2 years	Basic penetration testing experience	2025-05-31 22:48:45.369842
37	CRTO-II	Certified Red Team Operator II	Advanced red team operations and C2 frameworks	ZERO-POINT SECURITY	Expert	Advanced Red Team Operations	2 years	CRTO I or equivalent	2025-05-31 22:48:45.369842
38	CRTP	Certified Red Team Professional	Active Directory focused red team certification	ALTERED SECURITY	Professional	Active Directory	2 years	Windows and AD knowledge	2025-05-31 22:48:45.369842
39	CRTE	Certified Red Team Expert	Advanced Active Directory attack techniques	ALTERED SECURITY	Expert	Advanced Active Directory	2 years	CRTP or equivalent	2025-05-31 22:48:45.369842
40	CREST-CCSAS	CREST Certified Simulated Attack Specialist	CREST certified simulated attack specialist	CREST	Expert	Simulated Attacks	3 years	CRT or equivalent	2025-05-31 22:48:45.369842
41	GIAC-GRTP	GIAC Red Team Professional	GIAC red team professional certification	GIAC	Expert	Red Team Operations	4 years	SEC564 or equivalent	2025-05-31 22:48:45.369842
42	EC-CCISO	Certified CISO	Chief Information Security Officer certification	EC-Council	Executive	Information Security Management	3 years	Executive level security experience	2025-05-31 22:48:45.369842
43	GIAC-GSTRT	GIAC Strategic Planning Policy and Leadership	Strategic security planning and leadership	GIAC	Executive	Security Leadership	4 years	MGT514 or equivalent	2025-05-31 22:48:45.369842
50	ELEA-ECPP	eLearnSecurity eCPPT	eLearnSecurity eCPPT certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:15.189295
51	TCM-SECU	TCM Security PNPT	TCM Security PNPT certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:15.226643
52	OFFE-SECU	Offensive Security OSCP	Offensive Security OSCP certification	Offensive Security	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:15.263487
53	CERT-RED	Certified Red Team Operator I (CRTO I)	Certified Red Team Operator I (CRTO I) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:15.299614
55	GIAC-EXPLOIT	GIAC Exploit Researcher and Advanced Penetration Tester (GXPN) (SEC660)	GIAC Exploit Researcher and Advanced Penetration Tester (GXPN) (SEC660) certification	GIAC	Expert	Penetration Testing	4 years	Relevant experience recommended	2025-05-31 23:18:15.529869
59	CRES-CERT	CREST Certified Simulated Attack Specialist (CCSAS)	CREST Certified Simulated Attack Specialist (CCSAS) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.083801
60	GIAC-RED	GIAC Red Team Professional (GRTP)	GIAC Red Team Professional (GRTP) certification	GIAC	Professional	Cybersecurity	4 years	Relevant experience recommended	2025-05-31 23:18:16.125866
61	GIAC-ADVANCED	GIAC Advanced Exploit Development for Penetration Testers (SEC760)	GIAC Advanced Exploit Development for Penetration Testers (SEC760) certification	GIAC	Expert	Penetration Testing	4 years	Relevant experience recommended	2025-05-31 23:18:16.167567
63	CERT-CISO	Certified CISO (C|CISO)	Certified CISO (C|CISO) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.364038
64	GIAC-STRATEGIC	GIAC Strategic Planning	GIAC Strategic Planning certification	GIAC	Professional	Cybersecurity	4 years	Relevant experience recommended	2025-05-31 23:18:16.400601
65	POLICY	Policy	Policy certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.43817
66	AND-LEAD	and Leadership (GSTRT)	and Leadership (GSTRT) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.47465
67	CERT-INFO	Certified Information Security Manager (CISM)	Certified Information Security Manager (CISM) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.509752
68	ISC2-UNKNOWN	ISC2 Certified in Cybersecurity (CC)	ISC2 Certified in Cybersecurity (CC) certification	ISC2	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.547484
69	BLUE-TEAM	Blue Team Level 1 (BTL1)	Blue Team Level 1 (BTL1) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.58332
70	GOOG-CYBE	Google Cybersecurity Certificate	Google Cybersecurity Certificate certification	Google	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.618992
71	ELEA-ECTI	eLearnSecurity eCTI	eLearnSecurity eCTI certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.653998
72	SANS-GCTI	SANS GCTI	SANS GCTI certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.689734
73	MITR-ATT&	MITRE ATT&CK Defender (MAD)	MITRE ATT&CK Defender (MAD) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.725405
74	CERT-SOC	Certified SOC Analyst (CSA)	Certified SOC Analyst (CSA) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.76156
75	EC-UNKNOWN	EC-Council Certified Incident Handler (ECIH)	EC-Council Certified Incident Handler (ECIH) certification	EC-Council	Professional	Incident Response	3 years	Relevant experience recommended	2025-05-31 23:18:16.797162
76	SANS-GMON	SANS GMON	SANS GMON certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.833051
77	GIAC-SECURITY	GIAC Security Operations Manager (GSOM)	GIAC Security Operations Manager (GSOM) certification	GIAC	Professional	Cybersecurity	4 years	Relevant experience recommended	2025-05-31 23:18:16.874294
78	CISSP	CISSP	CISSP certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.910449
79	CERT-CHIE	Certified Chief Information Security Officer (CCISO)	Certified Chief Information Security Officer (CCISO) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.946045
80	EJPT	eJPT	eJPT certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:16.981923
81	CISCO-UNKNOWN	Cisco CyberOps Associate	Cisco CyberOps Associate certification	Cisco	Associate	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.01807
82	QUAL-VULN	Qualys Vulnerability Management Training	Qualys Vulnerability Management Training certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.054417
83	TENA-CERT	Tenable Certified Nessus Auditor	Tenable Certified Nessus Auditor certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.090361
85	GIAC-CERTIFIED	GIAC Certified Vulnerability Assessor (GVA)	GIAC Certified Vulnerability Assessor (GVA) certification	GIAC	Professional	Cybersecurity	4 years	Relevant experience recommended	2025-05-31 23:18:17.288653
86	CISM	CISM	CISM certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.334069
87	OSCP	OSCP	OSCP certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.370653
89	CERT-VULN	Certified Vulnerability Assessor (CVA)	Certified Vulnerability Assessor (CVA) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.559523
90	RED-HAT	Red Hat Security Specialist	Red Hat Security Specialist certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.596183
92	NIST-CSF	NIST CSF or RMF Practitioner Training	NIST CSF or RMF Practitioner Training certification	Various	Associate	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.792365
93	EXEC-LEAD	Executive Leadership courses	Executive Leadership courses certification	Various	Expert	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.828618
94	COMP-A	CompTIA A+	CompTIA A+ certification	CompTIA	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:17.865355
96	SC-900	Microsoft SC-900	Microsoft SC-900 certification	Microsoft	Professional	Cybersecurity	2 years	Relevant experience recommended	2025-05-31 23:18:18.073927
98	COMP-CYBERSECURITYANALYSTCYSA	CompTIA Cybersecurity Analyst (CySA+)	CompTIA Cybersecurity Analyst (CySA+) certification	CompTIA	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:18.271908
99	ENCE-(ENC	EnCE (EnCase Certified Examiner)	EnCE (EnCase Certified Examiner) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:18.310378
102	ACCE-CERT	AccessData Certified Examiner (ACE)	AccessData Certified Examiner (ACE) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:18.549469
104	GIAC-REVERSE	GIAC Reverse Engineering Malware (GREM)	GIAC Reverse Engineering Malware (GREM) certification	GIAC	Professional	Cybersecurity	4 years	Relevant experience recommended	2025-05-31 23:18:18.75239
105	CERT-MALW	Certified Malware Analyst (CMA)	Certified Malware Analyst (CMA) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:18.790439
106	CCE-(CER	CCE (Certified Computer Examiner)	CCE (Certified Computer Examiner) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:18.826657
108	GIAC-CYBER	GIAC Cyber Threat Intelligence (GCTI)	GIAC Cyber Threat Intelligence (GCTI) certification	GIAC	Professional	Cybersecurity	4 years	Relevant experience recommended	2025-05-31 23:18:19.0409
110	CCISO	C|CISO	C|CISO certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:19.241973
112	CERT-FORE	Certified Forensic Manager (CFM)	Certified Forensic Manager (CFM) certification	Various	Professional	Digital Forensics	3 years	Relevant experience recommended	2025-05-31 23:18:19.445503
114	ITIL-FOUN	ITIL Foundation	ITIL Foundation certification	Various	Foundation	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:19.651055
115	ISO/-2700	ISO/IEC 27001 Lead Implementer	ISO/IEC 27001 Lead Implementer certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:19.687445
116	ISACA-CDPSE	ISACA CDPSE	ISACA CDPSE certification	ISACA	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:19.723581
118	CERT-RISK	Certified Risk Manager (CRM)	Certified Risk Manager (CRM) certification	Various	Professional	Risk Management	3 years	Relevant experience recommended	2025-05-31 23:18:19.918234
119	ISACA-CGEIT	ISACA CGEIT	ISACA CGEIT certification	ISACA	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:19.961897
121	FAIR-RISK	FAIR Risk Analyst	FAIR Risk Analyst certification	Various	Professional	Risk Management	3 years	Relevant experience recommended	2025-05-31 23:18:20.1648
123	MBA-RISK	MBA in Risk Management or Strategic Leadership (recommended)	MBA in Risk Management or Strategic Leadership (recommended) certification	Various	Professional	Risk Management	3 years	Relevant experience recommended	2025-05-31 23:18:20.373911
124	SC-200	Microsoft SC-200	Microsoft SC-200 certification	Microsoft	Professional	Cybersecurity	2 years	Relevant experience recommended	2025-05-31 23:18:20.411191
125	CEH	CEH	CEH certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:20.44698
126	GSEC	GSEC	GSEC certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:20.482778
127	AZURE	Microsoft Azure Security Engineer Associate	Microsoft Azure Security Engineer Associate certification	Microsoft	Associate	Cybersecurity	2 years	Relevant experience recommended	2025-05-31 23:18:20.519075
129	TOGA-SABS	TOGAF or SABSA Foundation	TOGAF or SABSA Foundation certification	Various	Foundation	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:20.716792
130	CYBERSECURITY	Microsoft Cybersecurity Architect Expert	Microsoft Cybersecurity Architect Expert certification	Microsoft	Expert	Security Architecture	2 years	Relevant experience recommended	2025-05-31 23:18:20.754506
131	CISSPIS	CISSP-ISSAP	CISSP-ISSAP certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:20.792148
132	GIAC-ENTERPRISE	GIAC Enterprise Security Architect (GSEA)	GIAC Enterprise Security Architect (GSEA) certification	GIAC	Expert	Security Architecture	4 years	Relevant experience recommended	2025-05-31 23:18:20.834216
133	AWS-CERTIFIEDSECURITYSPECIALTY	AWS Certified Security – Specialty	AWS Certified Security – Specialty certification	Amazon Web Services	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:20.875289
134	CISS-CCSP	CISSP-ISSAP or CCSP	CISSP-ISSAP or CCSP certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:20.912406
136	CGEIT	CGEIT	CGEIT certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:21.112182
137	MBA-WITH	MBA with Cybersecurity or Systems focus	MBA with Cybersecurity or Systems focus certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:21.15068
140	SECU-CODI	Secure Coding Course (Java/C#)	Secure Coding Course (Java/C#) certification	Various	Professional	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:21.534221
141	GITH-CI/C	GitHub/GitLab CI/CD Basics	GitHub/GitLab CI/CD Basics certification	Various	Foundation	Cybersecurity	3 years	Relevant experience recommended	2025-05-31 23:18:21.577901
143	GIAC-GSSP	GIAC GSSP (Java/.NET)	GIAC GSSP (Java/.NET) certification	GIAC	Professional	Cybersecurity	4 years	Relevant experience recommended	2025-05-31 23:18:21.774775
145	ISC2-CSSLP	Certified Secure Software Lifecycle Professional	Secure software development lifecycle certification	ISC2	Professional	Secure Development	3 years	Software development experience	2025-05-31 23:54:18.968476
146	OS-OSWE	Offensive Security Web Expert	Advanced web application penetration testing	Offensive Security	Expert	Web Application Security	3 years	OSCP or equivalent	2025-05-31 23:54:18.968476
147	GIAC-GWAPT	GIAC Web Application Penetration Tester	Web application security testing certification	GIAC	Professional	Web Application Security	4 years	SEC542 or equivalent	2025-05-31 23:54:18.968476
148	OWASP-DEVSECOPS	OWASP DevSecOps Practitioner	DevSecOps and secure development practices	OWASP	Professional	DevSecOps	2 years	Development experience	2025-05-31 23:54:18.968476
149	SABSA-FOUND	SABSA Foundation	Security architecture framework certification	SABSA	Professional	Security Architecture	3 years	Security experience	2025-05-31 23:54:18.968476
150	THREAT-MODEL-PRO	Threat Modeling Professional	Professional threat modeling certification	Various	Professional	Threat Modeling	3 years	Security architecture experience	2025-05-31 23:54:18.968476
151	CKAD	Certified Kubernetes Application Developer	Kubernetes application development certification	CNCF	Professional	Container Security	3 years	Kubernetes experience	2025-05-31 23:54:18.968476
152	SECURE-CODE-JAVA	Secure Coding Course (Java/C#)	Secure coding practices for Java and C#	Various	Foundation	Secure Development	2 years	Programming experience	2025-05-31 23:54:18.968476
153	GITHUB-CICD	GitHub/GitLab CI/CD Basics	CI/CD pipeline security basics	GitHub/GitLab	Foundation	DevOps	2 years	Basic development experience	2025-05-31 23:54:18.968476
154	GIAC-GSSP-JAVA	GIAC GSSP (Java/.NET)	GIAC secure software programmer for Java/.NET	GIAC	Professional	Secure Development	4 years	Programming experience	2025-05-31 23:54:18.968476
155	CIAM-IMI	CIAM – Identity Management Institute	Certified Identity and Access Manager	Identity Management Institute	Foundation	Identity Management	3 years	Basic IAM knowledge	2025-05-31 23:55:47.397651
156	CIMP	Certified Identity Management Professional	Professional identity management certification	Identity Management Institute	Professional	Identity Management	3 years	IAM experience	2025-05-31 23:55:47.397651
157	GIAC-GDSA	GIAC Defending Advanced Threats	Advanced threat defense and security analytics	GIAC	Professional	Advanced Threat Defense	4 years	SEC503 or equivalent	2025-05-31 23:55:47.397651
158	ISC2-CIAM	ISC² CIAM	ISC2 Certified Identity and Access Manager	ISC2	Professional	Identity Management	3 years	IAM experience	2025-05-31 23:55:47.397651
159	AWS-IDENTITY	AWS Identity Specialty	AWS identity and access management specialty	Amazon Web Services	Professional	Cloud Identity	3 years	AWS experience	2025-05-31 23:55:47.397651
160	FORGEROCK-CERT	ForgeRock/Okta/Ping certs	Identity platform vendor certifications	Various	Professional	Identity Platforms	2 years	Platform experience	2025-05-31 23:55:47.397651
161	GIAC-GCSA-IAM	GIAC GCSA	GIAC certified security architect	GIAC	Professional	Security Architecture	4 years	Security architecture experience	2025-05-31 23:55:47.397651
162	CAMS	Certified Access Management Specialist	Access management specialist certification	Various	Professional	Access Management	3 years	Access management experience	2025-05-31 23:55:47.397651
163	MBA-INFOSEC	MBA with InfoSec or Digital Transformation Focus	Graduate business degree with security focus	Various	Executive	Business/Technology	N/A	Graduate admission requirements	2025-05-31 23:55:47.397651
164	ISA-62443-FUND	ISA/IEC 62443 Cybersecurity Fundamentals Specialist	Industrial cybersecurity fundamentals certification	ISA	Foundation	OT Security	3 years	Basic industrial systems knowledge	2025-06-01 00:00:23.987959
165	GIAC-GICSP	GIAC Critical Infrastructure Protection	Critical infrastructure protection certification	GIAC	Professional	Critical Infrastructure	4 years	ICS/SCADA experience	2025-06-01 00:00:23.987959
166	ISA-62443-RISK	ISA/IEC 62443 Risk Assessment Specialist	Industrial control systems risk assessment	ISA	Professional	OT Risk Assessment	3 years	Risk assessment experience	2025-06-01 00:00:23.987959
167	CSSA	Certified SCADA Security Architect	SCADA systems security architecture	Various	Professional	SCADA Security	3 years	SCADA experience	2025-06-01 00:00:23.987959
168	GIAC-GRID	GIAC Response and Industrial Defense	Industrial control systems incident response	GIAC	Professional	Industrial Defense	4 years	ICS incident response experience	2025-06-01 00:00:23.987959
169	ISA-62443-DESIGN	ISA/IEC 62443 Design Specialist	Industrial control systems security design	ISA	Professional	OT Design	3 years	Control systems design experience	2025-06-01 00:00:23.987959
170	MS-SC-100	Microsoft SC-100	Microsoft Cybersecurity Architect Expert	Microsoft	Expert	Security Architecture	2 years	Azure security experience	2025-06-01 00:00:23.987959
171	GIAC-GCIP	GIAC Critical Infrastructure Protection	Advanced critical infrastructure protection	GIAC	Expert	Critical Infrastructure	4 years	Advanced ICS experience	2025-06-01 00:00:23.987959
172	ISA-62443-EXPERT	ISA/IEC 62443 Expert	Expert level industrial cybersecurity certification	ISA	Expert	OT Security Expert	3 years	Extensive OT security experience	2025-06-01 00:00:23.987959
173	MBA-INFRA	MBA with Cybersecurity or Infrastructure Focus	Graduate business degree with infrastructure focus	Various	Executive	Business/Infrastructure	N/A	Graduate admission requirements	2025-06-01 00:00:23.987959
174	COMP-CTT	CompTIA CTT+	Certified Technical Trainer certification	CompTIA	Professional	Training & Education	3 years	Training experience	2025-06-01 00:06:34.52214
175	EC-CCT	EC-Council Certified Cybersecurity Technician	Entry-level cybersecurity technician certification	EC-Council	Foundation	Cybersecurity Fundamentals	3 years	Basic IT knowledge	2025-06-01 00:06:34.52214
176	ADULT-LEARNING	Fundamentals of Adult Learning	Adult learning principles and methodologies	Various	Foundation	Education	2 years	Teaching interest	2025-06-01 00:06:34.52214
177	ATD-INST-DESIGN	Instructional Design Certificate (ATD)	Association for Talent Development instructional design	ATD	Professional	Instructional Design	3 years	Training experience	2025-06-01 00:06:34.52214
178	SANS-INSTRUCTOR	SANS Instructor Certification	SANS certified instructor for cybersecurity training	SANS/GIAC	Professional	Cybersecurity Training	2 years	Subject matter expertise	2025-06-01 00:06:34.52214
179	PMP	Project Management Professional	Professional project management certification	PMI	Professional	Project Management	3 years	Project management experience	2025-06-01 00:06:34.52214
180	UPCEA-INST	Instructional Design for Higher Ed (UPCEA)	University Professional and Continuing Education Association	UPCEA	Professional	Higher Education	3 years	Higher education experience	2025-06-01 00:06:34.52214
181	DOD-8570	DOD 8570/NIST NICE Credential	Department of Defense cybersecurity workforce standards	DoD/NIST	Professional	Government Standards	3 years	Government sector experience	2025-06-01 00:06:34.52214
182	PGMP	Program Management Professional	Professional program management certification	PMI	Expert	Program Management	3 years	Program management experience	2025-06-01 00:06:34.52214
183	ACE-LEADERSHIP	Academic Leadership Certificate (ACE)	American Council on Education leadership certification	ACE	Expert	Academic Leadership	5 years	Academic experience	2025-06-01 00:06:34.52214
184	ANSI-CRED	Credentialing Standards Training (ANSI/ISO/CAE-CD)	Credentialing and certification standards training	ANSI	Expert	Credentialing Standards	3 years	Assessment and credentialing experience	2025-06-01 00:06:34.52214
185	DOCTORATE-EDU	Doctorate or MBA in Education/Cybersecurity/Workforce Policy	Advanced degree in education, cybersecurity, or workforce development	Various	Executive	Education/Policy	N/A	Graduate admission requirements	2025-06-01 00:06:34.52214
186	CAPM	Certified Associate in Project Management	Entry-level project management certification covering fundamental knowledge and terminology	Project Management Institute (PMI)	Associate	Project Management	\N	\N	2025-06-01 00:19:31.590046
187	COMPTIA-PROJECT-PLUS	CompTIA Project+	Vendor-neutral project management certification covering project lifecycle and methodologies	CompTIA	Professional	Project Management	\N	\N	2025-06-01 00:19:31.590046
188	GOOGLE-PM-CERT	Google Project Management Certificate	Professional certificate program covering project management fundamentals and tools	Google Career Certificates	Professional	Project Management	\N	\N	2025-06-01 00:19:31.590046
189	CSM	Certified ScrumMaster	Agile project management certification focusing on Scrum framework and methodology	Scrum Alliance	Professional	Agile Management	\N	\N	2025-06-01 00:19:31.590046
190	SAFE-AGILIST	SAFe Agilist	Certification for implementing Lean-Agile practices at enterprise scale	Scaled Agile	Professional	Agile Management	\N	\N	2025-06-01 00:19:31.590046
191	NIST-CSF-PRACTITIONER	NIST Cybersecurity Framework Practitioner	Certification for implementing and managing cybersecurity framework practices	NIST	Professional	Risk Management	\N	\N	2025-06-01 00:19:31.590046
192	PMI-ACP	PMI Agile Certified Practitioner	Agile project management certification covering multiple agile methodologies	Project Management Institute (PMI)	Professional	Agile Management	\N	\N	2025-06-01 00:19:31.590046
193	PFMP	Portfolio Management Professional	Advanced certification for portfolio management and strategic alignment	Project Management Institute (PMI)	Expert	Portfolio Management	\N	\N	2025-06-01 00:19:31.590046
194	SAFE-PC	SAFe Program Consultant	Advanced certification for implementing SAFe at program and portfolio levels	Scaled Agile	Expert	Agile Management	\N	\N	2025-06-01 00:19:31.590046
195	ISO-21500-GOVERNANCE	ISO 21500 Project Governance Training	Training certification for project governance standards and best practices	ISO	Professional	Project Management	\N	\N	2025-06-01 00:19:31.590046
\.


--
-- Data for Name: import_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.import_history (id, filename, import_type, records_imported, status, metadata, created_at) FROM stdin;
4	Tasks.xlsx	tasks	0	pending	{"fileSize": 43613, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}	2025-05-27 01:43:59.295458
5	Tasks.xlsx	tasks	0	pending	{"fileSize": 43613, "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}	2025-05-27 01:47:05.669579
6	cybersecurity-certifications.js	CERTIFICATIONS	29	SUCCESS	{"levels": ["Foundation", "Associate", "Expert", "Professional"], "domains": ["General", "Technical", "Management", "Governance"], "issuers": ["CompTIA", "ISC2", "EC-Council", "GIAC", "Cisco", "Microsoft", "Amazon Web Services", "ISACA", "Cloud Security Alliance", "NIST", "Information Security Forum"]}	2025-05-30 14:07:25.070782
\.


--
-- Data for Name: knowledge_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.knowledge_items (id, code, description, created_at) FROM stdin;
1232	K0018	Knowledge of encryption algorithms	2025-05-27 03:09:49.280296
1233	K0055	Knowledge of microprocessors	2025-05-27 03:09:49.280296
1234	K0064	Knowledge of performance tuning tools and techniques	2025-05-27 03:09:49.280296
1235	K0068	Knowledge of programming language structures and logic	2025-05-27 03:09:49.280296
1236	K0092	Knowledge of technology integration processes	2025-05-27 03:09:49.280296
1237	K0159	Knowledge of Voice over IP (VoIP)	2025-05-27 03:09:49.280296
1238	K0176	Knowledge of Extensible Markup Language (XML) schemas	2025-05-27 03:09:49.280296
1239	K0375	Knowledge of wireless applications vulnerabilities	2025-05-27 03:09:49.280296
1240	K0470	Knowledge of Internet and routing protocols	2025-05-27 03:09:49.280296
1241	K0476	Knowledge of language processing tools and techniques	2025-05-27 03:09:49.280296
1242	K0480	Knowledge of malware	2025-05-27 03:09:49.280296
1243	K0498	Knowledge of operational planning processes	2025-05-27 03:09:49.280296
1244	K0635	Knowledge of decryption	2025-05-27 03:09:49.280296
1245	K0636	Knowledge of decryption tools and techniques	2025-05-27 03:09:49.280296
1246	K0637	Knowledge of data repositories	2025-05-27 03:09:49.280296
1247	K0638	Knowledge of security awareness programs	2025-05-27 03:09:49.280296
1248	K0639	Knowledge of code tailoring tools and techniques	2025-05-27 03:09:49.280296
1249	K0640	Knowledge of the organizational cybersecurity workforce	2025-05-27 03:09:49.280296
1250	K0641	Knowledge of market research tools and techniques	2025-05-27 03:09:49.280296
1251	K0642	Knowledge of pricing structures	2025-05-27 03:09:49.280296
1252	K0643	Knowledge of virtual learning environments	2025-05-27 03:09:49.280296
1253	K0644	Knowledge of cybersecurity operation policies and procedures	2025-05-27 03:09:49.280296
1254	K0645	Knowledge of standard operating procedures (SOPs)	2025-05-27 03:09:49.280296
1255	K0646	Knowledge of system optimization techniques	2025-05-27 03:09:49.280296
1256	K0647	Knowledge of data visualization tools and techniques	2025-05-27 03:09:49.280296
1257	K0648	Knowledge of career paths	2025-05-27 03:09:49.280296
1258	K0649	Knowledge of organizational career progressions	2025-05-27 03:09:49.280296
1259	K0650	Knowledge of supplier assessment criteria	2025-05-27 03:09:49.280296
1260	K0651	Knowledge of trustworthiness principles	2025-05-27 03:09:49.280296
1261	K0652	Knowledge of workforce trends	2025-05-27 03:09:49.280296
1262	K0653	Knowledge of cybersecurity practices in the acquisition process	2025-05-27 03:09:49.280296
1263	K0654	Knowledge of target audience requirements	2025-05-27 03:09:49.280296
1264	K0655	Knowledge of intelligence fusion	2025-05-27 03:09:49.280296
1265	K0656	Knowledge of network collection tools and techniques	2025-05-27 03:09:49.280296
1266	K0657	Knowledge of network collection policies and procedures	2025-05-27 03:09:49.280296
1267	K0658	Knowledge of cognitive biases	2025-05-27 03:09:49.280296
1268	K0659	Knowledge of information privacy technologies	2025-05-27 03:09:49.280296
1269	K0660	Knowledge of appropriate use policies and procedures	2025-05-27 03:09:49.280296
1270	K0661	Knowledge of reauthorization processes	2025-05-27 03:09:49.280296
1271	K0662	Knowledge of systems security engineering	2025-05-27 03:09:49.280296
1272	K0663	Knowledge of industry standards and best practices	2025-05-27 03:09:49.280296
1273	K0664	Knowledge of stakeholder management	2025-05-27 03:09:49.280296
1274	K0666	Knowledge of system security plans	2025-05-27 03:09:49.280296
1275	K0667	Knowledge of contracts	2025-05-27 03:09:49.280296
1276	K0668	Knowledge of contract management	2025-05-27 03:09:49.280296
1277	K0669	Knowledge of contractor management	2025-05-27 03:09:49.280296
1278	K0670	Knowledge of life cycle development milestones	2025-05-27 03:09:49.280296
1279	K0671	Knowledge of Communications Security (COMSEC) policies and procedures	2025-05-27 03:09:49.280296
1280	K0672	Knowledge of the Communications Security (COMSEC) Material Control System (CMCS)	2025-05-27 03:09:49.280296
1281	K0673	Knowledge of types of Communications Security (COMSEC) incidents	2025-05-27 03:09:49.280296
1282	K0674	Knowledge of computer networking protocols	2025-05-27 03:09:49.280296
1283	K0675	Knowledge of risk management processes	2025-05-27 03:09:49.280296
1284	K0676	Knowledge of cybersecurity laws and regulations	2025-05-27 03:09:49.280296
1285	K0677	Knowledge of cybersecurity policies and procedures	2025-05-27 03:09:49.280296
1286	K0678	Knowledge of privacy laws and regulations	2025-05-27 03:09:49.280296
1287	K0679	Knowledge of privacy policies and procedures	2025-05-27 03:09:49.280296
1288	K0680	Knowledge of cybersecurity principles and practices	2025-05-27 03:09:49.280296
1289	K0681	Knowledge of privacy principles and practices	2025-05-27 03:09:49.280296
1290	K0682	Knowledge of cybersecurity threats	2025-05-27 03:09:49.280296
1291	K0683	Knowledge of cybersecurity vulnerabilities	2025-05-27 03:09:49.280296
1292	K0684	Knowledge of cybersecurity threat characteristics	2025-05-27 03:09:49.280296
1293	K0685	Knowledge of access control principles and practices	2025-05-27 03:09:49.280296
1294	K0686	Knowledge of authentication and authorization tools and techniques	2025-05-27 03:09:49.280296
1295	K0687	Knowledge of business operations standards and best practices	2025-05-27 03:09:49.280296
1296	K0688	Knowledge of common application vulnerabilities	2025-05-27 03:09:49.280296
1297	K0689	Knowledge of network infrastructure principles and practices	2025-05-27 03:09:49.280296
1298	K0690	Knowledge of requirements analysis principles and practices	2025-05-27 03:09:49.280296
1299	K0691	Knowledge of cyber defense tools and techniques	2025-05-27 03:09:49.280296
1300	K0692	Knowledge of vulnerability assessment tools and techniques	2025-05-27 03:09:49.280296
1301	K0693	Knowledge of complex data structure capabilities and applications	2025-05-27 03:09:49.280296
1302	K0694	Knowledge of computer algorithm capabilities and applications	2025-05-27 03:09:49.280296
1303	K0695	Knowledge of programming principles and practices	2025-05-27 03:09:49.280296
1304	K0696	Knowledge of digital forensic data principles and practices	2025-05-27 03:09:49.280296
1305	K0697	Knowledge of encryption algorithm capabilities and applications	2025-05-27 03:09:49.280296
1306	K0698	Knowledge of cryptographic key management principles and practices	2025-05-27 03:09:49.280296
1307	K0699	Knowledge of data administration policies and procedures	2025-05-27 03:09:49.280296
1308	K0700	Knowledge of data standardization policies and procedures	2025-05-27 03:09:49.280296
1309	K0701	Knowledge of data backup and recovery policies and procedures	2025-05-27 03:09:49.280296
1310	K0702	Knowledge of data warehousing principles and practices	2025-05-27 03:09:49.280296
1311	K0703	Knowledge of data mining principles and practices	2025-05-27 03:09:49.280296
1312	K0704	Knowledge of database management system (DBMS) principles and practices	2025-05-27 03:09:49.280296
1313	K0705	Knowledge of database query language capabilities and applications	2025-05-27 03:09:49.280296
1314	K0706	Knowledge of database schema capabilities and applications	2025-05-27 03:09:49.280296
1315	K0707	Knowledge of database systems and software	2025-05-27 03:09:49.280296
1316	K0708	Knowledge of digital rights management (DRM) tools and techniques	2025-05-27 03:09:49.280296
1317	K0709	Knowledge of business continuity and disaster recovery (BCDR) policies and procedures	2025-05-27 03:09:49.280296
1318	K0710	Knowledge of enterprise cybersecurity architecture principles and practices	2025-05-27 03:09:49.280296
1319	K0711	Knowledge of evaluation and validation principles and practices	2025-05-27 03:09:49.280296
1320	K0712	Knowledge of Local Area Networks (LAN)	2025-05-27 03:09:49.280296
1321	K0713	Knowledge of Wide Area Networks (WAN)	2025-05-27 03:09:49.280296
1322	K0714	Knowledge of electrical engineering principles and practices	2025-05-27 03:09:49.280296
1323	K0715	Knowledge of resiliency and redundancy principles and practices	2025-05-27 03:09:49.280296
1324	K0716	Knowledge of host access control (HAC) systems and software	2025-05-27 03:09:49.280296
1325	K0717	Knowledge of network access control (NAC) systems and software	2025-05-27 03:09:49.280296
1326	K0718	Knowledge of network communications principles and practices	2025-05-27 03:09:49.280296
1327	K0719	Knowledge of human-computer interaction (HCI) principles and practices	2025-05-27 03:09:49.280296
1328	K0720	Knowledge of Security Assessment and Authorization (SA&A) processes	2025-05-27 03:09:49.280296
1329	K0721	Knowledge of risk management principles and practices	2025-05-27 03:09:49.280296
1330	K0722	Knowledge of software development principles and practices	2025-05-27 03:09:49.280296
1331	K0723	Knowledge of vulnerability data sources	2025-05-27 03:09:49.280296
1332	K0724	Knowledge of incident response principles and practices	2025-05-27 03:11:49.77183
1333	K0725	Knowledge of incident response tools and techniques	2025-05-27 03:11:49.77183
1334	K0726	Knowledge of incident handling tools and techniques	2025-05-27 03:11:49.77183
1335	K0727	Knowledge of analysis standards and best practices	2025-05-27 03:11:49.77183
1336	K0728	Knowledge of Confidentiality, Integrity and Availability (CIA) principles and practices	2025-05-27 03:11:49.77183
1337	K0729	Knowledge of non-repudiation principles and practices	2025-05-27 03:11:49.77183
1338	K0730	Knowledge of cyber safety principles and practices	2025-05-27 03:11:49.77183
1339	K0731	Knowledge of systems security engineering (SSE) principles and practices	2025-05-27 03:11:49.77183
1340	K0732	Knowledge of intrusion detection tools and techniques	2025-05-27 03:11:49.77183
1341	K0733	Knowledge of information technology (IT) architecture models and frameworks	2025-05-27 03:11:49.77183
1342	K0734	Knowledge of Risk Management Framework (RMF) requirements	2025-05-27 03:11:49.77183
1343	K0735	Knowledge of risk management models and frameworks	2025-05-27 03:11:49.77183
1344	K0736	Knowledge of information technology (IT) security principles and practices	2025-05-27 03:11:49.77183
1345	K0737	Knowledge of bandwidth management tools and techniques	2025-05-27 03:11:49.77183
1346	K0738	Knowledge of low-level programming languages	2025-05-27 03:11:49.77183
1347	K0739	Knowledge of mathematics principles and practices	2025-05-27 03:11:49.77183
1348	K0740	Knowledge of system performance indicators	2025-05-27 03:11:49.77183
1349	K0741	Knowledge of system availability measures	2025-05-27 03:11:49.77183
1350	K0742	Knowledge of identity and access management (IAM) principles and practices	2025-05-27 03:11:49.77183
1351	K0743	Knowledge of new and emerging technologies	2025-05-27 03:11:49.77183
1352	K0744	Knowledge of operating system (OS) systems and software	2025-05-27 03:11:49.77183
1353	K0745	Knowledge of parallel and distributed computing principles and practices	2025-05-27 03:11:49.77183
1354	K0746	Knowledge of policy-based access controls	2025-05-27 03:11:49.77183
1355	K0747	Knowledge of Risk Adaptive (Adaptable) Access Controls (RAdAC)	2025-05-27 03:11:49.77183
1356	K0748	Knowledge of Privacy Impact Assessment (PIA) principles and practices	2025-05-27 03:11:49.77183
1357	K0749	Knowledge of process engineering principles and practices	2025-05-27 03:11:49.77183
1358	K0750	Knowledge of query languages	2025-05-27 03:11:49.77183
1359	K0751	Knowledge of system threats	2025-05-27 03:11:49.77183
1360	K0752	Knowledge of system vulnerabilities	2025-05-27 03:11:49.77183
1361	K0753	Knowledge of remote access principles and practices	2025-05-27 03:11:49.77183
1362	K0754	Knowledge of resource management principles and practices	2025-05-27 03:11:49.77183
1363	K0755	Knowledge of configuration management (CM) tools and techniques	2025-05-27 03:11:49.77183
1364	K0756	Knowledge of security management principles and practices	2025-05-27 03:11:49.77183
1365	K0757	Knowledge of system design tools and techniques	2025-05-27 03:11:49.77183
1366	K0758	Knowledge of server administration principles and practices	2025-05-27 03:11:49.77183
1367	K0759	Knowledge of client and server architecture	2025-05-27 03:11:49.77183
1368	K0760	Knowledge of server diagnostic tools and techniques	2025-05-27 03:11:49.77183
1369	K0761	Knowledge of Fault Detection and Diagnostics (FDD) tools and techniques	2025-05-27 03:11:49.77183
1370	K0762	Knowledge of software debugging principles and practices	2025-05-27 03:11:49.77183
1371	K0763	Knowledge of software design tools and techniques	2025-05-27 03:11:49.77183
1372	K0764	Knowledge of software development models and frameworks	2025-05-27 03:11:49.77183
1373	K0765	Knowledge of software engineering principles and practices	2025-05-27 03:11:49.77183
1374	K0766	Knowledge of data asset management principles and practices	2025-05-27 03:11:49.77183
1375	K0767	Knowledge of structured analysis principles and practices	2025-05-27 03:11:49.77183
1376	K0768	Knowledge of automated systems analysis tools and techniques	2025-05-27 03:11:49.77183
1377	K0769	Knowledge of system design standards and best practices	2025-05-27 03:11:49.77183
1378	K0770	Knowledge of system administration principles and practices	2025-05-27 03:11:49.77183
1379	K0771	Knowledge of system life cycle management principles and practices	2025-05-27 03:11:49.77183
1380	K0772	Knowledge of systems testing and evaluation tools and techniques	2025-05-27 03:11:49.77183
1381	K0773	Knowledge of telecommunications principles and practices	2025-05-27 03:11:49.77183
1382	K0774	Knowledge of content creation tools and techniques	2025-05-27 03:11:49.77183
1383	K0775	Knowledge of information management tools and techniques	2025-05-27 03:11:49.77183
1384	K0776	Knowledge of collaboration tools and techniques	2025-05-27 03:11:49.77183
1385	K0777	Knowledge of data storage media characteristics	2025-05-27 03:11:49.77183
1386	K0778	Knowledge of enterprise information technology (IT) architecture principles and practices	2025-05-27 03:11:49.77183
1387	K0779	Knowledge of systems engineering processes	2025-05-27 03:11:49.77183
1388	K0780	Knowledge of hardware maintenance policies and procedures	2025-05-27 03:11:49.77183
1389	K0781	Knowledge of virtual private network (VPN) systems and software	2025-05-27 03:11:49.77183
1390	K0782	Knowledge of web service protocols	2025-05-27 03:11:49.77183
1391	K0783	Knowledge of network attack characteristics	2025-05-27 03:11:49.77183
1392	K0784	Knowledge of insider threat laws and regulations	2025-05-27 03:11:49.77183
1393	K0785	Knowledge of insider threat tools and techniques	2025-05-27 03:11:49.77183
1394	K0786	Knowledge of physical computer components	2025-05-27 03:11:49.77183
1395	K0787	Knowledge of computer peripherals	2025-05-27 03:11:49.77183
1396	K0788	Knowledge of adversarial tactics principles and practices	2025-05-27 03:11:49.77183
1397	K0789	Knowledge of adversarial tactics tools and techniques	2025-05-27 03:11:49.77183
1398	K0790	Knowledge of adversarial tactics policies and procedures	2025-05-27 03:11:49.77183
1399	K0791	Knowledge of defense-in-depth principles and practices	2025-05-27 03:11:49.77183
1400	K0792	Knowledge of network configurations	2025-05-27 03:11:49.77183
1401	K0793	Knowledge of file extensions	2025-05-27 03:11:49.77183
1402	K0794	Knowledge of file system implementation principles and practices	2025-05-27 03:11:49.77183
1403	K0795	Knowledge of digital evidence seizure policies and procedures	2025-05-27 03:11:49.77183
1404	K0796	Knowledge of digital evidence preservation policies and procedures	2025-05-27 03:11:49.77183
1405	K0797	Knowledge of ethical hacking tools and techniques	2025-05-27 03:11:49.77183
1406	K0798	Knowledge of program management principles and practices	2025-05-27 03:11:49.77183
1407	K0799	Knowledge of project management principles and practices	2025-05-27 03:11:49.77183
1408	K0800	Knowledge of evidence admissibility laws and regulations	2025-05-27 03:11:49.77183
1409	K0801	Knowledge of cognitive domain models and frameworks	2025-05-27 03:11:49.77183
1410	K0802	Knowledge of chain of custody policies and procedures	2025-05-27 03:11:49.77183
1411	K0803	Knowledge of supply chain risk management principles and practices	2025-05-27 03:11:49.77183
1412	K0804	Knowledge of persistent data principles and practices	2025-05-27 03:11:49.77183
1413	K0805	Knowledge of command-line tools and techniques	2025-05-27 03:11:49.77183
1414	K0806	Knowledge of machine virtualization tools and techniques	2025-05-27 03:11:49.77183
1415	K0807	Knowledge of web mail tools and techniques	2025-05-27 03:11:49.77183
1416	K0808	Knowledge of system file characteristics	2025-05-27 03:11:49.77183
1417	K0809	Knowledge of digital forensics data characteristics	2025-05-27 03:11:49.77183
1418	K0810	Knowledge of deployable forensics principles and practices	2025-05-27 03:11:49.77183
1419	K0811	Knowledge of web filtering systems and software	2025-05-27 03:11:49.77183
1420	K0812	Knowledge of digital communication systems and software	2025-05-27 03:11:49.77183
1421	K0813	Knowledge of interpreted and compiled programming language characteristics	2025-05-27 03:11:49.77183
1422	K0814	Knowledge of secure coding tools and techniques	2025-05-27 03:11:49.77183
1423	K0815	Knowledge of intelligence collection management processes	2025-05-27 03:11:49.77183
1424	K0816	Knowledge of front-end intelligence collection systems and software	2025-05-27 03:11:49.77183
1425	K0817	Knowledge of event correlation tools and techniques	2025-05-27 03:11:49.77183
1426	K0818	Knowledge of new and emerging cybersecurity risks	2025-05-27 03:11:49.77183
1427	K0819	Knowledge of import and export control laws and regulations	2025-05-27 03:11:49.77183
1428	K0820	Knowledge of supply chain risks	2025-05-27 03:11:49.77183
1429	K0821	Knowledge of federal agency roles and responsibilities	2025-05-27 03:11:49.77183
1430	K0822	Knowledge of risk tolerance principles and practices	2025-05-27 03:11:49.77183
1431	K0823	Knowledge of incident response policies and procedures	2025-05-27 03:11:49.77183
1432	K0824	Knowledge of incident response roles and responsibilities	2025-05-27 03:14:40.269987
1433	K0825	Knowledge of threat vector characteristics	2025-05-27 03:14:40.269987
1434	K0826	Knowledge of software security principles and practices	2025-05-27 03:14:40.269987
1435	K0827	Knowledge of software quality assurance (SQA) principles and practices	2025-05-27 03:14:40.269987
1436	K0828	Knowledge of supply chain risk management standards and best practices	2025-05-27 03:14:40.269987
1437	K0829	Knowledge of account creation policies and procedures	2025-05-27 03:14:40.269987
1438	K0830	Knowledge of password policies and procedures	2025-05-27 03:14:40.269987
1439	K0831	Knowledge of network attack vectors	2025-05-27 03:14:40.269987
1440	K0832	Knowledge of cyberattack characteristics	2025-05-27 03:14:40.269987
1441	K0833	Knowledge of cyberattack actor characteristics	2025-05-27 03:14:40.269987
1442	K0834	Knowledge of technology procurement principles and practices	2025-05-27 03:14:40.269987
1443	K0835	Knowledge of risk assessment principles and practices	2025-05-27 03:14:40.269987
1444	K0836	Knowledge of threat assessment principles and practices	2025-05-27 03:14:40.269987
1445	K0837	Knowledge of hardening tools and techniques	2025-05-27 03:14:40.269987
1446	K0838	Knowledge of supply chain risk management policies and procedures	2025-05-27 03:14:40.269987
1447	K0839	Knowledge of critical infrastructure systems and software	2025-05-27 03:14:40.269987
1448	K0840	Knowledge of hardware reverse engineering tools and techniques	2025-05-27 03:14:40.269987
1449	K0841	Knowledge of middleware software capabilities and applications	2025-05-27 03:14:40.269987
1450	K0842	Knowledge of software reverse engineering tools and techniques	2025-05-27 03:14:40.269987
1451	K0844	Knowledge of cyberattack stages	2025-05-27 03:14:40.269987
1452	K0845	Knowledge of cyber intrusion activity phases	2025-05-27 03:14:40.269987
1453	K0846	Knowledge of secure software deployment principles and practices	2025-05-27 03:14:40.269987
1454	K0847	Knowledge of secure software deployment tools and techniques	2025-05-27 03:14:40.269987
1455	K0848	Knowledge of network systems management principles and practices	2025-05-27 03:14:40.269987
1456	K0849	Knowledge of network systems management tools and techniques	2025-05-27 03:14:40.269987
1457	K0850	Knowledge of data carving tools and techniques	2025-05-27 03:14:40.269987
1458	K0851	Knowledge of reverse engineering principles and practices	2025-05-27 03:14:40.269987
1459	K0852	Knowledge of anti-forensics tools and techniques	2025-05-27 03:14:40.269987
1460	K0853	Knowledge of forensics lab design principles and practices	2025-05-27 03:14:40.269987
1461	K0854	Knowledge of forensics lab design systems and software	2025-05-27 03:14:40.269987
1462	K0855	Knowledge of debugging tools and techniques	2025-05-27 03:14:40.269987
1463	K0856	Knowledge of filename extension abuse	2025-05-27 03:14:40.269987
1464	K0857	Knowledge of malware analysis tools and techniques	2025-05-27 03:14:40.269987
1465	K0858	Knowledge of virtual machine detection tools and techniques	2025-05-27 03:14:40.269987
1466	K0859	Knowledge of encryption tools and techniques	2025-05-27 03:14:40.269987
1467	K0860	Knowledge of malware signature principles and practices	2025-05-27 03:14:40.269987
1468	K0861	Knowledge of network port capabilities and applications	2025-05-27 03:14:40.269987
1469	K0862	Knowledge of data remediation tools and techniques	2025-05-27 03:14:40.269987
1470	K0863	Knowledge of cloud computing principles and practices	2025-05-27 03:14:40.269987
1471	K0864	Knowledge of knowledge management principles and practices	2025-05-27 03:14:40.269987
1472	K0865	Knowledge of data classification standards and best practices	2025-05-27 03:14:40.269987
1473	K0866	Knowledge of data classification tools and techniques	2025-05-27 03:14:40.269987
1474	K0867	Knowledge of database application programming interfaces (APIs)	2025-05-27 03:14:40.269987
1475	K0868	Knowledge of process improvement principles and practices	2025-05-27 03:14:40.269987
1476	K0869	Knowledge of process maturity models and frameworks	2025-05-27 03:14:40.269987
1477	K0870	Knowledge of enterprise architecture (EA) reference models and frameworks	2025-05-27 03:14:40.269987
1478	K0871	Knowledge of enterprise architecture (EA) principles and practices	2025-05-27 03:14:40.269987
1479	K0872	Knowledge of service management principles and practices	2025-05-27 03:14:40.269987
1480	K0873	Knowledge of service management standards and best practices	2025-05-27 03:14:40.269987
1481	K0874	Knowledge of key management service (KMS) principles and practices	2025-05-27 03:14:40.269987
1482	K0875	Knowledge of symmetric encryption principles and practices	2025-05-27 03:14:40.269987
1483	K0876	Knowledge of key management service (KMS) key rotation policies and procedures	2025-05-27 03:14:40.269987
1484	K0877	Knowledge of application firewall principles and practices	2025-05-27 03:14:40.269987
1485	K0878	Knowledge of network firewall principles and practices	2025-05-27 03:14:40.269987
1486	K0879	Knowledge of industry cybersecurity models and frameworks	2025-05-27 03:14:40.269987
1487	K0880	Knowledge of access control models and frameworks	2025-05-27 03:14:40.269987
1488	K0881	Knowledge of learning assessment tools and techniques	2025-05-27 03:14:40.269987
1489	K0882	Knowledge of ethical hacking principles and practices	2025-05-27 03:14:40.269987
1490	K0883	Knowledge of circuit analysis tools and techniques	2025-05-27 03:14:40.269987
1491	K0884	Knowledge of covert communication tools and techniques	2025-05-27 03:14:40.269987
1492	K0885	Knowledge of instructional design principles and practices	2025-05-27 03:14:40.269987
1493	K0886	Knowledge of instructional design models and frameworks	2025-05-27 03:14:40.269987
1494	K0887	Knowledge of training policies and procedures	2025-05-27 03:14:40.269987
1495	K0888	Knowledge of Bloom's Taxonomy learning levels	2025-05-27 03:14:40.269987
1496	K0889	Knowledge of learning management system (LMS) systems and software	2025-05-27 03:14:40.269987
1497	K0890	Knowledge of learning modes	2025-05-27 03:14:40.269987
1498	K0891	Knowledge of the Open Systems Interconnect (OSI) reference model	2025-05-27 03:14:40.269987
1499	K0892	Knowledge of cyber defense laws and regulations	2025-05-27 03:14:40.269987
1500	K0893	Knowledge of training systems and software	2025-05-27 03:14:40.269987
1501	K0894	Knowledge of computer architecture principles and practices	2025-05-27 03:14:40.269987
1502	K0895	Knowledge of taxonomy models and frameworks	2025-05-27 03:14:40.269987
1503	K0896	Knowledge of semantic ontology models and frameworks	2025-05-27 03:14:40.269987
1504	K0897	Knowledge of logging tools and technologies	2025-05-27 03:14:40.269987
1505	K0898	Knowledge of cloud service models and frameworks	2025-05-27 03:14:40.269987
1506	K0899	Knowledge of crisis management protocols	2025-05-27 03:14:40.269987
1507	K0900	Knowledge of crisis management processes	2025-05-27 03:14:40.269987
1508	K0901	Knowledge of crisis management tools and techniques	2025-05-27 03:14:40.269987
1509	K0902	Knowledge of the NIST Workforce Framework for Cybersecurity (NICE Framework)	2025-05-27 03:14:40.269987
1510	K0903	Knowledge of service desk principles and practices	2025-05-27 03:14:40.269987
1511	K0904	Knowledge of machine learning principles and practices	2025-05-27 03:14:40.269987
1512	K0905	Knowledge of media production tool and techniques	2025-05-27 03:14:40.269987
1513	K0906	Knowledge of multi-level security (MLS) systems and software	2025-05-27 03:14:40.269987
1514	K0907	Knowledge of cross-domain solutions	2025-05-27 03:14:40.269987
1515	K0908	Knowledge of human resources policies and procedures	2025-05-27 03:14:40.269987
1516	K0909	Knowledge of abnormal physical and physiological behaviors	2025-05-27 03:14:40.269987
1517	K0910	Knowledge of needs assessment principles and practices	2025-05-27 03:14:40.269987
1518	K0911	Knowledge of remote access tools and techniques	2025-05-27 03:14:40.269987
1519	K0912	Knowledge of sustainment principles and practices	2025-05-27 03:14:40.269987
1520	K0913	Knowledge of sustainment processes	2025-05-27 03:14:40.269987
1521	K0914	Knowledge of binary analysis tools and techniques	2025-05-27 03:14:40.269987
1522	K0915	Knowledge of network architecture principles and practices	2025-05-27 03:14:40.269987
1523	K0916	Knowledge of malware analysis principles and practices	2025-05-27 03:14:40.269987
1524	K0917	Knowledge of Personally Identifiable Information (PII) data security standards and best practices	2025-05-27 03:14:40.269987
1525	K0918	Knowledge of Payment Card Industry (PCI) data security standards and best practices	2025-05-27 03:14:40.269987
1526	K0919	Knowledge of Personal Health Information (PHI) data security standards and best practices	2025-05-27 03:14:40.269987
1527	K0920	Knowledge of risk management policies and procedures	2025-05-27 03:14:40.269987
1528	K0921	Knowledge of program protection plan (PPP) principles and practices	2025-05-27 03:14:40.269987
1529	K0922	Knowledge of the acquisition life cycle models and frameworks	2025-05-27 03:14:40.269987
1530	K0923	Knowledge of operating system structures and internals	2025-05-27 03:14:40.269987
1531	K0924	Knowledge of network analysis tools and techniques	2025-05-27 03:14:40.269987
1532	K0925	Knowledge of wireless communication tools and techniques	2025-05-27 03:16:28.385447
1533	K0926	Knowledge of signal jamming tools and techniques	2025-05-27 03:16:28.385447
1534	K0927	Knowledge of configuration management tools and techniques	2025-05-27 03:16:28.385447
1535	K0928	Knowledge of systems engineering principles and practices	2025-05-27 03:16:28.385447
1536	K0929	Knowledge of content synchronization tools and techniques	2025-05-27 03:16:28.385447
1537	K0930	Knowledge of credential management systems and software	2025-05-27 03:16:28.385447
1538	K0931	Knowledge of data-at-rest encryption (DARE) standards and best practices	2025-05-27 03:16:28.385447
1539	K0932	Knowledge of cryptographic key storage systems and software	2025-05-27 03:16:28.385447
1540	K0933	Knowledge of N-tier architecture principles and practices	2025-05-27 03:16:28.385447
1541	K0934	Knowledge of data classification policies and procedures	2025-05-27 03:16:28.385447
1542	K0935	Knowledge of incident, event, and problem management policies and procedures	2025-05-27 03:16:28.385447
1543	K0936	Knowledge of network hardware threats and vulnerabilities	2025-05-27 03:16:28.385447
1544	K0937	Knowledge of countermeasure design principles and practices	2025-05-27 03:16:28.385447
1545	K0938	Knowledge of network mapping principles and practices	2025-05-27 03:16:28.385447
1546	K0939	Knowledge of packet-level analysis tools and techniques	2025-05-27 03:16:28.385447
1547	K0940	Knowledge of subnet tools and techniques	2025-05-27 03:16:28.385447
1548	K0941	Knowledge of data concealment tools and techniques	2025-05-27 03:16:28.385447
1549	K0942	Knowledge of cryptology principles and practices	2025-05-27 03:16:28.385447
1550	K0943	Knowledge of industry indicators	2025-05-27 03:16:28.385447
1551	K0944	Knowledge of intelligence data gathering principles and practices	2025-05-27 03:16:28.385447
1552	K0945	Knowledge of intelligence data gathering policies and procedures	2025-05-27 03:16:28.385447
1553	K0946	Knowledge of incident reporting policies and procedures	2025-05-27 03:16:28.385447
1554	K0947	Knowledge of computer engineering principles and practices	2025-05-27 03:16:28.385447
1555	K0948	Knowledge of embedded systems and software	2025-05-27 03:16:28.385447
1556	K0949	Knowledge of fault tolerance tools and techniques	2025-05-27 03:16:28.385447
1557	K0950	Knowledge of Intrusion Detection System (IDS) tools and techniques	2025-05-27 03:16:28.385447
1558	K0951	Knowledge of Intrusion Prevention System (IPS) tools and techniques	2025-05-27 03:16:28.385447
1559	K0952	Knowledge of information theory principles and practices	2025-05-27 03:16:28.385447
1560	K0953	Knowledge of data mining tools and techniques	2025-05-27 03:16:28.385447
1561	K0954	Knowledge of foreign disclosure policies and procedures	2025-05-27 03:16:28.385447
1562	K0955	Knowledge of penetration testing principles and practices	2025-05-27 03:16:28.385447
1563	K0956	Knowledge of penetration testing tools and techniques	2025-05-27 03:16:28.385447
1564	K0957	Knowledge of root cause analysis tools and techniques	2025-05-27 03:16:28.385447
1565	K0958	Knowledge of system integration principles and practices	2025-05-27 03:16:28.385447
1566	K0959	Knowledge of operational design principles and practices	2025-05-27 03:16:28.385447
1567	K0960	Knowledge of content management system (CMS) capabilities and applications	2025-05-27 03:16:28.385447
1568	K0961	Knowledge of planning systems and software	2025-05-27 03:16:28.385447
1569	K0962	Knowledge of targeting laws and regulations	2025-05-27 03:16:28.385447
1570	K0963	Knowledge of exploitation laws and regulations	2025-05-27 03:16:28.385447
1571	K0965	Knowledge of language analysis tools and techniques	2025-05-27 03:16:28.385447
1572	K0966	Knowledge of voice analysis tools and techniques	2025-05-27 03:16:28.385447
1573	K0967	Knowledge of graphic materials analysis tools and techniques	2025-05-27 03:16:28.385447
1574	K0968	Knowledge of analytic standards and frameworks	2025-05-27 03:16:28.385447
1575	K0969	Knowledge of cyberattack tools and techniques	2025-05-27 03:16:28.385447
1576	K0970	Knowledge of auditing policies and procedures	2025-05-27 03:16:28.385447
1577	K0971	Knowledge of logging policies and procedures	2025-05-27 03:16:28.385447
1578	K0973	Knowledge of system persistence tools and techniques	2025-05-27 03:16:28.385447
1579	K0977	Knowledge of intelligence collection management tools and techniques	2025-05-27 03:16:28.385447
1580	K0979	Knowledge of information searching tools and techniques	2025-05-27 03:16:28.385447
1581	K0980	Knowledge of intelligence collection sources	2025-05-27 03:16:28.385447
1582	K0983	Knowledge of computer networking principles and practices	2025-05-27 03:16:28.385447
1583	K0984	Knowledge of web security principles and practices	2025-05-27 03:16:28.385447
1584	K0986	Knowledge of target selection criticality factors	2025-05-27 03:16:28.385447
1585	K0987	Knowledge of target selection vulnerability factors	2025-05-27 03:16:28.385447
1586	K0988	Knowledge of active defense tools and techniques	2025-05-27 03:16:28.385447
1587	K0989	Knowledge of intelligence information repositories	2025-05-27 03:16:28.385447
1588	K0990	Knowledge of cyber operations principles and practices	2025-05-27 03:16:28.385447
1589	K0991	Knowledge of database administration principles and practices	2025-05-27 03:16:28.385447
1590	K0992	Knowledge of database maintenance principles and practices	2025-05-27 03:16:28.385447
1591	K0993	Knowledge of deconfliction processes	2025-05-27 03:16:28.385447
1592	K0994	Knowledge of denial and deception tools and techniques	2025-05-27 03:16:28.385447
1593	K0998	Knowledge of Wireless Local Area Network (WLAN) tools and techniques	2025-05-27 03:16:28.385447
1594	K0999	Knowledge of information management principles and practices	2025-05-27 03:16:28.385447
1595	K1000	Knowledge of evasion principles and practices	2025-05-27 03:16:28.385447
1596	K1001	Knowledge of evasion tools and techniques	2025-05-27 03:16:28.385447
1597	K1002	Knowledge of supervisory control and data acquisition (SCADA) systems and software	2025-05-27 03:16:28.385447
1598	K1004	Knowledge of reporting policies and procedures	2025-05-27 03:16:28.385447
1599	K1005	Knowledge of intelligence collection capabilities and applications	2025-05-27 03:16:28.385447
1600	K1007	Knowledge of intelligence requirements tasking systems and software	2025-05-27 03:16:28.385447
1601	K1008	Knowledge of intelligence support activities	2025-05-27 03:16:28.385447
1602	K1009	Knowledge of threat intelligence principles and practices	2025-05-27 03:16:28.385447
1603	K1010	Knowledge of intelligence policies and procedures	2025-05-27 03:16:28.385447
1604	K1011	Knowledge of network addressing principles and practices	2025-05-27 03:16:28.385447
1605	K1012	Knowledge of malware characteristics	2025-05-27 03:16:28.385447
1606	K1014	Knowledge of network security principles and practices	2025-05-27 03:16:28.385447
1607	K1015	Knowledge of network topology principles and practices	2025-05-27 03:16:28.385447
1608	K1016	Knowledge of code obfuscation tools and techniques	2025-05-27 03:16:28.385447
1609	K1017	Knowledge of operational effectiveness assessment principles and practices	2025-05-27 03:16:28.385447
1610	K1019	Knowledge of operations security (OPSEC) principles and practices	2025-05-27 03:16:28.385447
1611	K1020	Knowledge of organization decision support tools and techniques	2025-05-27 03:16:28.385447
1612	K1021	Knowledge of resource and asset readiness reporting policies and procedures	2025-05-27 03:16:28.385447
1613	K1023	Knowledge of network exploitation tools and techniques	2025-05-27 03:16:28.385447
1614	K1024	Knowledge of partnership policies and procedures	2025-05-27 03:16:28.385447
1615	K1025	Knowledge of decision-making policies and procedures	2025-05-27 03:16:28.385447
1616	K1026	Knowledge of requirements submission processes	2025-05-27 03:16:28.385447
1617	K1027	Knowledge of post implementation review (PIR) processes	2025-05-27 03:16:28.385447
1618	K1028	Knowledge of target development principles and practices	2025-05-27 03:16:28.385447
1619	K1030	Knowledge of operational planning tools and techniques	2025-05-27 03:16:28.385447
1620	K1031	Knowledge of risk mitigation tools and techniques	2025-05-27 03:16:28.385447
1621	K1032	Knowledge of satellite-based communication systems and software	2025-05-27 03:16:28.385447
1622	K1033	Knowledge of scripting principles and practices	2025-05-27 03:16:28.385447
1623	K1034	Knowledge of target language	2025-05-27 03:16:28.385447
1624	K1035	Knowledge of target research tools and techniques	2025-05-27 03:16:28.385447
1625	K1045	Knowledge of tasking processes	2025-05-27 03:16:28.385447
1626	K1049	Knowledge of routing protocols	2025-05-27 03:16:28.385447
1627	K1050	Knowledge of critical information requirements	2025-05-27 03:16:28.385447
1628	K1051	Knowledge of collection data flow from origin into repositories and tools	2025-05-27 03:16:28.385447
1629	K1054	Knowledge of red team functions and capabilities	2025-05-27 03:16:28.385447
1630	K1055	Knowledge of digital forensics principles and practices	2025-05-27 03:16:28.385447
1631	K1056	Knowledge of language analysis principles and practices	2025-05-27 03:16:28.385447
1632	K1059	Knowledge of request for information processes	2025-05-27 03:18:21.00536
1633	K1063	Knowledge of operation assessment processes	2025-05-27 03:18:21.00536
1634	K1064	Knowledge of Request For Information (RFI) processes	2025-05-27 03:18:21.00536
1635	K1065	Knowledge of network operations principles and practices	2025-05-27 03:18:21.00536
1636	K1066	Knowledge of threat behaviors	2025-05-27 03:18:21.00536
1637	K1067	Knowledge of target behaviors	2025-05-27 03:18:21.00536
1638	K1068	Knowledge of threat systems and software	2025-05-27 03:18:21.00536
1639	K1069	Knowledge of virtual machine tools and technologies	2025-05-27 03:18:21.00536
1640	K1070	Knowledge of privacy disclosure statement laws and regulations	2025-05-27 03:18:21.00536
1641	K1071	Knowledge of continuous monitoring processes	2025-05-27 03:18:21.00536
1642	K1072	Knowledge of automated security control testing tools and techniques	2025-05-27 03:18:21.00536
1643	K1073	Knowledge of hardware asset management principles and practices	2025-05-27 03:18:21.00536
1644	K1074	Knowledge of software asset management principles and practices	2025-05-27 03:18:21.00536
1645	K1076	Knowledge of risk scoring principles and practices	2025-05-27 03:18:21.00536
1646	K1077	Knowledge of data security controls	2025-05-27 03:18:21.00536
1647	K1078	Knowledge of risk assessment tools and techniques	2025-05-27 03:18:21.00536
1648	K1079	Knowledge of web application security risks	2025-05-27 03:18:21.00536
1649	K1080	Knowledge of secure software update principles and practices	2025-05-27 03:18:21.00536
1650	K1081	Knowledge of secure firmware update principles and practices	2025-05-27 03:18:21.00536
1651	K1082	Knowledge of ingress filtering tools and techniques	2025-05-27 03:18:21.00536
1652	K1083	Knowledge of cybersecurity competitions	2025-05-27 03:18:21.00536
1653	K1084	Knowledge of data privacy controls	2025-05-27 03:18:21.00536
1654	K1085	Knowledge of exploitation tools and techniques	2025-05-27 03:18:21.00536
1655	K1086	Knowledge of design modeling	2025-05-27 03:18:21.00536
1656	K1087	Knowledge of social engineering tools and techniques	2025-05-27 03:18:21.00536
1657	K1088	Knowledge of knowledge management tools and techniques	2025-05-27 03:18:21.00536
1658	K1089	Knowledge of protocol analyzer tools and techniques	2025-05-27 03:18:21.00536
1659	K1090	Knowledge of software, hardware, and peripheral equipment repair tools and techniques	2025-05-27 03:18:21.00536
1660	K1091	Knowledge of media forensics	2025-05-27 03:18:21.00536
1661	K1092	Knowledge of digital forensics tools and techniques	2025-05-27 03:18:21.00536
1662	K1093	Knowledge of black-box software testing	2025-05-27 03:18:21.00536
1663	K1094	Knowledge of hexadecimal data	2025-05-27 03:18:21.00536
1664	K1095	Knowledge of design methods	2025-05-27 03:18:21.00536
1665	K1096	Knowledge of data analysis tools and techniques	2025-05-27 03:18:21.00536
1666	K1097	Knowledge of data mapping tools and techniques	2025-05-27 03:18:21.00536
1667	K1098	Knowledge of personnel systems and software	2025-05-27 03:18:21.00536
1668	K1099	Knowledge of code analysis tools and techniques	2025-05-27 03:18:21.00536
1669	K1100	Knowledge of analytical tools and techniques	2025-05-27 03:18:21.00536
1670	K1101	Knowledge of analytics	2025-05-27 03:18:21.00536
1671	K1102	Knowledge of remote command line tools and techniques	2025-05-27 03:18:21.00536
1672	K1103	Knowledge of Graphic User Interface (GUI) tools and techniques	2025-05-27 03:18:21.00536
1673	K1104	Knowledge of geospatial data analysis tools and techniques	2025-05-27 03:18:21.00536
1674	K1105	Knowledge of non-attributable networks	2025-05-27 03:18:21.00536
1675	K1108	Knowledge of traceroute tools and techniques	2025-05-27 03:18:21.00536
1676	K1109	Knowledge of virtual collaborative workspace tools and techniques	2025-05-27 03:18:21.00536
1677	K1110	Knowledge of acquisition cybersecurity requirements	2025-05-27 03:18:21.00536
1678	K1111	Knowledge of application security design principles and practices	2025-05-27 03:18:21.00536
1679	K1112	Knowledge of asset management policies and procedures	2025-05-27 03:18:21.00536
1680	K1113	Knowledge of blue force tracking	2025-05-27 03:18:21.00536
1681	K1114	Knowledge of capacity management	2025-05-27 03:18:21.00536
1682	K1115	Knowledge of Chain of Custody (CoC) processes and procedures	2025-05-27 03:18:21.00536
1683	K1116	Knowledge of classification guidelines	2025-05-27 03:18:21.00536
1684	K1117	Knowledge of coding and testing standards	2025-05-27 03:18:21.00536
1685	K1118	Knowledge of completion criteria	2025-05-27 03:18:21.00536
1686	K1119	Knowledge of component and interface specifications	2025-05-27 03:18:21.00536
1687	K1120	Knowledge of Confidentiality, Integrity, Availability, Authenticity, and Non-repudiation (CIAAN) principles and practices	2025-05-27 03:18:21.00536
1688	K1121	Knowledge of configuration management	2025-05-27 03:18:21.00536
1689	K1122	Knowledge of configuration management principles and practices	2025-05-27 03:18:21.00536
1690	K1123	Knowledge of continuous monitoring principles and practices	2025-05-27 03:18:21.00536
1691	K1124	Knowledge of continuous monitoring scoring and grading metrics	2025-05-27 03:18:21.00536
1692	K1125	Knowledge of continuous monitoring tools and techniques	2025-05-27 03:18:21.00536
1693	K1126	Knowledge of cost constraints	2025-05-27 03:18:21.00536
1694	K1127	Knowledge of customer experience principles and practices	2025-05-27 03:18:21.00536
1695	K1128	Knowledge of customer requirements	2025-05-27 03:18:21.00536
1696	K1129	Knowledge of cyber defense auditing laws and regulations	2025-05-27 03:18:21.00536
1697	K1130	Knowledge of cyber defense auditing policies and practices	2025-05-27 03:18:21.00536
1698	K1131	Knowledge of cyber defense monitoring tools	2025-05-27 03:18:21.00536
1699	K1132	Knowledge of cyber defense system analysis tools	2025-05-27 03:18:21.00536
1700	K1133	Knowledge of cybersecurity engineering	2025-05-27 03:18:21.00536
1701	K1135	Knowledge of cybersecurity objectives	2025-05-27 03:18:21.00536
1702	K1137	Knowledge of cybersecurity requirements	2025-05-27 03:18:21.00536
1703	K1138	Knowledge of cybersecurity standards and best practices	2025-05-27 03:18:21.00536
1704	K1140	Knowledge of cybersecurity workforce policies and procedures	2025-05-27 03:18:21.00536
1705	K1143	Knowledge of data classification levels	2025-05-27 03:18:21.00536
1706	K1144	Knowledge of data correlation tools and techniques	2025-05-27 03:18:21.00536
1707	K1145	Knowledge of data encryption practices and principles	2025-05-27 03:18:21.00536
1708	K1146	Knowledge of data gathering tools and techniques	2025-05-27 03:18:21.00536
1709	K1147	Knowledge of data integrity principles and practices	2025-05-27 03:18:21.00536
1710	K1148	Knowledge of data manipulation principles and practices	2025-05-27 03:18:21.00536
1711	K1149	Knowledge of data retrieval principles and practices	2025-05-27 03:18:21.00536
1712	K1150	Knowledge of data storage principles and practices	2025-05-27 03:18:21.00536
1713	K1151	Knowledge of digital evidence cataloging tools and techniques	2025-05-27 03:18:21.00536
1714	K1152	Knowledge of digital evidence extraction tools and techniques	2025-05-27 03:18:21.00536
1715	K1153	Knowledge of digital evidence handling principles and practices	2025-05-27 03:18:21.00536
1716	K1154	Knowledge of digital evidence packaging tools and techniques	2025-05-27 03:18:21.00536
1717	K1155	Knowledge of digital evidence preservation tools and techniques	2025-05-27 03:18:21.00536
1718	K1156	Knowledge of enterprise cybersecurity architecture	2025-05-27 03:18:21.00536
1719	K1157	Knowledge of enterprise-wide version control systems	2025-05-27 03:18:21.00536
1720	K1158	Knowledge of evaluation and validation requirements	2025-05-27 03:18:21.00536
1721	K1159	Knowledge of fail-over or alternate site requirements	2025-05-27 03:18:21.00536
1722	K1160	Knowledge of federal and state accreditation standards	2025-05-27 03:18:21.00536
1723	K1161	Knowledge of financial management	2025-05-27 03:18:21.00536
1724	K1163	Knowledge of forensic image processing tools and techniques	2025-05-27 03:18:21.00536
1725	K1164	Knowledge of hardware design principles and practices	2025-05-27 03:18:21.00536
1726	K1165	Knowledge of independent testing methods	2025-05-27 03:18:21.00536
1727	K1166	Knowledge of information architecture principles and practices	2025-05-27 03:18:21.00536
1728	K1167	Knowledge of data sanitization methods	2025-05-27 03:18:21.00536
1729	K1168	Knowledge of intrusion set tools and techniques	2025-05-27 03:18:21.00536
1730	K1169	Knowledge of material supportability requirements	2025-05-27 03:18:21.00536
1731	K1170	Knowledge of mathematical models	2025-05-27 03:18:21.00536
1732	K1171	Knowledge of mission assurance practices and principles	2025-05-27 03:24:35.855726
1733	K1172	Knowledge of mission requirements	2025-05-27 03:24:35.855726
1734	K1173	Knowledge of multilevel security requirements	2025-05-27 03:24:35.855726
1735	K1174	Knowledge of network components	2025-05-27 03:24:35.855726
1736	K1175	Knowledge of network monitoring tools and techniques	2025-05-27 03:24:35.855726
1737	K1176	Knowledge of network topologies	2025-05-27 03:24:35.855726
1738	K1178	Knowledge of operational environment risks	2025-05-27 03:24:35.855726
1739	K1179	Knowledge of organization's security strategy	2025-05-27 03:24:35.855726
1740	K1180	Knowledge of organizational cybersecurity goals and objectives	2025-05-27 03:24:35.855726
1741	K1181	Knowledge of organizational cybersecurity incident response plans	2025-05-27 03:24:35.855726
1742	K1182	Knowledge of organizational cybersecurity policies and configurations	2025-05-27 03:24:35.855726
1743	K1183	Knowledge of organizational cybersecurity policies and procedures	2025-05-27 03:24:35.855726
1744	K1184	Knowledge of organizational cybersecurity workforce requirements	2025-05-27 03:24:35.855726
1745	K1185	Knowledge of organizational evaluation and validation requirements	2025-05-27 03:24:35.855726
1746	K1186	Knowledge of organizational human resource (HR) policies and procedures	2025-05-27 03:24:35.855726
1747	K1187	Knowledge of organizational objectives	2025-05-27 03:24:35.855726
1748	K1188	Knowledge of organizational policies and procedures	2025-05-27 03:24:35.855726
1749	K1189	Knowledge of organizational policy and procedures	2025-05-27 03:24:35.855726
1750	K1190	Knowledge of organizational risk levels	2025-05-27 03:24:35.855726
1751	K1191	Knowledge of organizational security posture	2025-05-27 03:24:35.855726
1752	K1192	Knowledge of organizational privacy policies and procedures	2025-05-27 03:24:35.855726
1753	K1193	Knowledge of packet analysis tools and techniques	2025-05-27 03:24:35.855726
1754	K1194	Knowledge of Personally Identifiable Information (PII) attributes	2025-05-27 03:24:35.855726
1755	K1195	Knowledge of priority information requirements	2025-05-27 03:24:35.855726
1756	K1197	Knowledge of priority intelligence requirements	2025-05-27 03:24:35.855726
1757	K1198	Knowledge of privacy and data security regulators	2025-05-27 03:24:35.855726
1758	K1200	Knowledge of privacy technologies	2025-05-27 03:24:35.855726
1759	K1201	Knowledge of programming languages	2025-05-27 03:24:35.855726
1760	K1202	Knowledge of project plans and schedules	2025-05-27 03:24:35.855726
1761	K1203	Knowledge of Public Key Infrastructure (PKI) libraries	2025-05-27 03:24:35.855726
1762	K1205	Knowledge of required reporting formats	2025-05-27 03:24:35.855726
1763	K1206	Knowledge of research and design processes and procedures	2025-05-27 03:24:35.855726
1764	K1207	Knowledge of reverse engineering tools and techniques	2025-05-27 03:24:35.855726
1765	K1208	Knowledge of risk acceptance and documentation	2025-05-27 03:24:35.855726
1766	K1209	Knowledge of risk mitigation principles and practices	2025-05-27 03:24:35.855726
1767	K1210	Knowledge of secure programming tools and techniques	2025-05-27 03:24:35.855726
1768	K1211	Knowledge of security assessment authorization requirements	2025-05-27 03:24:35.855726
1769	K1212	Knowledge of security controls	2025-05-27 03:24:35.855726
1770	K1213	Knowledge of security requirements	2025-05-27 03:24:35.855726
1771	K1214	Knowledge of security restrictions	2025-05-27 03:24:35.855726
1772	K1215	Knowledge of security testing tools and techniques	2025-05-27 03:24:35.855726
1773	K1216	Knowledge of service-oriented security architecture practices and principles	2025-05-27 03:24:35.855726
1774	K1217	Knowledge of software and systems engineering life cycle standards	2025-05-27 03:24:35.855726
1775	K1218	Knowledge of software application, system, and network requirements	2025-05-27 03:24:35.855726
1776	K1219	Knowledge of statistical processes	2025-05-27 03:24:35.855726
1777	K1220	Knowledge of steganography practices and principles	2025-05-27 03:24:35.855726
1778	K1221	Knowledge of supply chain risk management practices	2025-05-27 03:24:35.855726
1779	K1222	Knowledge of system availability requirements	2025-05-27 03:24:35.855726
1780	K1223	Knowledge of system backup requirements	2025-05-27 03:24:35.855726
1781	K1224	Knowledge of system characteristics	2025-05-27 03:24:35.855726
1782	K1225	Knowledge of system life cycles	2025-05-27 03:24:35.855726
1783	K1226	Knowledge of systems administration standard operating policies and procedures	2025-05-27 03:24:35.855726
1784	K1227	Knowledge of systems architecture	2025-05-27 03:24:35.855726
1785	K1228	Knowledge of systems development	2025-05-27 03:24:35.855726
1786	K1233	Knowledge of UNIX scripts	2025-05-27 03:24:35.855726
1787	K1234	Knowledge of user interfaces	2025-05-27 03:24:35.855726
1788	K1235	Knowledge of user needs and requirements	2025-05-27 03:24:35.855726
1789	K1236	Knowledge of user requirements	2025-05-27 03:24:35.855726
1790	K1237	Knowledge of Virtual Private Network (VPN) devices	2025-05-27 03:24:35.855726
1791	K1238	Knowledge of Windows scripts	2025-05-27 03:24:35.855726
1792	K1239	Knowledge of certificate management principles and practices	2025-05-27 03:24:35.855726
1793	K1240	Knowledge of privacy laws and regulations	2025-05-27 03:24:35.855726
1794	K1241	Knowledge of cultural, political, and organizational assets	2025-05-27 03:24:35.855726
1795	K1242	Knowledge of cybersecurity review processes and procedures	2025-05-27 03:24:35.855726
1796	K1243	Knowledge of cybersecurity threat remediation principles and practices	2025-05-27 03:24:35.855726
1797	K1244	Knowledge of cybersecurity tools and techniques	2025-05-27 03:24:35.855726
1798	K1245	Knowledge of data exfiltration tools and techniques	2025-05-27 03:24:35.855726
1799	K1246	Knowledge of data handling tools and techniques	2025-05-27 03:24:35.855726
1800	K1247	Knowledge of data monitoring tools and techniques	2025-05-27 03:24:35.855726
1801	K1248	Knowledge of digital and physical security vulnerabilities	2025-05-27 03:24:35.855726
1802	K1249	Knowledge of digital and physical security vulnerability remediation principles and practices	2025-05-27 03:24:35.855726
1803	K1250	Knowledge of external organization roles and responsibilities	2025-05-27 03:24:35.855726
1804	K1251	Knowledge of external referrals policies and procedures	2025-05-27 03:24:35.855726
1805	K1252	Knowledge of high value asset characteristics	2025-05-27 03:24:35.855726
1806	K1253	Knowledge of information collection tools and techniques	2025-05-27 03:24:35.855726
1807	K1254	Knowledge of insider threat hub policies and procedures	2025-05-27 03:24:35.855726
1808	K1255	Knowledge of insider threat hub operations	2025-05-27 03:24:35.855726
1809	K1256	Knowledge of insider threat operational indicators	2025-05-27 03:24:35.855726
1810	K1257	Knowledge of insider threat policies and procedures	2025-05-27 03:24:35.855726
1811	K1258	Knowledge of insider threat tactics	2025-05-27 03:24:35.855726
1812	K1259	Knowledge of insider threat targets	2025-05-27 03:24:35.855726
1813	K1260	Knowledge of intelligence laws and regulations	2025-05-27 03:24:35.855726
1814	K1261	Knowledge of known insider attacks	2025-05-27 03:24:35.855726
1815	K1262	Knowledge of network endpoints	2025-05-27 03:24:35.855726
1816	K1263	Knowledge of notification policies and procedures	2025-05-27 03:24:35.855726
1817	K1265	Knowledge of organizational objectives, resources, and capabilities	2025-05-27 03:24:35.855726
1818	K1267	Knowledge of previously referred potential insider threats	2025-05-27 03:24:35.855726
1819	K1268	Knowledge of risk reduction metrics	2025-05-27 03:24:35.855726
1820	K1269	Knowledge of security information and event management (SIEM) tools and techniques	2025-05-27 03:24:35.855726
1821	K1270	Knowledge of suspicious activity response processes	2025-05-27 03:24:35.855726
1822	K1271	Knowledge of system alert policies and procedures	2025-05-27 03:24:35.855726
1823	K1272	Knowledge of system components	2025-05-27 03:24:35.855726
1824	K1273	Knowledge of threat investigation policies and procedures	2025-05-27 03:24:35.855726
1825	K1274	Knowledge of threat modeling tools and techniques	2025-05-27 03:24:35.855726
1826	K1275	Knowledge of User Activity Monitoring (UAM) tools and techniques	2025-05-27 03:24:35.855726
1827	K1276	Knowledge of advanced persistent threats (APTs)	2025-05-27 03:24:35.855726
1828	K1277	Knowledge of cyber resiliency goals and objectives	2025-05-27 03:24:35.855726
1829	K1278	Knowledge of data vaulting principles and practices	2025-05-27 03:24:35.855726
1830	K1279	Knowledge of threat-informed defense	2025-05-27 03:24:35.855726
1831	K1280	Knowledge of approved data processing tools and techniques	2025-05-27 03:24:35.855726
1832	K1281	Knowledge of data types and characteristics	2025-05-27 03:24:35.855726
1833	K1282	Knowledge of predication requirements	2025-05-27 03:24:35.855726
1834	K1283	Knowledge of court exhibit processes	2025-05-27 03:24:35.855726
1835	K1284	Knowledge of testing and calibration in laboratory environment	2025-05-27 03:24:35.855726
1836	K1285	Knowledge of assessment remediation requirements	2025-05-27 03:24:35.855726
1837	K1286	Knowledge of Business Impact Analysis (BIA)	2025-05-27 03:24:35.855726
1838	K1287	Knowledge of change management processes	2025-05-27 03:24:35.855726
1839	K1288	Knowledge of OT cybersecurity compliance requirements and best practices	2025-05-27 03:24:35.855726
1840	K1289	Knowledge of control system environment risks, threats, and vulnerabilities	2025-05-27 03:24:35.855726
1841	K1290	Knowledge of the Active Cyber Defense Cycle (ACDC)	2025-05-27 03:24:35.855726
1842	K1291	Knowledge of active defense principles and practices	2025-05-27 03:24:35.855726
1843	K1292	Knowledge of OT cybersecurity risk tolerance levels	2025-05-27 03:24:35.855726
1844	K1293	Knowledge of Purdue Model levels	2025-05-27 03:24:35.855726
1845	K1294	Knowledge of change management policies and procedures	2025-05-27 03:24:35.855726
1846	K1295	Knowledge of OT cybersecurity inspection and testing policies and procedures	2025-05-27 03:24:35.855726
1847	K1296	Knowledge of control system policies and procedures	2025-05-27 03:24:35.855726
1848	K1297	Knowledge of OT safety systems	2025-05-27 03:24:35.855726
1849	K1298	Knowledge of anomaly detection tools and techniques	2025-05-27 03:24:35.855726
1850	K1299	Knowledge of change management processes	2025-05-27 03:24:35.855726
1851	K1300	Knowledge of control system network architectures	2025-05-27 03:24:35.855726
1852	K1301	Knowledge of cyber incidents impacting OT	2025-05-27 03:24:35.855726
1853	K1302	Knowledge of industry hazards	2025-05-27 03:24:35.855726
1854	K1303	Knowledge of life cycle management principles and practices	2025-05-27 03:24:35.855726
1855	K1304	Knowledge of operational priorities	2025-05-27 03:24:35.855726
1856	K1305	Knowledge of OT asset management tools and techniques	2025-05-27 03:24:35.855726
1857	K1306	Knowledge of OT assets	2025-05-27 03:24:35.855726
1858	K1307	Knowledge of OT inventory principles and practices	2025-05-27 03:24:35.855726
1859	K1308	Knowledge of OT network detection tools and techniques	2025-05-27 03:24:35.855726
1860	K1309	Knowledge of OT protocols	2025-05-27 03:24:35.855726
1861	K1310	Knowledge of process hazard analysis (PHA) assessments	2025-05-27 03:24:35.855726
1862	K1311	Knowledge of system assets and boundaries	2025-05-27 03:24:35.855726
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills (id, code, description, created_at) FROM stdin;
18	S0011	Skill in conducting information searches	2025-05-27 03:31:35.732264
19	S0015	Skill in conducting test events	2025-05-27 03:31:35.732264
20	S0028	Skill in developing data dictionaries	2025-05-27 03:31:35.732264
21	S0029	Skill in developing data models	2025-05-27 03:31:35.732264
22	S0035	Skill in establishing a routing schema	2025-05-27 03:31:35.732264
23	S0045	Skill in optimizing database performance	2025-05-27 03:31:35.732264
24	S0048	Skill in systems integration testing	2025-05-27 03:31:35.732264
25	S0066	Skill in identifying gaps in technical capabilities	2025-05-27 03:31:35.732264
26	S0077	Skill in securing network communications	2025-05-27 03:31:35.732264
27	S0080	Skill in performing damage assessments	2025-05-27 03:31:35.732264
28	S0097	Skill in applying security controls	2025-05-27 03:31:35.732264
29	S0109	Skill in identifying hidden patterns or relationships	2025-05-27 03:31:35.732264
30	S0111	Skill in interfacing with customers	2025-05-27 03:31:35.732264
31	S0114	Skill in performing sensitivity analysis	2025-05-27 03:31:35.732264
32	S0118	Skill in developing machine understandable semantic ontologies	2025-05-27 03:31:35.732264
33	S0136	Skill in network systems management principles, models, methods (e.g., end-to-end systems performance monitoring), and tools	2025-05-27 03:31:35.732264
34	S0141	Skill in assessing security systems designs	2025-05-27 03:31:35.732264
35	S0156	Skill in performing packet-level analysis	2025-05-27 03:31:35.732264
36	S0172	Skill in applying secure coding techniques	2025-05-27 03:31:35.732264
37	S0175	Skill in performing root cause analysis	2025-05-27 03:31:35.732264
38	S0177	Skill in performing network analysis on targets	2025-05-27 03:31:35.732264
39	S0186	Skill in applying crisis planning procedures	2025-05-27 03:31:35.732264
40	S0194	Skill in conducting non-attributable research	2025-05-27 03:31:35.732264
41	S0208	Skill in determining the physical location of network devices	2025-05-27 03:31:35.732264
42	S0221	Skill in extracting information from packet captures	2025-05-27 03:31:35.732264
43	S0248	Skill in performing target system analysis	2025-05-27 03:31:35.732264
44	S0252	Skill in processing collected data for follow-on analysis	2025-05-27 03:31:35.732264
45	S0375	Skill in developing information requirements	2025-05-27 03:31:35.732264
46	S0378	Skill in decrypting information	2025-05-27 03:31:35.732264
47	S0379	Skill in verifying participation in a security awareness program	2025-05-27 03:31:35.732264
48	S0380	Skill in facilitating cybersecurity awareness briefings	2025-05-27 03:31:35.732264
49	S0381	Skill in developing training programs	2025-05-27 03:31:35.732264
50	S0382	Skill in tailoring code analysis	2025-05-27 03:31:35.732264
51	S0383	Skill in analyzing an organization's enterprise information technology architecture	2025-05-27 03:31:35.732264
52	S0384	Skill in applying standards	2025-05-27 03:31:35.732264
53	S0385	Skill in communicating complex concepts	2025-05-27 03:31:35.732264
54	S0386	Skill in communicating verbally	2025-05-27 03:31:35.732264
55	S0387	Skill in communicating in writing	2025-05-27 03:31:35.732264
56	S0388	Skill in facilitating small group discussions	2025-05-27 03:31:35.732264
57	S0389	Skill in facilitating group discussions	2025-05-27 03:31:35.732264
58	S0390	Skill in assessing learner comprehension	2025-05-27 03:31:35.732264
59	S0391	Skill in creating technical documentation	2025-05-27 03:31:35.732264
60	S0392	Skill in providing training and education feedback to learners	2025-05-27 03:31:35.732264
61	S0393	Skill in developing assessments	2025-05-27 03:31:35.732264
62	S0394	Skill in developing security assessments	2025-05-27 03:31:35.732264
63	S0395	Skill in developing instructional materials	2025-05-27 03:31:35.732264
64	S0396	Skill in forecasting requirements	2025-05-27 03:31:35.732264
65	S0397	Skill in assessing requirements	2025-05-27 03:31:35.732264
66	S0398	Skill in analyzing organizational objectives	2025-05-27 03:31:35.732264
67	S0399	Skill in creating complex data structures	2025-05-27 03:31:35.732264
68	S0400	Skill in creating programming languages	2025-05-27 03:31:35.732264
69	S0401	Skill in collecting data	2025-05-27 03:31:35.732264
70	S0402	Skill in verifying data	2025-05-27 03:31:35.732264
71	S0403	Skill in validating data	2025-05-27 03:31:35.732264
72	S0404	Skill in conducting market research	2025-05-27 03:31:35.732264
73	S0405	Skill in pricing products	2025-05-27 03:31:35.732264
74	S0406	Skill in developing policy plans	2025-05-27 03:31:35.732264
75	S0407	Skill in developing standard operating procedures (SOPs)	2025-05-27 03:31:35.732264
76	S0408	Skill in maintaining standard operating procedures (SOPs)	2025-05-27 03:31:35.732264
77	S0409	Skill in deriving evaluative conclusions from data	2025-05-27 03:31:35.732264
78	S0410	Skill in creating career path definitions	2025-05-27 03:31:35.732264
79	S0411	Skill in developing career paths	2025-05-27 03:31:35.732264
80	S0412	Skill in analyzing supplier trustworthiness	2025-05-27 03:31:35.732264
81	S0413	Skill in determining supplier trustworthiness	2025-05-27 03:31:35.732264
82	S0414	Skill in evaluating laws	2025-05-27 03:31:35.732264
83	S0415	Skill in evaluating regulations	2025-05-27 03:31:35.732264
84	S0416	Skill in evaluating policies	2025-05-27 03:31:35.732264
85	S0417	Skill in deploying software securely	2025-05-27 03:31:35.732264
86	S0418	Skill in applying secure network architectures	2025-05-27 03:31:35.732264
87	S0419	Skill in designing systems	2025-05-27 03:31:35.732264
88	S0420	Skill in integrating multiple technologies	2025-05-27 03:31:35.732264
89	S0421	Skill in operating network equipment	2025-05-27 03:31:35.732264
90	S0422	Skill in evaluating workforce trends	2025-05-27 03:31:35.732264
91	S0423	Skill in analyzing processes to ensure conformance with procedural requirements	2025-05-27 03:31:35.732264
92	S0424	Skill in executing command line tools	2025-05-27 03:31:35.732264
93	S0425	Skill in operating network systems	2025-05-27 03:31:35.732264
94	S0426	Skill in building architectures	2025-05-27 03:31:35.732264
95	S0427	Skill in building frameworks	2025-05-27 03:31:35.732264
96	S0428	Skill in designing architectures	2025-05-27 03:31:35.732264
97	S0429	Skill in designing frameworks	2025-05-27 03:31:35.732264
98	S0430	Skill in collaborating with others	2025-05-27 03:31:35.732264
99	S0431	Skill in applying critical thinking	2025-05-27 03:31:35.732264
100	S0432	Skill in coordinating cybersecurity operations across an organization	2025-05-27 03:31:35.732264
101	S0433	Skill in creating analytics	2025-05-27 03:31:35.732264
102	S0434	Skill in extrapolating from incomplete data sets	2025-05-27 03:31:35.732264
103	S0435	Skill in analyzing large data sets	2025-05-27 03:31:35.732264
104	S0436	Skill in creating target intelligence products	2025-05-27 03:31:35.732264
105	S0437	Skill in identifying targets of interest	2025-05-27 03:31:35.732264
106	S0438	Skill in functioning effectively in a dynamic, fast-paced environment	2025-05-27 03:31:35.732264
107	S0439	Skill in identifying external partners	2025-05-27 03:31:35.732264
108	S0440	Skill in identifying target vulnerabilities	2025-05-27 03:31:35.732264
109	S0441	Skill in describing target vulnerabilities	2025-05-27 03:31:35.732264
110	S0442	Skill in collecting network data	2025-05-27 03:31:35.732264
111	S0443	Skill in mitigating cognitive biases	2025-05-27 03:31:35.732264
112	S0444	Skill in mitigating deception in reporting and analysis	2025-05-27 03:31:35.732264
113	S0446	Skill in mimicking threat actors	2025-05-27 03:31:35.732264
114	S0447	Skill in aligning privacy and cybersecurity objectives	2025-05-27 03:31:35.732264
115	S0448	Skill in creating automated security control systems	2025-05-27 03:31:35.732264
116	S0449	Skill in maintaining automated security control systems	2025-05-27 03:31:35.732264
117	S0450	Skill in authoring privacy disclosure statements	2025-05-27 03:31:35.732264
118	S0451	Skill in deploying continuous monitoring technologies	2025-05-27 03:32:37.591295
119	S0452	Skill in creating a risk management program	2025-05-27 03:32:37.591295
120	S0453	Skill in creating a risk management strategy	2025-05-27 03:32:37.591295
121	S0454	Skill in creating an internal information sharing program	2025-05-27 03:32:37.591295
122	S0455	Skill in integrating authorizations with requirements	2025-05-27 03:32:37.591295
123	S0456	Skill in integrating security plans and authorizations	2025-05-27 03:32:37.591295
124	S0457	Skill in determining system authorization status	2025-05-27 03:32:37.591295
125	S0458	Skill in coordinating efforts between stakeholders	2025-05-27 03:32:37.591295
126	S0459	Skill in creating security assessment reports	2025-05-27 03:32:37.591295
127	S0460	Skill in verifying contractor compliance with contracts	2025-05-27 03:32:37.591295
128	S0461	Skill in integrating security requirements and contracts	2025-05-27 03:32:37.591295
129	S0462	Skill in integrating information security requirements in the acquisitions process	2025-05-27 03:32:37.591295
130	S0463	Skill in implementing software quality control processes	2025-05-27 03:32:37.591295
131	S0464	Skill in applying stakeholder management within a system development life cycle	2025-05-27 03:32:37.591295
132	S0465	Skill in identifying critical infrastructure systems	2025-05-27 03:32:37.591295
133	S0466	Skill in identifying systems designed without security considerations	2025-05-27 03:32:37.591295
134	S0467	Skill in conducting an education needs assessment	2025-05-27 03:32:37.591295
135	S0468	Skill in conducting a training needs assessment	2025-05-27 03:32:37.591295
136	S0469	Skill in navigating the dark web	2025-05-27 03:32:37.591295
137	S0470	Skill in using the TOR network	2025-05-27 03:32:37.591295
138	S0471	Skill in examining digital media	2025-05-27 03:32:37.591295
139	S0472	Skill in developing virtual machines	2025-05-27 03:32:37.591295
140	S0473	Skill in maintaining virtual machines	2025-05-27 03:32:37.591295
141	S0474	Skill in finding system files	2025-05-27 03:32:37.591295
142	S0475	Skill in recognizing digital forensics data	2025-05-27 03:32:37.591295
143	S0476	Skill in identifying filename extension abuse	2025-05-27 03:32:37.591295
144	S0477	Skill in identifying anomalous activity	2025-05-27 03:32:37.591295
145	S0478	Skill in providing customer support	2025-05-27 03:32:37.591295
146	S0479	Skill in evaluating supplier trustworthiness	2025-05-27 03:32:37.591295
147	S0480	Skill in evaluating product trustworthiness	2025-05-27 03:32:37.591295
148	S0481	Skill in identifying forensic digital footprints	2025-05-27 03:32:37.591295
149	S0482	Skill in performing forensic data analysis	2025-05-27 03:32:37.591295
150	S0483	Skill in identifying software communications vulnerabilities	2025-05-27 03:32:37.591295
151	S0484	Skill in developing user credential management systems	2025-05-27 03:32:37.591295
152	S0485	Skill in implementing user credential management systems	2025-05-27 03:32:37.591295
153	S0486	Skill in implementing enterprise key escrow systems	2025-05-27 03:32:37.591295
154	S0487	Skill in operating IT systems	2025-05-27 03:32:37.591295
155	S0488	Skill in maintaining IT systems	2025-05-27 03:32:37.591295
156	S0489	Skill in implementing countermeasures	2025-05-27 03:32:37.591295
157	S0490	Skill in recreating network topologies	2025-05-27 03:32:37.591295
158	S0491	Skill in processing digital forensic data	2025-05-27 03:32:37.591295
159	S0492	Skill in performing threat environment analysis	2025-05-27 03:32:37.591295
160	S0494	Skill in performing operational environment analysis	2025-05-27 03:32:37.591295
161	S0495	Skill in determining asset availability, capabilities, and limitations	2025-05-27 03:32:37.591295
162	S0497	Skill in developing client organization profiles	2025-05-27 03:32:37.591295
163	S0499	Skill in performing intelligence collection analysis	2025-05-27 03:32:37.591295
164	S0501	Skill in developing crisis action plans	2025-05-27 03:32:37.591295
165	S0503	Skill in selecting targets	2025-05-27 03:32:37.591295
166	S0504	Skill in identifying vulnerabilities	2025-05-27 03:32:37.591295
167	S0505	Skill in performing intrusion data analysis	2025-05-27 03:32:37.591295
168	S0506	Skill in identifying customer information needs	2025-05-27 03:32:37.591295
169	S0507	Skill in collecting terminal or environment data	2025-05-27 03:32:37.591295
170	S0508	Skill in managing enterprise-wide information	2025-05-27 03:32:37.591295
171	S0509	Skill in evaluating security products	2025-05-27 03:32:37.591295
172	S0511	Skill in establishing priorities	2025-05-27 03:32:37.591295
173	S0512	Skill in extracting metadata	2025-05-27 03:32:37.591295
174	S0514	Skill in preparing operational environments	2025-05-27 03:32:37.591295
175	S0515	Skill in identifying partner capabilities	2025-05-27 03:32:37.591295
176	S0516	Skill in performing threat emulation tactics	2025-05-27 03:32:37.591295
177	S0517	Skill in anticipating threats	2025-05-27 03:32:37.591295
178	S0518	Skill in assessing threat actors	2025-05-27 03:32:37.591295
179	S0519	Skill in detecting exploitation activities	2025-05-27 03:32:37.591295
180	S0522	Skill in summarizing information	2025-05-27 03:32:37.591295
181	S0523	Skill in constructing networks	2025-05-27 03:32:37.591295
182	S0527	Skill in developing crisis action timelines	2025-05-27 03:32:37.591295
183	S0528	Skill in identifying priority information	2025-05-27 03:32:37.591295
184	S0530	Skill in conducting research	2025-05-27 03:32:37.591295
185	S0531	Skill in assessing security hardware and software	2025-05-27 03:32:37.591295
186	S0532	Skill in analyzing software configurations	2025-05-27 03:32:37.591295
187	S0535	Skill in performing threat factor analysis	2025-05-27 03:32:37.591295
188	S0537	Skill in designing wireless communications systems	2025-05-27 03:32:37.591295
189	S0540	Skill in identifying network threats	2025-05-27 03:32:37.591295
190	S0541	Skill in providing software updates	2025-05-27 03:32:37.591295
191	S0542	Skill in developing access control lists	2025-05-27 03:32:37.591295
192	S0543	Skill in scanning for vulnerabilities	2025-05-27 03:32:37.591295
193	S0544	Skill in recognizing vulnerabilities	2025-05-27 03:32:37.591295
194	S0545	Skill in designing data storage solutions	2025-05-27 03:32:37.591295
195	S0546	Skill in implementing data storage solutions	2025-05-27 03:32:37.591295
196	S0547	Skill in identifying malware	2025-05-27 03:32:37.591295
197	S0548	Skill in capturing malware	2025-05-27 03:32:37.591295
198	S0549	Skill in containing malware	2025-05-27 03:32:37.591295
199	S0550	Skill in reporting malware	2025-05-27 03:32:37.591295
200	S0551	Skill in applying information technologies into proposed solutions	2025-05-27 03:32:37.591295
201	S0552	Skill in applying host access controls	2025-05-27 03:32:37.591295
202	S0553	Skill in applying network access controls	2025-05-27 03:32:37.591295
203	S0554	Skill in performing systems analysis	2025-05-27 03:32:37.591295
204	S0555	Skill in performing capabilities analysis	2025-05-27 03:32:37.591295
205	S0556	Skill in performing requirements analysis	2025-05-27 03:32:37.591295
206	S0557	Skill in creating knowledge maps	2025-05-27 03:32:37.591295
207	S0558	Skill in developing algorithms	2025-05-27 03:32:37.591295
208	S0559	Skill in performing data structure analysis	2025-05-27 03:32:37.591295
209	S0560	Skill in debugging software	2025-05-27 03:32:37.591295
210	S0561	Skill in configuring software	2025-05-27 03:32:37.591295
211	S0562	Skill in creating mathematical models	2025-05-27 03:32:37.591295
212	S0563	Skill in creating statistical models	2025-05-27 03:32:37.591295
213	S0564	Skill in creating system security policies	2025-05-27 03:32:37.591295
214	S0565	Skill in implementing input validation	2025-05-27 03:32:37.591295
215	S0566	Skill in developing signatures	2025-05-27 03:32:37.591295
216	S0567	Skill in deploying signatures	2025-05-27 03:32:37.591295
217	S0568	Skill in designing data analysis structures	2025-05-27 03:32:37.591295
218	S0569	Skill in designing security controls	2025-05-27 03:36:51.292781
219	S0570	Skill in designing the integration of hardware solutions	2025-05-27 03:36:51.292781
220	S0571	Skill in designing the integration of software solutions	2025-05-27 03:36:51.292781
221	S0572	Skill in detecting host- and network-based intrusions	2025-05-27 03:36:51.292781
222	S0573	Skill in developing testing scenarios	2025-05-27 03:36:51.292781
223	S0574	Skill in developing security system controls	2025-05-27 03:36:51.292781
224	S0575	Skill in developing network infrastructure contingency and recovery plans	2025-05-27 03:36:51.292781
225	S0576	Skill in testing network infrastructure contingency and recovery plans	2025-05-27 03:36:51.292781
226	S0577	Skill in troubleshooting computer networks	2025-05-27 03:36:51.292781
227	S0578	Skill in evaluating security designs	2025-05-27 03:36:51.292781
228	S0579	Skill in preparing reports	2025-05-27 03:36:51.292781
229	S0580	Skill in monitoring system performance	2025-05-27 03:36:51.292781
230	S0581	Skill in configuring systems for performance enhancement	2025-05-27 03:36:51.292781
231	S0582	Skill in troubleshooting system performance	2025-05-27 03:36:51.292781
232	S0583	Skill in implementing established network security practices	2025-05-27 03:36:51.292781
233	S0584	Skill in configuring network devices	2025-05-27 03:36:51.292781
234	S0585	Skill in installing network devices	2025-05-27 03:36:51.292781
235	S0586	Skill in administering databases	2025-05-27 03:36:51.292781
236	S0587	Skill in maintaining directory services	2025-05-27 03:36:51.292781
237	S0588	Skill in performing threat modeling	2025-05-27 03:36:51.292781
238	S0589	Skill in preserving digital evidence integrity	2025-05-27 03:36:51.292781
239	S0590	Skill in building use cases	2025-05-27 03:36:51.292781
240	S0591	Skill in performing social engineering	2025-05-27 03:36:51.292781
241	S0592	Skill in tuning network sensors	2025-05-27 03:36:51.292781
242	S0593	Skill in handling incidents	2025-05-27 03:36:51.292781
243	S0594	Skill in repairing hardware	2025-05-27 03:36:51.292781
244	S0595	Skill in repairing system peripherals	2025-05-27 03:36:51.292781
245	S0596	Skill in encrypting network communications	2025-05-27 03:36:51.292781
246	S0597	Skill in writing code in a currently supported programming language	2025-05-27 03:36:51.292781
247	S0598	Skill in creating test plans	2025-05-27 03:36:51.292781
248	S0599	Skill in performing memory dump analysis	2025-05-27 03:36:51.292781
249	S0600	Skill in collecting relevant data from a variety of sources	2025-05-27 03:36:51.292781
250	S0601	Skill in developing curricula	2025-05-27 03:36:51.292781
251	S0602	Skill in teaching training programs	2025-05-27 03:36:51.292781
252	S0603	Skill in identifying forensics data in diverse media	2025-05-27 03:36:51.292781
253	S0604	Skill in extracting forensics data in diverse media	2025-05-27 03:36:51.292781
254	S0605	Skill in storing digital evidence	2025-05-27 03:36:51.292781
255	S0606	Skill in manipulating operating system components	2025-05-27 03:36:51.292781
256	S0607	Skill in collecting digital evidence	2025-05-27 03:36:51.292781
257	S0608	Skill in processing digital evidence	2025-05-27 03:36:51.292781
258	S0609	Skill in transporting digital evidence	2025-05-27 03:36:51.292781
259	S0610	Skill in communicating effectively	2025-05-27 03:36:51.292781
260	S0611	Skill in disassembling Personal Computers (PCs)	2025-05-27 03:36:51.292781
261	S0612	Skill in performing digital forensics analysis	2025-05-27 03:36:51.292781
262	S0613	Skill in configuring software-based computer protection tools	2025-05-27 03:36:51.292781
263	S0614	Skill in categorizing types of vulnerabilities	2025-05-27 03:36:51.292781
264	S0615	Skill in protecting a network against malware	2025-05-27 03:36:51.292781
265	S0616	Skill in applying black-box software testing	2025-05-27 03:36:51.292781
266	S0617	Skill in interpreting signatures	2025-05-27 03:36:51.292781
267	S0618	Skill in configuring network protection components	2025-05-27 03:36:51.292781
268	S0619	Skill in auditing technical systems	2025-05-27 03:36:51.292781
269	S0620	Skill in evaluating the trustworthiness of a supply chain	2025-05-27 03:36:51.292781
270	S0621	Skill in performing binary analysis	2025-05-27 03:36:51.292781
271	S0622	Skill in implementing one-way hash functions	2025-05-27 03:36:51.292781
272	S0623	Skill in performing source code analysis	2025-05-27 03:36:51.292781
273	S0624	Skill in performing volatile data analysis	2025-05-27 03:36:51.292781
274	S0625	Skill in interpreting debugger results	2025-05-27 03:36:51.292781
275	S0626	Skill in identifying common encoding techniques	2025-05-27 03:36:51.292781
276	S0627	Skill in reading signatures	2025-05-27 03:36:51.292781
277	S0628	Skill in developing learning activities	2025-05-27 03:36:51.292781
278	S0629	Skill in applying technologies for instructional purposes	2025-05-27 03:36:51.292781
279	S0630	Skill in conducting Test Readiness Reviews (TRR)	2025-05-27 03:36:51.292781
280	S0631	Skill in performing data preprocessing	2025-05-27 03:36:51.292781
281	S0632	Skill in designing Test and Evaluation Strategies (TES)	2025-05-27 03:36:51.292781
282	S0633	Skill in developing position qualification requirements	2025-05-27 03:36:51.292781
283	S0634	Skill in identifying Test and Evaluation Strategies (TES) infrastructure requirements	2025-05-27 03:36:51.292781
284	S0635	Skill in managing test assets	2025-05-27 03:36:51.292781
285	S0636	Skill in performing format conversions	2025-05-27 03:36:51.292781
286	S0637	Skill in designing multi-level security solutions	2025-05-27 03:36:51.292781
287	S0638	Skill in designing cross-domain solutions	2025-05-27 03:36:51.292781
288	S0639	Skill in providing test and evaluation resource estimates	2025-05-27 03:36:51.292781
289	S0640	Skill in performing regression analysis	2025-05-27 03:36:51.292781
290	S0641	Skill in reviewing logs	2025-05-27 03:36:51.292781
291	S0642	Skill in identifying evidence of past intrusions	2025-05-27 03:36:51.292781
292	S0643	Skill in applying hardening techniques	2025-05-27 03:36:51.292781
293	S0644	Skill in performing transformation analytics	2025-05-27 03:36:51.292781
294	S0645	Skill in troubleshooting cyber defense infrastructure anomalies	2025-05-27 03:36:51.292781
295	S0646	Skill in applying descriptive statistics	2025-05-27 03:36:51.292781
296	S0647	Skill in managing a workforce	2025-05-27 03:36:51.292781
297	S0648	Skill in detecting anomalies	2025-05-27 03:36:51.292781
298	S0649	Skill in removing outliers	2025-05-27 03:36:51.292781
299	S0650	Skill in writing scripts	2025-05-27 03:36:51.292781
300	S0651	Skill in performing malware analysis	2025-05-27 03:36:51.292781
301	S0652	Skill in performing bit-level analysis	2025-05-27 03:36:51.292781
302	S0653	Skill in creating digital evidence copies	2025-05-27 03:36:51.292781
303	S0654	Skill in conducting system reviews	2025-05-27 03:36:51.292781
304	S0655	Skill in designing secure test plans	2025-05-27 03:36:51.292781
305	S0656	Skill in assessing application vulnerabilities	2025-05-27 03:36:51.292781
306	S0657	Skill in implementing Public Key Infrastructure (PKI) encryption	2025-05-27 03:36:51.292781
307	S0658	Skill in implementing digital signatures	2025-05-27 03:36:51.292781
308	S0659	Skill in applying security models	2025-05-27 03:36:51.292781
309	S0660	Skill in performing systems engineering	2025-05-27 03:36:51.292781
310	S0661	Skill in troubleshooting client-level problems	2025-05-27 03:36:51.292781
311	S0662	Skill in managing servers	2025-05-27 03:36:51.292781
312	S0663	Skill in managing workstations	2025-05-27 03:36:51.292781
313	S0664	Skill in applying policies that meet system security objectives	2025-05-27 03:36:51.292781
314	S0665	Skill in creating policies	2025-05-27 03:36:51.292781
315	S0666	Skill in defining performance objectives	2025-05-27 03:36:51.292781
316	S0667	Skill in assessing security controls	2025-05-27 03:36:51.292781
317	S0668	Skill in designing technology processes and solutions	2025-05-27 03:36:51.292781
318	S0669	Skill in integrating technology processes and solutions	2025-05-27 03:38:11.289095
319	S0670	Skill in implementing error handling in applications	2025-05-27 03:38:11.289095
320	S0671	Skill in implementing network infrastructure contingency and recovery plans	2025-05-27 03:38:11.289095
321	S0672	Skill in troubleshooting failed system components	2025-05-27 03:38:11.289095
322	S0673	Skill in translating operational requirements into security controls	2025-05-27 03:38:11.289095
323	S0674	Skill in installing system and component upgrades	2025-05-27 03:38:11.289095
324	S0675	Skill in optimizing system performance	2025-05-27 03:38:11.289095
325	S0677	Skill in recovering failed systems	2025-05-27 03:38:11.289095
326	S0678	Skill in administering operating systems	2025-05-27 03:38:11.289095
327	S0679	Skill in configuring network workstations and peripherals	2025-05-27 03:38:11.289095
328	S0680	Skill in validating network workstations and peripherals	2025-05-27 03:38:11.289095
329	S0681	Skill in performing design modeling	2025-05-27 03:38:11.289095
330	S0682	Skill in applying subnet techniques	2025-05-27 03:38:11.289095
331	S0683	Skill in implementing network segregation	2025-05-27 03:38:11.289095
332	S0685	Skill in configuring computer protection components	2025-05-27 03:38:11.289095
333	S0686	Skill in performing risk assessments	2025-05-27 03:38:11.289095
334	S0687	Skill in performing administrative planning activities	2025-05-27 03:38:11.289095
335	S0688	Skill in performing network data analysis	2025-05-27 03:38:11.289095
336	S0690	Skill in performing midpoint collection data analysis	2025-05-27 03:38:11.289095
337	S0694	Skill in auditing network devices	2025-05-27 03:38:11.289095
338	S0695	Skill in performing Open Source Intelligence (OSINT) research	2025-05-27 03:38:11.289095
339	S0696	Skill in conducting deep web research	2025-05-27 03:38:11.289095
340	S0700	Skill in mining data	2025-05-27 03:38:11.289095
341	S0701	Skill in performing data mining analysis	2025-05-27 03:38:11.289095
342	S0702	Skill in defining an operational environment	2025-05-27 03:38:11.289095
343	S0703	Skill in depicting data on a network map	2025-05-27 03:38:11.289095
344	S0704	Skill in performing target analysis	2025-05-27 03:38:11.289095
345	S0705	Skill in installing patches	2025-05-27 03:38:11.289095
346	S0706	Skill in identifying patch signatures	2025-05-27 03:38:11.289095
436	S0816	Skill in developing curriculum standards	2025-05-27 03:39:05.314787
347	S0707	Skill in developing comprehensive cyber operations assessment programs	2025-05-27 03:38:11.289095
348	S0708	Skill in executing comprehensive cyber operations assessment programs	2025-05-27 03:38:11.289095
349	S0709	Skill in developing analytics	2025-05-27 03:38:11.289095
350	S0710	Skill in evaluating metadata	2025-05-27 03:38:11.289095
351	S0711	Skill in interpreting metadata	2025-05-27 03:38:11.289095
352	S0712	Skill in evaluating data source quality	2025-05-27 03:38:11.289095
353	S0713	Skill in evaluating information quality	2025-05-27 03:38:11.289095
354	S0715	Skill in generating operation plans	2025-05-27 03:38:11.289095
355	S0718	Skill in identifying cybersecurity threats	2025-05-27 03:38:11.289095
356	S0719	Skill in identifying intelligence gaps	2025-05-27 03:38:11.289095
357	S0720	Skill in identifying regional languages and dialects	2025-05-27 03:38:11.289095
358	S0721	Skill in prioritizing information	2025-05-27 03:38:11.289095
359	S0722	Skill in interpreting traceroute results	2025-05-27 03:38:11.289095
360	S0723	Skill in interpreting vulnerability scanner results	2025-05-27 03:38:11.289095
361	S0724	Skill in managing client relationships	2025-05-27 03:38:11.289095
362	S0725	Skill in performing network visualization	2025-05-27 03:38:11.289095
363	S0726	Skill in performing data normalization	2025-05-27 03:38:11.289095
364	S0727	Skill in performing data fusion	2025-05-27 03:38:11.289095
365	S0728	Skill in preparing briefings	2025-05-27 03:38:11.289095
366	S0729	Skill in preparing plans	2025-05-27 03:38:11.289095
367	S0731	Skill in producing after-action reports	2025-05-27 03:38:11.289095
368	S0732	Skill in recognizing malicious network activity in traffic	2025-05-27 03:38:11.289095
369	S0733	Skill in interpreting malicious network activity in traffic	2025-05-27 03:38:11.289095
370	S0734	Skill in identifying technical information	2025-05-27 03:38:11.289095
371	S0735	Skill in programming	2025-05-27 03:38:11.289095
372	S0736	Skill in researching software vulnerabilities	2025-05-27 03:38:11.289095
373	S0737	Skill in researching software exploits	2025-05-27 03:38:11.289095
374	S0738	Skill in performing reverse engineering of software	2025-05-27 03:38:11.289095
375	S0739	Skill in analyzing intelligence products	2025-05-27 03:38:11.289095
376	S0741	Skill in administering servers	2025-05-27 03:38:11.289095
377	S0743	Skill in identifying network anomalies	2025-05-27 03:38:11.289095
378	S0744	Skill in performing technical writing	2025-05-27 03:38:11.289095
379	S0745	Skill in testing tools for implementation	2025-05-27 03:38:11.289095
380	S0746	Skill in evaluating tools for implementation	2025-05-27 03:38:11.289095
381	S0748	Skill in querying data	2025-05-27 03:38:11.289095
382	S0749	Skill in determining relevant information	2025-05-27 03:38:11.289095
383	S0751	Skill in conducting open-source searches	2025-05-27 03:38:11.289095
384	S0752	Skill in evading network detection	2025-05-27 03:38:11.289095
385	S0754	Skill in establishing persistence	2025-05-27 03:38:11.289095
386	S0755	Skill in reconstructing a network	2025-05-27 03:38:11.289095
387	S0756	Skill in incorporating feedback	2025-05-27 03:38:11.289095
388	S0757	Skill in verifying the integrity of files	2025-05-27 03:38:11.289095
389	S0758	Skill in performing wireless network analysis	2025-05-27 03:38:11.289095
390	S0759	Skill in identifying requirements	2025-05-27 03:38:11.289095
391	S0760	Skill in navigating databases	2025-05-27 03:38:11.289095
392	S0761	Skill in performing strategic guidance analysis	2025-05-27 03:38:11.289095
393	S0762	Skill in integrating organization objectives	2025-05-27 03:38:11.289095
394	S0764	Skill in comparing indicators with requirements	2025-05-27 03:38:11.289095
395	S0765	Skill in converting intelligence requirements into intelligence production tasks	2025-05-27 03:38:11.289095
396	S0766	Skill in coordinating product development	2025-05-27 03:38:11.289095
397	S0768	Skill in allocating resources	2025-05-27 03:38:11.289095
398	S0769	Skill in defining progress indicators	2025-05-27 03:38:11.289095
399	S0770	Skill in defining success indicators	2025-05-27 03:38:11.289095
400	S0771	Skill in creating planning documents	2025-05-27 03:38:11.289095
401	S0772	Skill in maintaining planning documents	2025-05-27 03:38:11.289095
402	S0773	Skill in tracking services	2025-05-27 03:38:11.289095
403	S0775	Skill in developing intelligence collection plans	2025-05-27 03:38:11.289095
404	S0777	Skill in developing collection strategies	2025-05-27 03:38:11.289095
405	S0779	Skill in determining information requirements	2025-05-27 03:38:11.289095
406	S0780	Skill in fulfilling information requests	2025-05-27 03:38:11.289095
407	S0782	Skill in determining capability estimates	2025-05-27 03:38:11.289095
408	S0783	Skill in creating decision support materials	2025-05-27 03:38:11.289095
409	S0784	Skill in implementing established procedures	2025-05-27 03:38:11.289095
410	S0785	Skill in interpreting planning guidance	2025-05-27 03:38:11.289095
411	S0786	Skill in interpreting readiness reporting	2025-05-27 03:38:11.289095
412	S0788	Skill in orchestrating planning teams	2025-05-27 03:38:11.289095
413	S0789	Skill in coordinating collection support	2025-05-27 03:38:11.289095
414	S0790	Skill in monitoring status	2025-05-27 03:38:11.289095
415	S0791	Skill in presenting to an audience	2025-05-27 03:38:11.289095
416	S0793	Skill in analyzing performance specifications	2025-05-27 03:38:11.289095
417	S0794	Skill in establishing timelines	2025-05-27 03:38:11.289095
418	S0796	Skill in creating privacy policies	2025-05-27 03:39:05.314787
419	S0797	Skill in negotiating vendor agreements	2025-05-27 03:39:05.314787
420	S0798	Skill in evaluating vendor privacy practices	2025-05-27 03:39:05.314787
421	S0799	Skill in anticipating new security threats	2025-05-27 03:39:05.314787
422	S0800	Skill in analyzing organizational patterns and relationships	2025-05-27 03:39:05.314787
423	S0801	Skill in assessing partner operations capabilities	2025-05-27 03:39:05.314787
424	S0804	Skill in assessing an organization's threat environment	2025-05-27 03:39:05.314787
425	S0805	Skill in designing incident responses	2025-05-27 03:39:05.314787
426	S0806	Skill in performing incident responses	2025-05-27 03:39:05.314787
427	S0807	Skill in solving problems	2025-05-27 03:39:05.314787
428	S0808	Skill in assessing an organization’s data assets	2025-05-27 03:39:05.314787
429	S0809	Skill in utilizing cyber defense service provider information	2025-05-27 03:39:05.314787
430	S0810	Skill in responding to threat reports	2025-05-27 03:39:05.314787
431	S0811	Skill in managing intelligence collection requirements	2025-05-27 03:39:05.314787
432	S0812	Skill in performing supply chain analysis	2025-05-27 03:39:05.314787
433	S0813	Skill in identifying cybersecurity issues in external connections	2025-05-27 03:39:05.314787
434	S0814	Skill in identifying privacy issues in partner interconnections	2025-05-27 03:39:05.314787
435	S0815	Skill in troubleshooting network equipment	2025-05-27 03:39:05.314787
437	S0817	Skill in building internal and external relationships	2025-05-27 03:39:05.314787
438	S0818	Skill in building internal and external stakeholder relationships	2025-05-27 03:39:05.314787
439	S0819	Skill in caching data	2025-05-27 03:39:05.314787
440	S0820	Skill in cataloging data	2025-05-27 03:39:05.314787
441	S0821	Skill in collaborating with internal and external stakeholders	2025-05-27 03:39:05.314787
442	S0822	Skill in collaborating with stakeholders	2025-05-27 03:39:05.314787
443	S0824	Skill in communicating with customers	2025-05-27 03:39:05.314787
444	S0825	Skill in communicating with engineering staff	2025-05-27 03:39:05.314787
445	S0826	Skill in communicating with external organizations	2025-05-27 03:39:05.314787
446	S0827	Skill in communicating with internal and external stakeholders	2025-05-27 03:39:05.314787
447	S0828	Skill in compiling data	2025-05-27 03:39:05.314787
448	S0829	Skill in conducting customer interviews	2025-05-27 03:39:05.314787
449	S0830	Skill in conducting feasibility studies	2025-05-27 03:39:05.314787
450	S0831	Skill in configuring hardware	2025-05-27 03:39:05.314787
451	S0832	Skill in cooperating with internal and external stakeholders	2025-05-27 03:39:05.314787
452	S0833	Skill in correlating incident data	2025-05-27 03:39:05.314787
453	S0834	Skill in developing technical reports	2025-05-27 03:39:05.314787
454	S0835	Skill in distributing data	2025-05-27 03:39:05.314787
455	S0836	Skill in encrypting data	2025-05-27 03:39:05.314787
456	S0837	Skill in executing computer scripts to automate tasks	2025-05-27 03:39:05.314787
457	S0838	Skill in identifying anomalous activities	2025-05-27 03:39:05.314787
458	S0839	Skill in identifying exploited system weaknesses	2025-05-27 03:39:05.314787
459	S0840	Skill in identifying misuse activities	2025-05-27 03:39:05.314787
460	S0841	Skill in identifying possible security violations	2025-05-27 03:39:05.314787
461	S0842	Skill in interpreting test results	2025-05-27 03:39:05.314787
462	S0843	Skill in maintaining data	2025-05-27 03:39:05.314787
463	S0844	Skill in managing account access rights	2025-05-27 03:39:05.314787
464	S0845	Skill in mapping networks	2025-05-27 03:39:05.314787
465	S0846	Skill in monitoring system activity	2025-05-27 03:39:05.314787
466	S0848	Skill in performing behavioral analysis	2025-05-27 03:39:05.314787
467	S0850	Skill in performing cost/benefit analysis	2025-05-27 03:39:05.314787
468	S0852	Skill in performing cyber defense trend analysis	2025-05-27 03:39:05.314787
469	S0853	Skill in performing cybersecurity architecture analysis	2025-05-27 03:39:05.314787
470	S0854	Skill in performing data analysis	2025-05-27 03:39:05.314787
471	S0855	Skill in performing data requirement analysis	2025-05-27 03:39:05.314787
472	S0856	Skill in performing digital evidence analysis	2025-05-27 03:39:05.314787
473	S0857	Skill in performing dynamic analysis	2025-05-27 03:39:05.314787
474	S0858	Skill in performing economic analysis	2025-05-27 03:39:05.314787
475	S0859	Skill in performing event correlation	2025-05-27 03:39:05.314787
476	S0860	Skill in performing file system forensic analysis	2025-05-27 03:39:05.314787
477	S0861	Skill in performing gap analysis	2025-05-27 03:39:05.314787
478	S0862	Skill in performing geospatial analysis	2025-05-27 03:39:05.314787
479	S0863	Skill in performing incident analysis	2025-05-27 03:39:05.314787
480	S0866	Skill in performing log file analysis	2025-05-27 03:39:05.314787
481	S0867	Skill in performing malicious activity analysis	2025-05-27 03:39:05.314787
482	S0868	Skill in performing market analysis	2025-05-27 03:39:05.314787
483	S0869	Skill in performing metadata analysis	2025-05-27 03:39:05.314787
484	S0870	Skill in performing needs analysis	2025-05-27 03:39:05.314787
485	S0871	Skill in performing network analysis	2025-05-27 03:39:05.314787
486	S0872	Skill in performing network data flow analysis	2025-05-27 03:39:05.314787
487	S0874	Skill in performing network traffic analysis	2025-05-27 03:39:05.314787
488	S0875	Skill in performing network traffic packet analysis	2025-05-27 03:39:05.314787
489	S0876	Skill in performing nodal analysis	2025-05-27 03:39:05.314787
490	S0877	Skill in performing quantitative analysis	2025-05-27 03:39:05.314787
491	S0878	Skill in performing risk analysis	2025-05-27 03:39:05.314787
492	S0879	Skill in performing scientific analysis	2025-05-27 03:39:05.314787
493	S0880	Skill in performing security architecture analysis	2025-05-27 03:39:05.314787
494	S0882	Skill in performing static analysis	2025-05-27 03:39:05.314787
495	S0883	Skill in performing static code analysis	2025-05-27 03:39:05.314787
496	S0884	Skill in performing static malware analysis	2025-05-27 03:39:05.314787
497	S0885	Skill in performing system activity analysis	2025-05-27 03:39:05.314787
498	S0886	Skill in performing system analysis	2025-05-27 03:39:05.314787
499	S0889	Skill in performing test result analysis	2025-05-27 03:39:05.314787
500	S0890	Skill in performing threat analysis	2025-05-27 03:39:05.314787
501	S0891	Skill in performing trade-off analysis	2025-05-27 03:39:05.314787
502	S0892	Skill in performing trend analysis	2025-05-27 03:39:05.314787
503	S0893	Skill in performing user needs analysis	2025-05-27 03:39:05.314787
504	S0896	Skill in recognizing behavioral patterns	2025-05-27 03:39:05.314787
505	S0897	Skill in retrieving data	2025-05-27 03:39:05.314787
506	S0898	Skill in testing hardware	2025-05-27 03:39:05.314787
507	S0899	Skill in testing interfaces	2025-05-27 03:39:05.314787
508	S0900	Skill in analyzing information from multiple sources	2025-05-27 03:39:05.314787
509	S0902	Skill in building relationships remotely and in person	2025-05-27 03:39:05.314787
510	S0904	Skill in correlating data from multiple tools	2025-05-27 03:39:05.314787
511	S0905	Skill in determining what information may helpful to a specific audience	2025-05-27 03:39:05.314787
512	S0906	Skill in identifying insider risk security gaps	2025-05-27 03:39:05.314787
513	S0907	Skill in identifying insider threats	2025-05-27 03:39:05.314787
514	S0908	Skill in determining the importance of assets	2025-05-27 03:39:05.314787
515	S0909	Skill in integrating information from multiple sources	2025-05-27 03:39:05.314787
516	S0910	Skill in performing cyberintelligence data analysis	2025-05-27 03:39:05.314787
517	S0911	Skill in performing data queries	2025-05-27 03:39:05.314787
518	S0912	Skill in performing human behavioral analysis	2025-05-27 03:39:05.314787
519	S0913	Skill in performing link analysis	2025-05-27 03:39:05.314787
520	S0916	Skill in recognizing recurring threat incidents	2025-05-27 03:39:05.314787
521	S0917	Skill in forecasting likely impacts on mission or business functions resulting from adversity	2025-05-27 03:39:05.314787
522	S0918	Skill in conducting ongoing monitoring of system properties and behaviors	2025-05-27 03:39:05.314787
523	S0919	Skill in evaluating threats, events, and courses of action in the context of mission or business functions	2025-05-27 03:39:05.314787
524	S0920	Skill in establishing segmentation of system assets based on criticality and trustworthiness	2025-05-27 03:39:05.314787
525	S0921	Skill in performing telemetry analysis	2025-05-27 03:39:05.314787
526	S0922	Skill in making decisions under conditions of uncertainty	2025-05-27 03:39:05.314787
527	S0923	Skill in communicating at varying levels of technical detail with stakeholders of various backgrounds	2025-05-27 03:39:05.314787
528	S0924	Skill in crisis management	2025-05-27 03:39:05.314787
529	S0925	Skill in developing and analyzing attack paths	2025-05-27 03:39:05.314787
530	S0926	Skill in designing and maintaining threat catalogs	2025-05-27 03:39:05.314787
531	S0927	Skill in defining contingency plans	2025-05-27 03:39:05.314787
532	S0928	Skill in defining loss scenarios	2025-05-27 03:39:05.314787
533	S0929	Skill in designing air-gapped data vault solutions	2025-05-27 03:39:05.314787
534	S0930	Skill in defining impact tolerance statements 	2025-05-27 03:39:05.314787
535	S0931	Skill in conducting technical business impact analysis	2025-05-27 03:39:05.314787
536	S0932	Skill in protecting critical assets	2025-05-27 03:39:05.314787
537	S0933	Skill in designing enhanced controls for critical assets	2025-05-27 03:39:05.314787
538	S0934	Skill in performing Fault Tree Analysis (FTA)	2025-05-27 03:39:05.314787
539	S0935	Skill in live acquisition	2025-05-27 03:39:05.314787
540	S0936	Skill in deadbox acquisition	2025-05-27 03:39:05.314787
541	S0937	Skill in inspecting data for ingestion	2025-05-27 03:39:05.314787
542	S0938	Skill in interacting with live systems to identify active and historical networks	2025-05-27 03:39:05.314787
543	S0939	Skill in performing event analysis	2025-05-27 03:39:05.314787
544	S0940	Skill in performing risk-based gap analysis	2025-05-27 03:39:05.314787
545	S0941	Skill in identifying gaps in control system network and connectivity architecture	2025-05-27 03:39:05.314787
546	S0942	Skill in performing system recovery for control system environments	2025-05-27 03:39:05.314787
547	S0943	Skill in connecting to OT assets	2025-05-27 03:39:05.314787
548	S0944	Skill in designing and specifying OT systems	2025-05-27 03:39:05.314787
549	S0945	Skill in evaluating OT vendor products	2025-05-27 03:39:05.314787
550	S0946	Skill in interpreting OT network drawings	2025-05-27 03:39:05.314787
551	S0947	Skill in interpreting risk assessments	2025-05-27 03:39:05.314787
552	S0948	Skill in performing zone conduit requirement analysis	2025-05-27 03:39:05.314787
553	S0949	Skill in recognizing and acknowledging unique contributions from varying skillsets	2025-05-27 03:39:05.314787
554	S0950	Skill in reviewing access control lists and firewall rules	2025-05-27 03:39:05.314787
555	S0951	Skill in securing control system communication protocols and media	2025-05-27 03:39:05.314787
\.


--
-- Data for Name: specialty_areas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.specialty_areas (id, code, name, description, category_id, created_at) FROM stdin;
33	NF-COM-001	Access Controls	This Competency Area describes a learner's capabilities to define, manage, and monitor the roles and secure access privileges of who is authorized to access protected data and resources and understand the impact of different types of access controls.	\N	2025-05-26 20:57:05.057782
34	NF-COM-002	Artificial Intelligence (AI) Security	This Competency Area describes a learner's capabilities to secure Artificial Intelligence (AI) against cyberattacks, to ensure it is adequately contained where it is used, and to mitigate the threat AI presents where it or its users have malicious intent	\N	2025-05-26 20:57:05.057782
35	NF-COM-003	Asset Management	This Competency Area describes a learner's capabilities to conduct and maintain an accurate inventory of all digital assets, to include identifying, developing, operating, maintaining, upgrading, and disposing of assets.	\N	2025-05-26 20:57:05.057782
36	NF-COM-004	Cloud Security	This Competency Area describes a learner's capabilities to protect cloud data, applications, and infrastructure from internal and external threats.	\N	2025-05-26 20:57:05.057782
37	NF-COM-005	Communications Security	This Competency Area describes a learner's capabilities to secure the transmissions, broadcasting, switching, control, and operation of communications and related network infrastructures.	\N	2025-05-26 20:57:05.057782
38	NF-COM-006	Cryptography	This Competency Area describes a learner's capabilities to transform data using cryptographic processes to ensure it can only be read by the person who is authorized to access it.	\N	2025-05-26 20:57:05.057782
39	NF-COM-007	Cyber Resiliency	This Competency Area describes a learner's capability related to architecting, designing, developing, implementing, and maintaining the trustworthiness of systems that use or are enabled by cyber resources in order to anticipate, withstand, recover from, and adapt to adverse conditions, stresses, attacks, or compromises.	\N	2025-05-26 20:57:05.057782
40	NF-COM-008	DevSecOps	This Competency Area describes a learner's capabilities to integrate security as a shared responsibility throughout the development, security, and operations (DevSecOps) life cycle of technologies.	\N	2025-05-26 20:57:05.057782
41	NF-COM-009	Operating Systems (OS) Security	This Competency Area describes a learner's capabilities to install, administer, troubleshoot, backup, and conduct recovery of Operating Systems (OS), including in simulated environments.	\N	2025-05-26 20:57:05.057782
42	NF-COM-010	Operational Technology (OT) Security	This Competency Area describes a learner's capabilities to improve and maintain the security of Operational Technology (OT) systems while addressing their unique performance, reliability, and safety requirements.	\N	2025-05-26 20:57:05.057782
43	NF-COM-011	Supply Chain Security	This Competency Area describes a learner's capabilities to analyze and control digital and physical risks presented by technology products or services purchased from parties outside your organization.	\N	2025-05-26 20:57:05.057782
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (id, code, description, created_at) FROM stdin;
514	T0006	Advocate organization's official position in legal and legislative proceedings	2025-05-27 02:27:16.423729
515	T0020	Develop content for cyber defense tools	2025-05-27 02:27:16.423729
516	T0067	Develop architectures or system components consistent with technical specifications	2025-05-27 02:27:16.423729
517	T0068	Develop data standards, policies, and procedures	2025-05-27 02:27:16.423729
518	T0077	Develop secure code and error handling	2025-05-27 02:27:16.423729
519	T0080	Develop test plans to address specifications and requirements	2025-05-27 02:27:16.423729
520	T0081	Diagnose network connectivity problems	2025-05-27 02:27:16.423729
521	T0084	Employ secure configuration management processes	2025-05-27 02:27:16.423729
522	T0101	Evaluate the effectiveness and comprehensiveness of existing training programs	2025-05-27 02:27:16.423729
523	T0116	Identify organizational policy stakeholders	2025-05-27 02:27:16.423729
524	T0122	Implement security designs for new or existing systems	2025-05-27 02:27:16.423729
525	T0124	Incorporate cybersecurity vulnerability solutions into system designs (e.g., Cybersecurity Vulnerability Alerts)	2025-05-27 02:27:16.423729
526	T0126	Install or replace network hubs, routers, and switches	2025-05-27 02:27:16.423729
527	T0129	Integrate new systems into existing network architecture	2025-05-27 02:27:16.423729
528	T0137	Maintain database management systems software	2025-05-27 02:27:16.423729
529	T0141	Maintain information systems assurance and accreditation materials	2025-05-27 02:27:16.423729
530	T0153	Monitor network capacity and performance	2025-05-27 02:27:16.423729
531	T0164	Perform cyber defense trend analysis and reporting	2025-05-27 02:27:16.423729
532	T0167	Perform file signature analysis	2025-05-27 02:27:16.423729
533	T0168	Perform data comparison against established database	2025-05-27 02:27:16.423729
534	T0172	Perform real-time forensic analysis (e.g., using Helix in conjunction with LiveView)	2025-05-27 02:27:16.423729
535	T0173	Perform timeline analysis	2025-05-27 02:27:16.423729
536	T0179	Perform static media analysis	2025-05-27 02:27:16.423729
537	T0182	Perform tier 1, 2, and 3 malware analysis	2025-05-27 02:27:16.423729
538	T0193	Process crime scenes	2025-05-27 02:27:16.423729
539	T0220	Resolve conflicts in laws, regulations, policies, standards, or procedures	2025-05-27 02:27:16.423729
540	T0226	Serve on agency and interagency policy boards	2025-05-27 02:27:16.423729
541	T0235	Translate functional requirements into technical solutions	2025-05-27 02:27:16.423729
542	T0237	Troubleshoot system hardware and software	2025-05-27 02:27:16.423729
543	T0262	Employ approved defense-in-depth principles and practices (e.g., defense-in-multiple places, layered defenses, security robustness)	2025-05-27 02:27:16.423729
544	T0271	Develop cybersecurity designs to meet specific operational needs and environmental factors (e.g., access controls, automated applications, networked operations, high integrity and availability requirements, multilevel security/processing of multiple classification levels, and processing Sensitive Compartmented Information)	2025-05-27 02:27:16.423729
545	T0274	Create auditable evidence of security measures	2025-05-27 02:27:16.423729
546	T0292	Recommend computing environment vulnerability corrections	2025-05-27 02:27:16.423729
547	T0299	Identify network mapping and operating system (OS) fingerprinting activities	2025-05-27 02:27:16.423729
548	T0309	Assess the effectiveness of security controls	2025-05-27 02:27:16.423729
549	T0311	Consult with customers about software system design and maintenance	2025-05-27 02:27:16.423729
550	T0330	Maintain assured message delivery systems	2025-05-27 02:27:16.423729
551	T0349	Collect metrics and trending data	2025-05-27 02:27:16.423729
552	T0383	Program custom algorithms	2025-05-27 02:27:16.423729
553	T0397	Perform Windows registry analysis	2025-05-27 02:27:16.423729
554	T0412	Conduct import/export reviews for acquiring systems and software	2025-05-27 02:27:16.423729
555	T0422	Implement data management standards, requirements, and specifications	2025-05-27 02:27:16.423729
556	T0431	Check system hardware availability, functionality, integrity, and efficiency	2025-05-27 02:27:16.423729
557	T0437	Correlate training and learning to business or mission requirements	2025-05-27 02:27:16.423729
558	T0459	Implement data mining and data warehousing applications	2025-05-27 02:27:16.423729
559	T0460	Develop and implement data mining and data warehousing programs	2025-05-27 02:27:16.423729
560	T0495	Manage Accreditation Packages (e.g., ISO/IEC 15026-2)	2025-05-27 02:27:16.423729
561	T0510	Coordinate incident response functions	2025-05-27 02:27:16.423729
562	T0512	Perform interoperability testing on systems exchanging electronic information with other systems	2025-05-27 02:27:16.423729
563	T0513	Perform operational testing	2025-05-27 02:27:16.423729
564	T0531	Troubleshoot hardware/software interface and interoperability problems	2025-05-27 02:27:16.423729
565	T0542	Translate proposed capabilities into technical requirements	2025-05-27 02:27:16.423729
566	T0569	Answer requests for information	2025-05-27 02:27:16.423729
567	T0685	Evaluate threat decision-making processes	2025-05-27 02:27:16.423729
568	T0686	Identify threat vulnerabilities	2025-05-27 02:27:16.423729
569	T0698	Facilitate continuously updated intelligence, surveillance, and visualization input to common operational picture managers	2025-05-27 02:27:16.423729
570	T0707	Generate requests for information	2025-05-27 02:27:16.423729
571	T0718	Identify intelligence gaps and shortfalls	2025-05-27 02:27:16.423729
572	T0734	Issue requests for information	2025-05-27 02:27:16.423729
573	T0751	Monitor open source websites for hostile content directed towards organizational or partner interests	2025-05-27 02:27:16.423729
574	T0775	Produce network reconstructions	2025-05-27 02:27:16.423729
575	T0818	Serve as a liaison with external partners	2025-05-27 02:27:16.423729
576	T0845	Identify cyber threat tactics and methodologies	2025-05-27 02:27:16.423729
577	T0898	Establish an internal privacy audit program	2025-05-27 02:27:16.423729
578	T0934	Identify stakeholder assets that require protection	2025-05-27 02:27:16.423729
579	T0937	Determine the placement of a system within the enterprise architecture	2025-05-27 02:27:16.423729
580	T0942	Identify the types of information to be processed, stored, or transmitted by a system	2025-05-27 02:27:16.423729
581	T0960	Monitor changes to a system and its environment of operation	2025-05-27 02:27:16.423729
582	T1008	Prepare and deliver education and awareness briefings	2025-05-27 02:27:16.423729
583	T1009	Create a cybersecurity awareness program	2025-05-27 02:27:16.423729
584	T1010	Communicate enterprise information technology architecture	2025-05-27 02:27:16.423729
585	T1011	Apply standards to identify safety risk and protect cyber-physical functions	2025-05-27 02:27:16.423729
586	T1012	Expand network access	2025-05-27 02:27:16.423729
587	T1013	Conduct technical exploitation of a target	2025-05-27 02:27:16.423729
588	T1014	Determine if security incidents require legal action	2025-05-27 02:27:16.423729
589	T1015	Identify roles and responsibilities for appointed Communications Security (COMSEC) personnel	2025-05-27 02:27:16.423729
590	T1016	Identify Communications Security (COMSEC) incidents	2025-05-27 02:27:16.423729
591	T1017	Report Communications Security (COMSEC) incidents	2025-05-27 02:27:16.423729
592	T1018	Identify in-process accounting requirements for Communications Security (COMSEC)	2025-05-27 02:27:16.423729
593	T1019	Determine special needs of cyber-physical systems	2025-05-27 02:27:16.423729
594	T1020	Determine the operational and safety impacts of cybersecurity lapses	2025-05-27 02:27:16.423729
595	T1021	Review cyber defense service provider reporting structure	2025-05-27 02:27:16.423729
596	T1022	Review enterprise information technology (IT) goals and objectives	2025-05-27 02:27:16.423729
597	T1023	Identify critical technology procurement requirements	2025-05-27 02:27:16.423729
598	T1024	Implement organizational security policies and procedures	2025-05-27 02:27:16.423729
599	T1025	Implement organizational training and education policies and procedures	2025-05-27 02:27:16.423729
600	T1026	Determine procurement requirements	2025-05-27 02:27:16.423729
601	T1027	Integrate organizational goals and objectives into security architecture	2025-05-27 02:27:16.423729
602	T1028	Research new vulnerabilities in emerging technologies	2025-05-27 02:27:16.423729
603	T1029	Implement organizational evaluation and validation criteria	2025-05-27 02:27:16.423729
604	T1030	Estimate the impact of collateral damage	2025-05-27 02:27:16.423729
605	T1031	Implement intelligence collection requirements	2025-05-27 02:27:16.423729
606	T1035	Determine how threat activity groups employ encryption to support their operations	2025-05-27 02:27:16.423729
607	T1036	Integrate leadership priorities	2025-05-27 02:27:16.423729
608	T1038	Integrate organization objectives in intelligence collection	2025-05-27 02:27:16.423729
609	T1039	Identify network artifacts	2025-05-27 02:27:16.423729
610	T1041	Determine impact of software configurations	2025-05-27 02:27:16.423729
611	T1043	Determine staffing needs	2025-05-27 02:27:16.423729
612	T1046	Assess operation performance	2025-05-27 02:27:16.423729
613	T1047	Assess operation impact	2025-05-27 02:27:16.423729
614	T1049	Determine appropriate level of test rigor for a given system	2025-05-27 02:30:48.667632
615	T1050	Improve network security practices	2025-05-27 02:30:48.667632
616	T1051	Set up a forensic workstation	2025-05-27 02:30:48.667632
617	T1052	Integrate black-box security testing tools into quality assurance processes	2025-05-27 02:30:48.667632
618	T1053	Identify and characterize intrusion activities against a victim or target	2025-05-27 02:30:48.667632
619	T1054	Scope analysis reports to various audiences that accounts for data sharing classification restrictions	2025-05-27 02:30:48.667632
620	T1055	Determine if priority information requirements are satisfied	2025-05-27 02:30:48.667632
621	T1056	Acquire resources to support cybersecurity program goals and objectives	2025-05-27 02:30:48.667632
622	T1057	Conduct an effective enterprise continuity of operations program	2025-05-27 02:30:48.667632
623	T1058	Advise senior management on risk levels and security posture	2025-05-27 02:30:48.667632
624	T1059	Perform cost/benefit analyses of cybersecurity programs, policies, processes, systems, and elements	2025-05-27 02:30:48.667632
625	T1060	Advise senior management on organizational cybersecurity efforts	2025-05-27 02:30:48.667632
626	T1061	Advise senior leadership and authorizing official of changes affecting the organization's cybersecurity posture	2025-05-27 02:30:48.667632
627	T1062	Contribute insider threat expertise to organizational cybersecurity awareness program	2025-05-27 02:30:48.667632
628	T1063	Determine data requirements	2025-05-27 02:30:48.667632
629	T1064	Determine data specifications	2025-05-27 02:30:48.667632
630	T1065	Determine data capacity requirements	2025-05-27 02:30:48.667632
631	T1066	Plan for anticipated changes in data capacity requirements	2025-05-27 02:30:48.667632
632	T1067	Recommend development of new applications or modification of existing applications	2025-05-27 02:30:48.667632
633	T1068	Create development plans for new applications or modification of existing applications	2025-05-27 02:30:48.667632
634	T1069	Evaluate organizational cybersecurity policy regulatory compliance	2025-05-27 02:30:48.667632
635	T1070	Evaluate organizational cybersecurity policy alignment with organizational directives	2025-05-27 02:30:48.667632
636	T1071	Evaluate software design plan timelines and cost estimates	2025-05-27 02:30:48.667632
637	T1072	Determine life cycle support requirements	2025-05-27 02:30:48.667632
638	T1073	Perform code reviews	2025-05-27 02:30:48.667632
639	T1074	Prepare secure code documentation	2025-05-27 02:30:48.667632
640	T1075	Implement application cybersecurity policies	2025-05-27 02:30:48.667632
641	T1076	Implement system cybersecurity policies	2025-05-27 02:30:48.667632
642	T1077	Assess the organization's cybersecurity architecture	2025-05-27 02:30:48.667632
643	T1078	Determine effectiveness of system cybersecurity measures	2025-05-27 02:30:48.667632
644	T1079	Develop cybersecurity risk profiles	2025-05-27 02:30:48.667632
645	T1081	Create product prototypes using working and theoretical models	2025-05-27 02:30:48.667632
646	T1082	Integrate software cybersecurity objectives into project plans and schedules	2025-05-27 02:30:48.667632
647	T1083	Determine project security controls	2025-05-27 02:30:48.667632
648	T1084	Identify anomalous network activity	2025-05-27 02:30:48.667632
649	T1085	Identify potential threats to network resources	2025-05-27 02:30:48.667632
650	T1086	Collect and maintain system cybersecurity report data	2025-05-27 02:30:48.667632
651	T1087	Create system cybersecurity reports	2025-05-27 02:30:48.667632
652	T1088	Communicate the value of cybersecurity to organizational stakeholders	2025-05-27 02:30:48.667632
653	T1089	Create program documentation during initial development and subsequent revision phases	2025-05-27 02:30:48.667632
654	T1090	Determine best methods for identifying the perpetrator(s) of a network intrusion	2025-05-27 02:30:48.667632
655	T1091	Perform authorized penetration testing on enterprise network assets	2025-05-27 02:30:48.667632
656	T1092	Conduct functional and connectivity testing	2025-05-27 02:30:48.667632
657	T1093	Conduct interactive training exercises	2025-05-27 02:30:48.667632
658	T1094	Conduct victim and witness interviews	2025-05-27 02:30:48.667632
659	T1095	Conduct suspect interrogations	2025-05-27 02:30:48.667632
660	T1096	Perform privacy impact assessments (PIAs)	2025-05-27 02:30:48.667632
661	T1097	Determine functional requirements and specifications	2025-05-27 02:30:48.667632
662	T1098	Determine system performance requirements	2025-05-27 02:30:48.667632
663	T1099	Design application interfaces	2025-05-27 02:30:48.667632
664	T1100	Configure network hubs, routers, and switches	2025-05-27 02:30:48.667632
665	T1101	Optimize network hubs, routers, and switches	2025-05-27 02:30:48.667632
666	T1102	Identify intrusions	2025-05-27 02:30:48.667632
667	T1103	Analyze intrusions	2025-05-27 02:30:48.667632
668	T1104	Document what is known about intrusions	2025-05-27 02:30:48.667632
669	T1105	Construct access paths to suites of information	2025-05-27 02:30:48.667632
670	T1106	Develop threat models	2025-05-27 02:30:48.667632
671	T1107	Evaluate functional requirements	2025-05-27 02:30:48.667632
672	T1108	Evaluate interfaces between hardware and software	2025-05-27 02:30:48.667632
673	T1109	Resolve cyber defense incidents	2025-05-27 02:30:48.667632
674	T1110	Coordinate technical support to enterprise-wide cybersecurity defense technicians	2025-05-27 02:30:48.667632
675	T1111	Administer rule and signature updates for specialized cyber defense applications	2025-05-27 02:30:48.667632
676	T1112	Validate network alerts	2025-05-27 02:30:48.667632
677	T1113	Develop the enterprise continuity of operations strategy	2025-05-27 02:30:48.667632
678	T1114	Establish the enterprise continuity of operations program	2025-05-27 02:30:48.667632
679	T1115	Oversee the development of design solutions	2025-05-27 02:30:48.667632
680	T1116	Correct program errors	2025-05-27 02:30:48.667632
681	T1117	Determine if desired program results are produced	2025-05-27 02:30:48.667632
682	T1118	Identify vulnerabilities	2025-05-27 02:30:48.667632
683	T1119	Recommend vulnerability remediation strategies	2025-05-27 02:30:48.667632
684	T1120	Create forensically sound duplicates of evidence	2025-05-27 02:30:48.667632
685	T1121	Decrypt seized data	2025-05-27 02:30:48.667632
686	T1122	Determine essential system capabilities and business functions	2025-05-27 02:30:48.667632
687	T1123	Prioritize essential system capabilities and business functions	2025-05-27 02:30:48.667632
688	T1124	Restore essential system capabilities and business functions after catastrophic failure events	2025-05-27 02:30:48.667632
689	T1125	Define system availability levels	2025-05-27 02:30:48.667632
690	T1126	Determine disaster recovery and continuity of operations system requirements	2025-05-27 02:30:48.667632
691	T1127	Define project scope and objectives	2025-05-27 02:30:48.667632
692	T1128	Design cybersecurity or cybersecurity-enabled products	2025-05-27 02:30:48.667632
693	T1129	Develop cybersecurity or cybersecurity-enabled products	2025-05-27 02:30:48.667632
694	T1130	Develop group policies and access control lists	2025-05-27 02:30:48.667632
695	T1131	Determine if hardware, operating systems, and software applications adequately address cybersecurity requirements	2025-05-27 02:30:48.667632
696	T1132	Design system data backup capabilities	2025-05-27 02:30:48.667632
697	T1133	Develop technical and procedural processes for integrity of stored backup data	2025-05-27 02:30:48.667632
698	T1134	Develop technical and procedural processes for backup data storage	2025-05-27 02:30:48.667632
699	T1135	Design and develop software systems	2025-05-27 02:30:48.667632
700	T1136	Determine level of assurance of developed capabilities	2025-05-27 02:30:48.667632
701	T1137	Investigate suspicious activity and alleged digital crimes	2025-05-27 02:30:48.667632
702	T1138	Create system testing and validation procedures and documentation	2025-05-27 02:30:48.667632
703	T1139	Develop systems design procedures and processes	2025-05-27 02:30:48.667632
704	T1140	Develop systems administration standard operating procedures	2025-05-27 02:30:48.667632
705	T1141	Document systems administration standard operating procedures	2025-05-27 02:30:48.667632
706	T1142	Validate data mining and data warehousing programs, processes, and requirements	2025-05-27 02:30:48.667632
707	T1143	Develop network backup and recovery procedures	2025-05-27 02:30:48.667632
708	T1144	Implement network backup and recovery procedures	2025-05-27 02:30:48.667632
709	T1145	Develop strategic plans	2025-05-27 02:30:48.667632
710	T1146	Maintain strategic plans	2025-05-27 02:30:48.667632
711	T1148	Develop systems security design documentation	2025-05-27 02:30:48.667632
712	T1149	Develop disaster recovery and continuity of operations plans for systems under development	2025-05-27 02:30:48.667632
713	T1150	Test disaster recovery and continuity of operations plans for systems prior to deployment	2025-05-27 02:30:48.667632
714	T1151	Develop cybersecurity designs for systems and networks with multilevel security requirements	2025-05-27 02:34:32.508849
715	T1152	Develop cybersecurity designs for systems and networks that require processing of multiple data classification levels	2025-05-27 02:34:32.508849
716	T1153	Integrate cybersecurity designs for systems and networks	2025-05-27 02:34:32.508849
717	T1154	Develop risk, compliance, and assurance monitoring strategies	2025-05-27 02:34:32.508849
718	T1155	Develop risk, compliance, and assurance measurement strategies	2025-05-27 02:34:32.508849
719	T1156	Develop awareness and training materials	2025-05-27 02:34:32.508849
720	T1157	Identify pertinent awareness and training materials	2025-05-27 02:34:32.508849
721	T1158	Develop cybersecurity implementation policies and guidelines	2025-05-27 02:34:32.508849
722	T1159	Create technical summary of findings reports	2025-05-27 02:34:32.508849
723	T1160	Develop risk mitigation strategies	2025-05-27 02:34:32.508849
724	T1161	Resolve system vulnerabilities	2025-05-27 02:34:32.508849
725	T1162	Recommend security changes to systems and system components	2025-05-27 02:34:32.508849
726	T1163	Develop cybersecurity countermeasures for systems and applications	2025-05-27 02:34:32.508849
727	T1164	Develop risk mitigation strategies for systems and applications	2025-05-27 02:34:32.508849
728	T1165	Develop risk, compliance, and assurance specifications	2025-05-27 02:34:32.508849
729	T1166	Document security, resilience, and dependability requirements	2025-05-27 02:34:32.508849
730	T1168	Define acquisition life cycle cybersecurity architecture requirements	2025-05-27 02:34:32.508849
731	T1169	Define acquisition life cycle systems security engineering requirements	2025-05-27 02:34:32.508849
732	T1170	Document preliminary or residual security risks for system operation	2025-05-27 02:34:32.508849
733	T1172	Determine if systems security operations and maintenance activities are property documented and updated	2025-05-27 02:34:32.508849
734	T1173	Determine that the application of security patches for commercial products meets timeline requirements	2025-05-27 02:34:32.508849
735	T1174	Document commercial product timeline requirements dictated by the management authority for intended operational environments	2025-05-27 02:34:32.508849
736	T1175	Determine if digital media chain or custody processes meet Federal Rules of Evidence requirements	2025-05-27 02:34:32.508849
737	T1176	Determine if cybersecurity-enabled products reduce identified risk to acceptable levels	2025-05-27 02:34:32.508849
738	T1177	Determine if security control technologies reduce identified risk to acceptable levels	2025-05-27 02:34:32.508849
739	T1178	Determine if security improvement actions are evaluated, validated, and implemented as required	2025-05-27 02:34:32.508849
740	T1179	Determine if systems and architecture are consistent with cybersecurity architecture guidelines	2025-05-27 02:34:32.508849
741	T1180	Determine if cybersecurity inspections, tests, and reviews are coordinated for the network environment	2025-05-27 02:34:32.508849
742	T1181	Determine if cybersecurity requirements are integrated into continuity planning	2025-05-27 02:34:32.508849
743	T1182	Determine if security engineering is used when acquiring or developing protection and detection capabilities	2025-05-27 02:34:32.508849
744	T1183	Determine if protection and detection capabilities are consistent with organization-level cybersecurity architecture	2025-05-27 02:34:32.508849
745	T1184	Establish stakeholder communication channels	2025-05-27 02:34:32.508849
746	T1185	Maintain stakeholder communication channels	2025-05-27 02:34:32.508849
747	T1186	Establish enterprise information security architecture	2025-05-27 02:34:32.508849
748	T1187	Establish internal and external cross-team relationships	2025-05-27 02:34:32.508849
749	T1188	Determine if baseline security safeguards are appropriately installed	2025-05-27 02:34:32.508849
750	T1189	Determine if contracts comply with funding, legal, and program requirements	2025-05-27 02:34:32.508849
751	T1190	Determine hardware configuration	2025-05-27 02:34:32.508849
752	T1191	Determine relevance of recovered data	2025-05-27 02:34:32.508849
753	T1192	Conduct analysis of computer network attacks	2025-05-27 02:34:32.508849
754	T1193	Allocate security functions to components and elements	2025-05-27 02:34:32.508849
755	T1194	Remediate technical problems encountered during system testing and implementation	2025-05-27 02:34:32.508849
756	T1195	Direct the remediation of technical problems encountered during system testing and implementation	2025-05-27 02:34:32.508849
757	T1196	Determine if security incidents are indicative of a violation of law that requires specific legal action	2025-05-27 02:34:32.508849
758	T1197	Identify common coding flaws	2025-05-27 02:34:32.508849
759	T1198	Identify data or intelligence of evidentiary value	2025-05-27 02:34:32.508849
760	T1199	Identify digital evidence for analysis	2025-05-27 02:34:32.508849
761	T1200	Identify elements of proof of cybersecurity crimes	2025-05-27 02:34:32.508849
762	T1201	Determine implications of new and upgraded technologies to the cybersecurity program	2025-05-27 02:34:32.508849
763	T1202	Determine software development security implications within centralized and decentralized environments across the enterprise	2025-05-27 02:34:32.508849
764	T1203	Implement software development cybersecurity methodologies within centralized and decentralized environments across the enterprise	2025-05-27 02:34:32.508849
765	T1204	Determine cybersecurity measures for steady state operation and management of software	2025-05-27 02:34:32.508849
766	T1205	Incorporate product end-of-life cybersecurity measures	2025-05-27 02:34:32.508849
767	T1206	Recommend cybersecurity or cybersecurity-enabled products for use within a system	2025-05-27 02:34:32.508849
768	T1207	Collect documentary or physical evidence of cyber intrusion incidents, investigations, and operations	2025-05-27 02:34:32.508849
769	T1208	Implement new system design procedures	2025-05-27 02:34:32.508849
770	T1209	Implement new system test procedures	2025-05-27 02:34:32.508849
771	T1210	Implement new system quality standards	2025-05-27 02:34:32.508849
772	T1212	Implement cybersecurity countermeasures for systems and applications	2025-05-27 02:34:32.508849
773	T1214	Install network infrastructure device operating system software	2025-05-27 02:34:32.508849
774	T1215	Maintain network infrastructure device operating system software	2025-05-27 02:34:32.508849
775	T1217	Determine if system analysis meets cybersecurity requirements	2025-05-27 02:34:32.508849
776	T1218	Integrate automated capabilities for updating or patching system software	2025-05-27 02:34:32.508849
777	T1219	Develop processes and procedures for manual updating and patching of system software	2025-05-27 02:34:32.508849
778	T1221	Disseminate incident and other Computer Network Defense (CND) information	2025-05-27 02:34:32.508849
779	T1222	Determine security requirements for new information technologies	2025-05-27 02:34:32.508849
780	T1223	Determine security requirements for new operational technologies	2025-05-27 02:34:32.508849
781	T1224	Determine impact of noncompliance on organizational risk levels	2025-05-27 02:34:32.508849
782	T1225	Determine impact of noncompliance on effectiveness of the enterprise's cybersecurity program	2025-05-27 02:34:32.508849
783	T1226	Align cybersecurity priorities with organizational security strategy	2025-05-27 02:34:32.508849
784	T1227	Manage cybersecurity budget, staffing, and contracting	2025-05-27 02:34:32.508849
785	T1228	Maintain baseline system security	2025-05-27 02:34:32.508849
786	T1229	Maintain deployable cyber defense audit toolkits	2025-05-27 02:34:32.508849
787	T1230	Maintain directory replication services	2025-05-27 02:34:32.508849
788	T1231	Maintain information exchanges through publish, subscribe, and alert functions	2025-05-27 02:34:32.508849
789	T1232	Approve accreditation packages	2025-05-27 02:34:32.508849
790	T1233	Monitor cybersecurity data sources	2025-05-27 02:34:32.508849
791	T1234	Develop Computer Network Defense (CND) guidance for organizational stakeholders	2025-05-27 02:34:32.508849
792	T1235	Manage threat and target analysis	2025-05-27 02:34:32.508849
793	T1236	Manage the production of threat information	2025-05-27 02:34:32.508849
794	T1237	Determine if systems comply with security, resilience, and dependability requirements	2025-05-27 02:34:32.508849
795	T1238	Determine the effectiveness of enterprise cybersecurity safeguards	2025-05-27 02:34:32.508849
796	T1239	Monitor the usage of knowledge management assets and resources	2025-05-27 02:34:32.508849
797	T1240	Create knowledge management assets and resources usage reports	2025-05-27 02:34:32.508849
798	T1241	Document cybersecurity incidents	2025-05-27 02:34:32.508849
799	T1242	Escalate incidents that may cause ongoing and immediate impact to the environment	2025-05-27 02:34:32.508849
800	T1243	Oversee configuration management	2025-05-27 02:34:32.508849
801	T1244	Develop configuration management recommendations	2025-05-27 02:34:32.508849
802	T1245	Oversee the cybersecurity training and awareness program	2025-05-27 02:34:32.508849
803	T1246	Establish Security Assessment and Authorization processes	2025-05-27 02:34:32.508849
804	T1247	Develop computer environment cybersecurity plans and requirements	2025-05-27 02:34:32.508849
805	T1248	Patch network vulnerabilities	2025-05-27 02:34:32.508849
806	T1249	Perform backup and recovery of databases	2025-05-27 02:34:32.508849
807	T1250	Perform cyber defense incident triage	2025-05-27 02:34:32.508849
808	T1251	Recommend incident remediation strategies	2025-05-27 02:34:32.508849
809	T1252	Determine the scope, urgency, and impact of cyber defense incidents	2025-05-27 02:34:32.508849
810	T1253	Perform dynamic analysis on drives	2025-05-27 02:34:32.508849
811	T1254	Determine the effectiveness of an observed attack	2025-05-27 02:34:32.508849
812	T1255	Perform cybersecurity testing of developed applications and systems	2025-05-27 02:34:32.508849
813	T1256	Perform forensically sound image collection	2025-05-27 02:34:32.508849
814	T1257	Recommend mitigation and remediation strategies for enterprise systems	2025-05-27 02:35:32.639697
815	T1258	Perform integrated quality assurance testing	2025-05-27 02:35:32.639697
816	T1259	Identify opportunities for new and improved business process solutions	2025-05-27 02:35:32.639697
817	T1260	Perform real-time cyber defense incident handling	2025-05-27 02:35:32.639697
818	T1261	Mitigate programming vulnerabilities	2025-05-27 02:35:32.639697
819	T1262	Identify programming code flaws	2025-05-27 02:35:32.639697
820	T1263	Perform security reviews	2025-05-27 02:35:32.639697
821	T1264	Identify gaps in security architecture	2025-05-27 02:35:32.639697
822	T1265	Develop a cybersecurity risk management plan	2025-05-27 02:35:32.639697
823	T1266	Recommend risk mitigation strategies	2025-05-27 02:35:32.639697
824	T1267	Perform system administration on specialized cyber defense applications and systems	2025-05-27 02:35:32.639697
825	T1268	Administer Virtual Private Network (VPN) devices	2025-05-27 02:35:32.639697
826	T1269	Conduct risk analysis of applications and systems undergoing major changes	2025-05-27 02:35:32.639697
827	T1270	Plan security authorization reviews for system and network installations	2025-05-27 02:35:32.639697
828	T1271	Conduct security authorization reviews for system and network installations	2025-05-27 02:35:32.639697
829	T1272	Develop security assurance cases for system and network installations	2025-05-27 02:35:32.639697
830	T1273	Plan knowledge management projects	2025-05-27 02:35:32.639697
831	T1274	Deliver knowledge management projects	2025-05-27 02:35:32.639697
832	T1275	Determine the effectiveness of data redundancy and system recovery procedures	2025-05-27 02:35:32.639697
833	T1276	Develop data redundancy and system recovery procedures	2025-05-27 02:35:32.639697
834	T1277	Execute data redundancy and system recovery procedures	2025-05-27 02:35:32.639697
835	T1278	Recommend system modifications	2025-05-27 02:35:32.639697
836	T1279	Prepare audit reports	2025-05-27 02:35:32.639697
837	T1280	Develop workflow charts and diagrams	2025-05-27 02:35:32.639697
838	T1281	Convert workflow charts and diagrams into coded computer language instructions	2025-05-27 02:35:32.639697
839	T1282	Prepare digital media for imaging	2025-05-27 02:35:32.639697
840	T1283	Develop cybersecurity use cases	2025-05-27 02:35:32.639697
841	T1284	Develop standard operating procedures for secure network system operations	2025-05-27 02:35:32.639697
842	T1285	Distribute standard operating procedures	2025-05-27 02:35:32.639697
843	T1286	Maintain standard operating procedures	2025-05-27 02:35:32.639697
844	T1287	Document systems security activities	2025-05-27 02:35:32.639697
845	T1288	Prepare technical evaluations of software applications, systems, and networks	2025-05-27 02:35:32.639697
846	T1289	Document software application, system, and network security postures, capabilities, and vulnerabilities	2025-05-27 02:35:32.639697
847	T1290	Communicate daily network event and activity reports	2025-05-27 02:35:32.639697
848	T1291	Advise stakeholders on the development of continuity of operations plans	2025-05-27 02:35:32.639697
849	T1292	Develop guidelines for implementing developed systems for customers and installation teams	2025-05-27 02:35:32.639697
850	T1293	Advise on security requirements to be included in statements of work	2025-05-27 02:35:32.639697
851	T1294	Advise on Risk Management Framework process activities and documentation	2025-05-27 02:35:32.639697
852	T1295	Provide cybersecurity awareness and training	2025-05-27 02:35:32.639697
853	T1296	Recommend data structures for use in the production of reports	2025-05-27 02:35:32.639697
854	T1297	Recommend new database technologies and architectures	2025-05-27 02:35:32.639697
855	T1298	Communicate situational awareness information to leadership	2025-05-27 02:35:32.639697
856	T1299	Determine causes of network alerts	2025-05-27 02:35:32.639697
857	T1300	Report cybersecurity incidents	2025-05-27 02:35:32.639697
858	T1301	Report forensic artifacts indicative of a particular operating system	2025-05-27 02:35:32.639697
859	T1302	Address security implications in the software acceptance phase	2025-05-27 02:35:32.639697
860	T1303	Recommend new or revised security, resilience, and dependability measures	2025-05-27 02:35:32.639697
861	T1304	Recommend organizational cybersecurity resource allocations	2025-05-27 02:35:32.639697
862	T1305	Determine if authorization and assurance documents identify an acceptable level of risk for software applications, systems, and networks	2025-05-27 02:35:32.639697
863	T1306	Conduct technology program and project audits	2025-05-27 02:35:32.639697
864	T1307	Develop cybersecurity policy recommendations	2025-05-27 02:35:32.639697
865	T1308	Coordinate cybersecurity policy review and approval processes	2025-05-27 02:35:32.639697
866	T1309	Analyze system capabilities and requirements	2025-05-27 02:35:32.639697
867	T1310	Implement protective or corrective measures when a cybersecurity incident or vulnerability is discovered	2025-05-27 02:35:32.639697
868	T1311	Design and execute exercise scenarios	2025-05-27 02:35:32.639697
869	T1312	Conduct test and evaluation activities	2025-05-27 02:35:32.639697
870	T1313	Test network infrastructure, including software and hardware devices	2025-05-27 02:35:32.639697
871	T1314	Maintain network infrastructure, including software and hardware devices	2025-05-27 02:35:32.639697
872	T1315	Track cyber defense incidents from initial detection through final resolution	2025-05-27 02:35:32.639697
873	T1316	Document cyber defense incidents from initial detection through final resolution	2025-05-27 02:35:32.639697
874	T1317	Determine if appropriate threat mitigation actions have been taken	2025-05-27 02:35:32.639697
875	T1318	Integrate security requirements into application design elements	2025-05-27 02:35:32.639697
876	T1319	Document software attack surface elements	2025-05-27 02:35:32.639697
877	T1320	Conduct threat modeling	2025-05-27 02:35:32.639697
878	T1321	Manage computing environment system operations	2025-05-27 02:35:32.639697
879	T1322	Capture network traffic associated with malicious activities	2025-05-27 02:35:32.639697
880	T1323	Analyze network traffic associated with malicious activities	2025-05-27 02:35:32.639697
881	T1324	Process digital evidence	2025-05-27 02:35:32.639697
882	T1325	Document digital evidence	2025-05-27 02:35:32.639697
883	T1326	Develop system performance predictions for various operating conditions	2025-05-27 02:35:32.639697
884	T1327	Update security documentation to reflect current application and system security design features	2025-05-27 02:35:32.639697
885	T1328	Verify implementation of software, network, and system cybersecurity postures	2025-05-27 02:35:32.639697
886	T1329	Document software, network, and system deviations from implemented security postures	2025-05-27 02:35:32.639697
887	T1330	Recommend required actions to correct software, network, and system deviations from implemented security postures	2025-05-27 02:35:32.639697
888	T1331	Verify currency of software application, network, and system accreditation and assurance documentation	2025-05-27 02:35:32.639697
889	T1332	Produce incident findings reports	2025-05-27 02:35:32.639697
890	T1333	Communicate incident findings to appropriate constituencies	2025-05-27 02:35:32.639697
891	T1334	Produce cybersecurity instructional materials	2025-05-27 02:35:32.639697
892	T1335	Promote cybersecurity awareness to management	2025-05-27 02:35:32.639697
893	T1336	Verify the inclusion of sound cybersecurity principles in the organization's vision and goals	2025-05-27 02:35:32.639697
894	T1337	Identify system and network capabilities	2025-05-27 02:35:32.639697
895	T1338	Develop cybersecurity capability strategies for custom hardware and software development	2025-05-27 02:35:32.639697
896	T1339	Develop cybersecurity compliance processes for external services	2025-05-27 02:35:32.639697
897	T1340	Develop cybersecurity audit processes for external services	2025-05-27 02:35:32.639697
898	T1341	Perform required reviews	2025-05-27 02:35:32.639697
899	T1342	Oversee policy standards and implementation strategy development	2025-05-27 02:35:32.639697
900	T1343	Provide cybersecurity guidance to organizational risk governance processes	2025-05-27 02:35:32.639697
901	T1344	Determine if procurement activities sufficiently address supply chain risks	2025-05-27 02:35:32.639697
902	T1345	Recommend improvements to procurement activities to address cybersecurity requirements	2025-05-27 02:35:32.639697
903	T1346	Determine if system requirements are adequately demonstrated in data samples	2025-05-27 02:35:32.639697
904	T1347	Detect cybersecurity attacks and intrusions	2025-05-27 02:35:32.639697
905	T1348	Distinguish between benign and potentially malicious cybersecurity attacks and intrusions	2025-05-27 02:35:32.639697
906	T1349	Communicate cybersecurity attacks and intrusions alerts	2025-05-27 02:35:32.639697
907	T1350	Perform continuous monitoring of system activity	2025-05-27 02:35:32.639697
908	T1351	Determine impact of malicious activity on systems and information	2025-05-27 02:35:32.639697
909	T1352	Coordinate critical cyber defense infrastructure protection measures	2025-05-27 02:35:32.639697
910	T1353	Prioritize critical cyber defense infrastructure resources	2025-05-27 02:35:32.639697
911	T1354	Identify system cybersecurity requirements	2025-05-27 02:35:32.639697
912	T1355	Determine if vulnerability remediation plans are in place	2025-05-27 02:35:32.639697
913	T1356	Develop vulnerability remediation plans	2025-05-27 02:35:32.639697
914	T1357	Determine if cybersecurity requirements have been successfully implemented	2025-05-27 02:38:15.560565
915	T1358	Determine the effectiveness of organizational cybersecurity policies and procedures	2025-05-27 02:38:15.560565
916	T1359	Perform penetration testing	2025-05-27 02:38:15.560565
917	T1360	Design programming language exploitation countermeasures and mitigations	2025-05-27 02:38:15.560565
918	T1361	Determine the impact of new system and interface implementations on organization's cybersecurity posture	2025-05-27 02:38:15.560565
919	T1362	Document impact of new system and interface implementations on organization's cybersecurity posture	2025-05-27 02:38:15.560565
920	T1363	Plan system security development	2025-05-27 02:38:15.560565
921	T1364	Conduct system security development	2025-05-27 02:38:15.560565
922	T1365	Document cybersecurity design and development activities	2025-05-27 02:38:15.560565
923	T1366	Identify supply chain risks for critical system elements	2025-05-27 02:38:15.560565
924	T1367	Document supply chain risks for critical system elements	2025-05-27 02:38:15.560565
925	T1368	Support cybersecurity compliance activities	2025-05-27 02:38:15.560565
926	T1369	Determine if acquisitions, procurement, and outsourcing efforts address cybersecurity requirements	2025-05-27 02:38:15.560565
927	T1370	Collect intrusion artifacts	2025-05-27 02:38:15.560565
928	T1371	Mitigate potential cyber defense incidents	2025-05-27 02:38:15.560565
929	T1372	Advise law enforcement personnel as technical expert	2025-05-27 02:38:15.560565
930	T1373	Determine organizational compliance	2025-05-27 02:38:15.560565
931	T1374	Forecast ongoing service demands	2025-05-27 02:38:15.560565
932	T1375	Conduct periodic reviews of security assumptions	2025-05-27 02:38:15.560565
933	T1376	Develop critical infrastructure protection policies and procedures	2025-05-27 02:38:15.560565
934	T1377	Implement critical infrastructure protection policies and procedures	2025-05-27 02:38:15.560565
935	T1378	Identify cybersecurity solutions tools and technologies	2025-05-27 02:38:15.560565
936	T1379	Design cybersecurity tools and technologies	2025-05-27 02:38:15.560565
937	T1380	Develop cybersecurity tools and technologies	2025-05-27 02:38:15.560565
938	T1381	Scan digital media for viruses	2025-05-27 02:38:15.560565
939	T1382	Mount a drive image	2025-05-27 02:38:15.560565
940	T1383	Utilize deployable forensics toolkit	2025-05-27 02:38:15.560565
941	T1384	Establish intrusion set procedures	2025-05-27 02:38:15.560565
942	T1386	Analyze network traffic anomalies	2025-05-27 02:38:15.560565
943	T1387	Validate intrusion detection system alerts	2025-05-27 02:38:15.560565
944	T1388	Isolate malware	2025-05-27 02:38:15.560565
945	T1389	Remove malware	2025-05-27 02:38:15.560565
946	T1390	Identify network device applications and operating systems	2025-05-27 02:38:15.560565
947	T1391	Reconstruct malicious attacks	2025-05-27 02:38:15.560565
948	T1392	Develop user experience requirements	2025-05-27 02:38:15.560565
949	T1393	Document user experience requirements	2025-05-27 02:38:15.560565
950	T1394	Develop independent cybersecurity audit processes for application software, networks, and systems	2025-05-27 02:38:15.560565
951	T1395	Implement independent cybersecurity audit processes for application software, networks, and systems	2025-05-27 02:38:15.560565
952	T1396	Oversee independent cybersecurity audits	2025-05-27 02:38:15.560565
953	T1397	Determine if research and design processes and procedures are in compliance with cybersecurity requirements	2025-05-27 02:38:15.560565
954	T1398	Determine if research and design processes and procedures are accurately followed by cybersecurity staff when performing their day-to-day activities	2025-05-27 02:38:15.560565
955	T1399	Develop supply chain, system, network, and operational security contract language	2025-05-27 02:38:15.560565
956	T1400	Design and develop secure applications	2025-05-27 02:38:15.560565
957	T1401	Integrate system development life cycle methodologies into development environment	2025-05-27 02:38:15.560565
958	T1402	Manage databases and data management systems	2025-05-27 02:38:15.560565
959	T1403	Allocate cybersecurity services	2025-05-27 02:38:15.560565
960	T1404	Select cybersecurity mechanisms	2025-05-27 02:38:15.560565
961	T1405	Identify emerging incident trends	2025-05-27 02:38:15.560565
962	T1406	Construct cyber defense network tool signatures	2025-05-27 02:38:15.560565
963	T1407	Correlate threat assessment data	2025-05-27 02:38:15.560565
964	T1408	Develop quality standards	2025-05-27 02:38:15.560565
965	T1409	Document quality standards	2025-05-27 02:38:15.560565
966	T1410	Develop system security contexts	2025-05-27 02:38:15.560565
967	T1411	Develop technical training curriculum and resources	2025-05-27 02:38:15.560565
968	T1412	Deliver technical training to customers	2025-05-27 02:38:15.560565
969	T1413	Develop training modules and classes	2025-05-27 02:38:15.560565
970	T1414	Develop training assignments	2025-05-27 02:38:15.560565
971	T1415	Develop training evaluations	2025-05-27 02:38:15.560565
972	T1416	Develop grading and proficiency standards	2025-05-27 02:38:15.560565
973	T1417	Create learner development, training, and remediation plans	2025-05-27 02:38:15.560565
974	T1418	Develop learning objectives and goals	2025-05-27 02:38:15.560565
975	T1419	Develop organizational training materials	2025-05-27 02:38:15.560565
976	T1420	Develop organizational training programs	2025-05-27 02:38:15.560565
977	T1421	Develop proficiency assessments	2025-05-27 02:38:15.560565
978	T1422	Develop software documentation	2025-05-27 02:38:15.560565
979	T1423	Create system security concept of operations (ConOps) documents	2025-05-27 02:38:15.560565
980	T1424	Evaluate network infrastructure vulnerabilities	2025-05-27 02:38:15.560565
981	T1425	Recommend network infrastructure enhancements	2025-05-27 02:38:15.560565
982	T1426	Determine cybersecurity design and architecture effectiveness	2025-05-27 02:38:15.560565
983	T1427	Maintain incident tracking and solution databases	2025-05-27 02:38:15.560565
984	T1428	Notify designated managers, cyber incident responders, and cybersecurity service provider team members of suspected cybersecurity incidents	2025-05-27 02:38:15.560565
985	T1429	Prepare trend analysis reports	2025-05-27 02:38:15.560565
986	T1430	Determine if system components can be aligned	2025-05-27 02:38:15.560565
987	T1431	Integrate system components	2025-05-27 02:38:15.560565
988	T1432	Build dedicated cyber defense hardware	2025-05-27 02:38:15.560565
989	T1433	Install dedicated cyber defense hardware	2025-05-27 02:38:15.560565
990	T1434	Create cybersecurity architecture functional specifications	2025-05-27 02:38:15.560565
991	T1435	Determine if technology services are delivered successfully	2025-05-27 02:38:15.560565
992	T1436	Acquire adequate funding for cybersecurity training	2025-05-27 02:38:15.560565
993	T1437	Determine effectiveness of configuration management processes	2025-05-27 02:38:15.560565
994	T1438	Determine effectiveness of instruction and training	2025-05-27 02:38:15.560565
995	T1439	Assess the behavior of individual victims, witnesses, or suspects during cybersecurity investigations	2025-05-27 02:38:15.560565
996	T1440	Assess the validity of source data	2025-05-27 02:38:15.560565
997	T1441	Determine the validity of findings	2025-05-27 02:38:15.560565
998	T1442	Assess the impact of implementing and sustaining a dedicated cyber defense infrastructure	2025-05-27 02:38:15.560565
999	T1443	Recommend commercial, government off-the-shelf, or open source products for use within a system	2025-05-27 02:38:15.560565
1000	T1444	Determine if products comply with cybersecurity requirements	2025-05-27 02:38:15.560565
1001	T1445	Conduct hypothesis testing	2025-05-27 02:38:15.560565
1002	T1446	Conduct learning needs assessments	2025-05-27 02:38:15.560565
1003	T1447	Identify training requirements	2025-05-27 02:38:15.560565
1004	T1448	Manage customer services	2025-05-27 02:38:15.560565
1005	T1449	Determine if qualification standards meet organizational functional requirements and comply with industry standards	2025-05-27 02:38:15.560565
1006	T1450	Allocate and distribute human capital assets	2025-05-27 02:38:15.560565
1007	T1451	Create interactive learning exercises	2025-05-27 02:38:15.560565
1008	T1452	Design system administration and management functionality for privileged access users	2025-05-27 02:38:15.560565
1009	T1453	Develop system administration and management functionality for privileged access users	2025-05-27 02:38:15.560565
1010	T1454	Design secure interfaces between information systems, physical systems, and embedded technologies	2025-05-27 02:38:15.560565
1011	T1455	Implement secure interfaces between information systems, physical systems, and embedded technologies	2025-05-27 02:38:15.560565
1012	T1456	Determine the impact of threats on cybersecurity	2025-05-27 02:38:15.560565
1013	T1457	Implement threat countermeasures	2025-05-27 02:38:15.560565
1014	T1458	Develop data gathering processes	2025-05-27 02:41:00.94666
1015	T1459	Develop standardized cybersecurity position descriptions using the NICE Framework	2025-05-27 02:41:00.94666
1016	T1460	Develop recruiting, hiring, and retention processes	2025-05-27 02:41:00.94666
1017	T1461	Determine cybersecurity position requirements	2025-05-27 02:41:00.94666
1018	T1462	Develop cybersecurity training policies and procedures	2025-05-27 02:41:00.94666
1019	T1463	Develop cybersecurity curriculum goals and objectives	2025-05-27 02:41:00.94666
1020	T1464	Determine if cybersecurity workforce management policies and procedures comply with legal and organizational requirements	2025-05-27 02:41:00.94666
1021	T1465	Define service-level agreements (SLAs)	2025-05-27 02:41:00.94666
1022	T1466	Establish cybersecurity workforce readiness metrics	2025-05-27 02:41:00.94666
1023	T1467	Establish waiver processes for cybersecurity career field entry and training qualification requirements	2025-05-27 02:41:00.94666
1024	T1468	Establish organizational cybersecurity career pathways	2025-05-27 02:41:00.94666
1025	T1469	Develop cybersecurity workforce reporting requirements	2025-05-27 02:41:00.94666
1026	T1470	Establish cybersecurity workforce management programs	2025-05-27 02:41:00.94666
1027	T1471	Assess cybersecurity workforce management programs	2025-05-27 02:41:00.94666
1028	T1472	Gather customer satisfaction and service performance feedback	2025-05-27 02:41:00.94666
1029	T1473	Create risk-driven systems maintenance and updates processes	2025-05-27 02:41:00.94666
1030	T1474	Define operating level agreements (OLAs)	2025-05-27 02:41:00.94666
1031	T1475	Develop instructional strategies	2025-05-27 02:41:00.94666
1032	T1476	Promote awareness of cybersecurity policy and strategy among management	2025-05-27 02:41:00.94666
1033	T1477	Advise trial counsel as technical expert	2025-05-27 02:41:00.94666
1034	T1478	Determine cybersecurity career field qualification requirements	2025-05-27 02:41:00.94666
1035	T1479	Determine organizational policies related to or influencing the cyber workforce	2025-05-27 02:41:00.94666
1036	T1480	Examine service performance reports for issues and variances	2025-05-27 02:41:00.94666
1037	T1481	Initiate corrective actions to service performance issues and variances	2025-05-27 02:41:00.94666
1038	T1482	Conduct cybersecurity workforce assessments	2025-05-27 02:41:00.94666
1039	T1483	Integrate cybersecurity workforce personnel into information systems life cycle development processes	2025-05-27 02:41:00.94666
1040	T1484	Establish testing specifications and requirements	2025-05-27 02:41:00.94666
1041	T1485	Prepare after action reviews (AARs)	2025-05-27 02:41:00.94666
1042	T1486	Process forensic images	2025-05-27 02:41:00.94666
1043	T1487	Perform file and registry monitoring on running systems	2025-05-27 02:41:00.94666
1044	T1488	Enter digital media information into tracking databases	2025-05-27 02:41:00.94666
1045	T1489	Correlate incident data	2025-05-27 02:41:00.94666
1046	T1490	Prepare cyber defense toolkits	2025-05-27 02:41:00.94666
1047	T1491	Design data management systems	2025-05-27 02:41:00.94666
1048	T1492	Integrate laws and regulations into policy	2025-05-27 02:41:00.94666
1049	T1493	Troubleshoot prototype design and process issues	2025-05-27 02:41:00.94666
1050	T1494	Recommend vulnerability exploitation functional and security-related features	2025-05-27 02:41:00.94666
1051	T1495	Recommend vulnerability mitigation functional- and security-related features	2025-05-27 02:41:00.94666
1052	T1496	Develop reverse engineering tools	2025-05-27 02:41:00.94666
1053	T1497	Determine supply chain cybersecurity requirements	2025-05-27 02:41:00.94666
1054	T1498	Determine if cybersecurity requirements included in contracts are delivered	2025-05-27 02:41:00.94666
1055	T1499	Integrate public key cryptography into applications	2025-05-27 02:41:00.94666
1056	T1500	Install systems and servers	2025-05-27 02:41:00.94666
1057	T1501	Update systems and servers	2025-05-27 02:41:00.94666
1058	T1502	Troubleshoot systems and servers	2025-05-27 02:41:00.94666
1059	T1503	Evaluate platforms managed by service providers	2025-05-27 02:41:00.94666
1060	T1504	Manage organizational knowledge repositories	2025-05-27 02:41:00.94666
1061	T1505	Analyze cybersecurity threats for counter intelligence or criminal activity	2025-05-27 02:41:00.94666
1062	T1506	Analyze software and hardware testing results	2025-05-27 02:41:00.94666
1063	T1507	Determine user requirements	2025-05-27 02:41:00.94666
1064	T1508	Plan cybersecurity architecture	2025-05-27 02:41:00.94666
1065	T1509	Analyze feasibility of software design within time and cost constraints	2025-05-27 02:41:00.94666
1066	T1510	Preserve digital evidence	2025-05-27 02:41:00.94666
1067	T1511	Identify alleged violations of law, regulations, policy, or guidance	2025-05-27 02:41:00.94666
1068	T1512	Perform periodic system maintenance	2025-05-27 02:41:00.94666
1069	T1513	Conduct trial runs of programs and software applications	2025-05-27 02:41:00.94666
1070	T1514	Determine accurate security levels in programs and software applications	2025-05-27 02:41:00.94666
1071	T1515	Manage network access control lists on specialized cyber defense systems	2025-05-27 02:41:00.94666
1072	T1516	Detect concealed data	2025-05-27 02:41:00.94666
1073	T1517	Deliver training courses	2025-05-27 02:41:00.94666
1074	T1518	Develop organizational cybersecurity strategy	2025-05-27 02:41:00.94666
1075	T1519	Design system security measures	2025-05-27 02:41:00.94666
1076	T1520	Update system security measures	2025-05-27 02:41:00.94666
1077	T1521	Develop enterprise architecture	2025-05-27 02:41:00.94666
1078	T1522	Determine if systems meet minimum security requirements	2025-05-27 02:41:00.94666
1079	T1523	Design organizational knowledge management frameworks	2025-05-27 02:41:00.94666
1080	T1524	Implement organizational knowledge management frameworks	2025-05-27 02:41:00.94666
1081	T1525	Maintain organizational knowledge management frameworks	2025-05-27 02:41:00.94666
1082	T1526	Identify responsible parties for intrusions and other crimes	2025-05-27 02:41:00.94666
1083	T1527	Define baseline system security requirements	2025-05-27 02:41:00.94666
1084	T1528	Develop software system testing and validation procedures	2025-05-27 02:41:00.94666
1085	T1529	Create software system documentation	2025-05-27 02:41:00.94666
1086	T1530	Develop local network usage policies and procedures	2025-05-27 02:41:00.94666
1087	T1531	Determine compliance with local network usage policies and procedures	2025-05-27 02:41:00.94666
1088	T1532	Develop procedures for system operations transfer to alternate sites	2025-05-27 02:41:00.94666
1089	T1533	Test failover for system operations transfer to alternative sites	2025-05-27 02:41:00.94666
1090	T1534	Develop cost estimates for new or modified systems	2025-05-27 02:41:00.94666
1091	T1535	Develop implementation guidelines	2025-05-27 02:41:00.94666
1092	T1537	Determine if cybersecurity training, education, and awareness meet established goals	2025-05-27 02:41:00.94666
1093	T1538	Resolve customer-reported system incidents and events	2025-05-27 02:41:00.94666
1094	T1539	Analyze organizational cybersecurity posture trends	2025-05-27 02:41:00.94666
1095	T1540	Develop organizational cybersecurity posture trend reports	2025-05-27 02:41:00.94666
1096	T1541	Develop system security posture trend reports	2025-05-27 02:41:00.94666
1097	T1542	Document original condition of digital evidence	2025-05-27 02:41:00.94666
1098	T1543	Develop cybersecurity policies and procedures	2025-05-27 02:41:00.94666
1099	T1544	Create definition activity documentation	2025-05-27 02:41:00.94666
1100	T1545	Create architecture activity documentation	2025-05-27 02:41:00.94666
1101	T1546	Provide inspectors general, privacy officers, and oversight and compliance with legal analysis and decisions	2025-05-27 02:41:00.94666
1102	T1547	Determine compliance with cybersecurity policies and legal and regulatory requirements	2025-05-27 02:41:00.94666
1103	T1548	Determine adequacy of access controls	2025-05-27 02:41:00.94666
1104	T1549	Evaluate the impact of legal, regulatory, policy, standard, or procedural changes	2025-05-27 02:41:00.94666
1105	T1550	Execute disaster recovery and continuity of operations processes	2025-05-27 02:41:00.94666
1106	T1551	Prosecute cybercrimes and fraud committed against people and property	2025-05-27 02:41:00.94666
1107	T1552	Identify cyber workforce planning and management issues	2025-05-27 02:41:00.94666
1108	T1553	Address cyber workforce planning and management issues	2025-05-27 02:41:00.94666
1109	T1554	Recommend enhancements to software and hardware solutions	2025-05-27 02:41:00.94666
1110	T1555	Implement cyber defense tools	2025-05-27 02:41:00.94666
1111	T1556	Identify system and network protection needs	2025-05-27 02:41:00.94666
1112	T1557	Implement security measures for systems and system components	2025-05-27 02:41:00.94666
1113	T1559	Resolve vulnerabilities in systems and system components	2025-05-27 02:41:00.94666
1114	T1560	Mitigate risks in systems and system components	2025-05-27 02:42:54.156685
1115	T1561	Implement dedicated cyber defense systems	2025-05-27 02:42:54.156685
1116	T1562	Document system requirements	2025-05-27 02:42:54.156685
1117	T1563	Implement system security measures	2025-05-27 02:42:54.156685
1118	T1564	Install database management systems and software	2025-05-27 02:42:54.156685
1119	T1565	Configure database management systems and software	2025-05-27 02:42:54.156685
1120	T1566	Install system hardware, software, and peripheral equipment	2025-05-27 02:42:54.156685
1121	T1567	Configure system hardware, software, and peripheral equipment	2025-05-27 02:42:54.156685
1122	T1568	Implement cross-domain solutions	2025-05-27 02:42:54.156685
1123	T1569	Administer system and network user accounts	2025-05-27 02:42:54.156685
1124	T1570	Establish system and network rights processes and procedures	2025-05-27 02:42:54.156685
1125	T1571	Establish systems and equipment access protocols	2025-05-27 02:42:54.156685
1126	T1572	Inventory technology resources	2025-05-27 02:42:54.156685
1127	T1573	Determine if developed solutions meet customer requirements	2025-05-27 02:42:54.156685
1128	T1574	Develop risk acceptance documentation for senior leaders and authorized representatives	2025-05-27 02:42:54.156685
1129	T1575	Adapt software to new hardware	2025-05-27 02:42:54.156685
1130	T1576	Upgrade software interfaces	2025-05-27 02:42:54.156685
1131	T1577	Improve software performance	2025-05-27 02:42:54.156685
1132	T1578	Monitor system and server configurations	2025-05-27 02:42:54.156685
1133	T1579	Maintain system and server configurations	2025-05-27 02:42:54.156685
1134	T1580	Monitor client-level computer system performance	2025-05-27 02:42:54.156685
1135	T1581	Create client-level computer system performance reports	2025-05-27 02:42:54.156685
1136	T1582	Maintain currency of cyber defense threat conditions	2025-05-27 02:42:54.156685
1137	T1583	Determine effectiveness of system implementation and testing processes	2025-05-27 02:42:54.156685
1138	T1584	Establish minimum security requirements for applications	2025-05-27 02:42:54.156685
1139	T1585	Determine if applications meet minimum security requirements	2025-05-27 02:42:54.156685
1140	T1586	Conduct cybersecurity risk assessments	2025-05-27 02:42:54.156685
1141	T1587	Perform cybersecurity testing on systems in development	2025-05-27 02:42:54.156685
1142	T1588	Diagnose faulty system and server hardware	2025-05-27 02:42:54.156685
1143	T1589	Repair faulty system and server hardware	2025-05-27 02:42:54.156685
1144	T1590	Identify programming flaws	2025-05-27 02:42:54.156685
1145	T1591	Address security architecture gaps	2025-05-27 02:42:54.156685
1146	T1592	Conduct cybersecurity reviews	2025-05-27 02:42:54.156685
1147	T1593	Identify cybersecurity gaps in enterprise architecture	2025-05-27 02:42:54.156685
1148	T1594	Plan classroom learning sessions	2025-05-27 02:42:54.156685
1149	T1595	Coordinate training and education	2025-05-27 02:42:54.156685
1150	T1596	Plan delivery of non-classroom learning	2025-05-27 02:42:54.156685
1151	T1597	Plan implementation strategies	2025-05-27 02:42:54.156685
1152	T1598	Assess the integration and alignment capabilities of enterprise components	2025-05-27 02:42:54.156685
1153	T1599	Prepare legal documents	2025-05-27 02:42:54.156685
1154	T1600	Prepare investigative reports	2025-05-27 02:42:54.156685
1155	T1601	Advise stakeholders on enterprise cybersecurity risk management	2025-05-27 02:42:54.156685
1156	T1602	Advise stakeholders on supply chain risk management	2025-05-27 02:42:54.156685
1157	T1603	Recommend threat and vulnerability risk mitigation strategies	2025-05-27 02:42:54.156685
1158	T1604	Provide cybersecurity advice on implementation plans, standard operating procedures, maintenance documentation, and maintenance training materials	2025-05-27 02:42:54.156685
1159	T1605	Advise management, staff, and users on cybersecurity policy	2025-05-27 02:42:54.156685
1160	T1606	Prepare impact reports	2025-05-27 02:42:54.156685
1161	T1607	Recover information from forensic data sources	2025-05-27 02:42:54.156685
1162	T1608	Perform periodic reviews of learning materials and courses for accuracy and currency	2025-05-27 02:42:54.156685
1163	T1609	Recommend revisions to learning materials and curriculum	2025-05-27 02:42:54.156685
1164	T1610	Determine if hardware and software complies with defined specifications and requirements	2025-05-27 02:42:54.156685
1165	T1611	Record test data	2025-05-27 02:42:54.156685
1166	T1612	Manage test data	2025-05-27 02:42:54.156685
1167	T1613	Determine if design components meet system requirements	2025-05-27 02:42:54.156685
1168	T1614	Determine scalability of system architecture	2025-05-27 02:42:54.156685
1169	T1615	Advise stakeholders on vulnerability compliance	2025-05-27 02:42:54.156685
1170	T1616	Resolve computer security incidents	2025-05-27 02:42:54.156685
1171	T1617	Prepare cyber defense reports	2025-05-27 02:42:54.156685
1172	T1618	Advise stakeholders on disaster recovery, contingency, and continuity of operations plans	2025-05-27 02:42:54.156685
1173	T1619	Perform risk and vulnerability assessments	2025-05-27 02:42:54.156685
1174	T1620	Recommend cost-effective security controls	2025-05-27 02:42:54.156685
1175	T1621	Prepare supply chain security reports	2025-05-27 02:42:54.156685
1176	T1622	Prepare risk management reports	2025-05-27 02:42:54.156685
1177	T1623	Develop supply chain cybersecurity risk management policy	2025-05-27 02:42:54.156685
1178	T1624	Conduct vulnerability analysis of software patches and updates	2025-05-27 02:42:54.156685
1179	T1625	Prepare vulnerability analysis reports	2025-05-27 02:42:54.156685
1180	T1626	Determine impact of new systems and system interfaces on current and target environments	2025-05-27 02:42:54.156685
1181	T1627	Conduct cybersecurity management assessments	2025-05-27 02:42:54.156685
1182	T1628	Design cybersecurity management functions	2025-05-27 02:42:54.156685
1183	T1639	Assess target vulnerabilities and operational capabilities	2025-05-27 02:42:54.156685
1184	T1640	Determine effectiveness of intelligence collection operations	2025-05-27 02:42:54.156685
1185	T1641	Recommend adjustments to intelligence collection strategies	2025-05-27 02:42:54.156685
1186	T1643	Develop common operational pictures	2025-05-27 02:42:54.156685
1187	T1644	Develop cyber operations indicators	2025-05-27 02:42:54.156685
1188	T1645	Coordinate all-source collection activities	2025-05-27 02:42:54.156685
1189	T1646	Validate all-source collection requirements and plans	2025-05-27 02:42:54.156685
1190	T1647	Develop priority information requirements	2025-05-27 02:42:54.156685
1191	T1648	Develop performance success metrics	2025-05-27 02:42:54.156685
1192	T1650	Develop cybersecurity success metrics	2025-05-27 02:42:54.156685
1193	T1651	Prepare threat and target briefings	2025-05-27 02:42:54.156685
1194	T1652	Prepare threat and target situational updates	2025-05-27 02:42:54.156685
1195	T1658	Determine customer requirements	2025-05-27 02:42:54.156685
1196	T1666	Exploit wireless computer and digital networks	2025-05-27 02:42:54.156685
1197	T1669	Analyze system vulnerabilities within a network	2025-05-27 02:42:54.156685
1198	T1670	Conduct on-net activities	2025-05-27 02:42:54.156685
1199	T1671	Exfiltrate data from deployed technologies	2025-05-27 02:42:54.156685
1200	T1672	Conduct off-net activities	2025-05-27 02:42:54.156685
1201	T1676	Survey computer and digital networks	2025-05-27 02:42:54.156685
1202	T1679	Develop organizational decision support tools	2025-05-27 02:42:54.156685
1203	T1686	Identify intelligence requirements	2025-05-27 02:42:54.156685
1204	T1689	Create comprehensive exploitation strategies	2025-05-27 02:42:54.156685
1205	T1690	Identify exploitable technical or operational vulnerabilities	2025-05-27 02:42:54.156685
1206	T1698	Collect target information	2025-05-27 02:42:54.156685
1207	T1699	Develop crisis plans	2025-05-27 02:42:54.156685
1208	T1700	Maintain crisis plans	2025-05-27 02:42:54.156685
1209	T1708	Prepare operational assessment reports	2025-05-27 02:42:54.156685
1210	T1712	Recommend potential courses of action	2025-05-27 02:42:54.156685
1211	T1713	Develop feedback procedures	2025-05-27 02:42:54.156685
1212	T1717	Recommend changes to planning policies and procedures	2025-05-27 02:42:54.156685
1213	T1718	Implement changes to planning policies and procedures	2025-05-27 02:42:54.156685
1214	T1719	Develop cybersecurity cooperation agreements with external partners	2025-05-27 02:46:10.296738
1215	T1732	Determine effectiveness of network analysis strategies	2025-05-27 02:46:10.296738
1216	T1734	Exploit network devices and terminals	2025-05-27 02:46:10.296738
1217	T1736	Communicate tool requirements to developers	2025-05-27 02:46:10.296738
1218	T1737	Develop intelligence collection strategies	2025-05-27 02:46:10.296738
1219	T1741	Designate priority information requirements	2025-05-27 02:46:10.296738
1220	T1743	Identify information collection gaps	2025-05-27 02:46:10.296738
1221	T1747	Identify system vulnerabilities within a network	2025-05-27 02:46:10.296738
1222	T1758	Determine potential implications of new and emerging hardware and software technologies	2025-05-27 02:46:10.296738
1223	T1762	Modify collection requirements	2025-05-27 02:46:10.296738
1224	T1763	Determine effectiveness of collection requirements	2025-05-27 02:46:10.296738
1225	T1765	Monitor changes to designated cyber operations warning problem sets	2025-05-27 02:46:10.296738
1226	T1766	Prepare change reports for designated cyber operations warning problem sets	2025-05-27 02:46:10.296738
1227	T1767	Monitor threat activities	2025-05-27 02:46:10.296738
1228	T1768	Prepare threat activity reports	2025-05-27 02:46:10.296738
1229	T1770	Report on adversarial activities that fulfill priority information requirements	2025-05-27 02:46:10.296738
1230	T1772	Identify indications and warnings of target communication changes or processing failures	2025-05-27 02:46:10.296738
1231	T1775	Prepare cyber operations intelligence reports	2025-05-27 02:46:10.296738
1232	T1776	Prepare indications and warnings intelligence reports	2025-05-27 02:46:10.296738
1233	T1777	Conduct policy reviews	2025-05-27 02:46:10.296738
1234	T1779	Coordinate strategic planning efforts with internal and external partners	2025-05-27 02:46:10.296738
1235	T1780	Develop external coordination policies	2025-05-27 02:46:10.296738
1236	T1781	Degrade or remove data from networks and computers	2025-05-27 02:46:10.296738
1237	T1784	Process exfiltrated data	2025-05-27 02:46:10.296738
1238	T1786	Profile system administrators and their activities	2025-05-27 02:46:10.296738
1239	T1789	Provide aim point recommendations for targets	2025-05-27 02:46:10.296738
1240	T1790	Provide reengagement recommendations	2025-05-27 02:46:10.296738
1241	T1792	Assess effectiveness of intelligence production	2025-05-27 02:46:10.296738
1242	T1793	Assess effectiveness of intelligence reporting	2025-05-27 02:46:10.296738
1243	T1798	Provide intelligence analysis and support	2025-05-27 02:46:10.296738
1244	T1799	Notify appropriate personnel of imminent hostile intentions or activities	2025-05-27 02:46:10.296738
1245	T1801	Determine validity and relevance of information	2025-05-27 02:46:10.296738
1246	T1802	Prepare network reports	2025-05-27 02:46:10.296738
1247	T1804	Prepare network intrusion reports	2025-05-27 02:46:10.296738
1248	T1806	Research communications trends in emerging technologies	2025-05-27 02:46:10.296738
1249	T1829	Evaluate locally developed tools	2025-05-27 02:46:10.296738
1250	T1830	Test internally developed software	2025-05-27 02:46:10.296738
1251	T1831	Track status of information requests	2025-05-27 02:46:10.296738
1252	T1835	Determine if intelligence requirements and collection plans are accurate and up-to-date	2025-05-27 02:46:10.296738
1253	T1836	Document lessons learned during events and exercises	2025-05-27 02:46:10.296738
1254	T1842	Identify metadata patterns	2025-05-27 02:46:10.296738
1255	T1846	Develop natural language processing tools	2025-05-27 02:46:10.296738
1256	T1849	Communicate critical or time-sensitive information	2025-05-27 02:46:10.296738
1257	T1853	Determine if new and existing services comply with privacy and data security obligations	2025-05-27 02:46:10.296738
1258	T1854	Develop and maintain privacy and confidentiality consent forms	2025-05-27 02:46:10.296738
1259	T1855	Develop and maintain privacy and confidentiality authorization forms	2025-05-27 02:46:10.296738
1260	T1856	Integrate civil rights and civil liberties in organizational programs, policies, and procedures	2025-05-27 02:46:10.296738
1261	T1857	Integrate privacy considerations in organizational programs, policies, and procedures	2025-05-27 02:46:10.296738
1262	T1858	Serve as liaison to regulatory and accrediting bodies	2025-05-27 02:46:10.296738
1263	T1859	Register databases with local privacy and data protection authorities	2025-05-27 02:46:10.296738
1264	T1860	Promote privacy awareness to management	2025-05-27 02:46:10.296738
1265	T1861	Establish organizational Privacy Oversight Committee	2025-05-27 02:46:10.296738
1266	T1862	Establish cybersecurity risk assessment processes	2025-05-27 02:46:10.296738
1267	T1863	Develop information sharing strategic plans	2025-05-27 02:46:10.296738
1268	T1864	Develop organizational information infrastructure	2025-05-27 02:46:10.296738
1269	T1865	Implement organizational information infrastructure	2025-05-27 02:46:10.296738
1270	T1866	Develop self-disclosure policies and procedures	2025-05-27 02:46:10.296738
1271	T1867	Oversee consumer information access rights	2025-05-27 02:46:10.296738
1272	T1868	Serve as information privacy liaison to technology system users	2025-05-27 02:46:10.296738
1273	T1869	Serve as liaison to information systems department	2025-05-27 02:46:10.296738
1274	T1870	Create privacy training materials	2025-05-27 02:46:10.296738
1275	T1871	Prepare privacy awareness communications	2025-05-27 02:46:10.296738
1276	T1872	Deliver privacy awareness orientations	2025-05-27 02:46:10.296738
1277	T1873	Deliver privacy awareness trainings	2025-05-27 02:46:10.296738
1278	T1874	Manage organizational participation in public privacy and cybersecurity events	2025-05-27 02:46:10.296738
1279	T1875	Prepare privacy program status reports	2025-05-27 02:46:10.296738
1280	T1876	Respond to press and other public data security inquiries	2025-05-27 02:46:10.296738
1281	T1877	Develop organizational privacy program	2025-05-27 02:46:10.296738
1282	T1878	Apply sanctions for failure to comply with privacy policies	2025-05-27 02:46:10.296738
1283	T1879	Develop sanctions for failure to comply with privacy policies	2025-05-27 02:46:10.296738
1284	T1880	Resolve allegations of noncompliance with privacy policies and notice of information practices	2025-05-27 02:46:10.296738
1285	T1881	Develop a risk management and compliance framework for privacy	2025-05-27 02:46:10.296738
1286	T1882	Determine if projects comply with organizational privacy and data security policies	2025-05-27 02:46:10.296738
1287	T1883	Develop organizational privacy policies and procedures	2025-05-27 02:46:10.296738
1288	T1884	Establish complaint processes	2025-05-27 02:46:10.296738
1289	T1885	Establish mechanisms to track access to protected health information	2025-05-27 02:46:10.296738
1290	T1886	Maintain the organizational policy program	2025-05-27 02:46:10.296738
1291	T1887	Conduct privacy impact assessments	2025-05-27 02:46:10.296738
1292	T1888	Conduct privacy compliance monitoring	2025-05-27 02:46:10.296738
1293	T1889	Align cybersecurity and privacy practices in system information security plans	2025-05-27 02:46:10.296738
1294	T1890	Determine if protected information releases comply with organizational policies and procedures	2025-05-27 02:46:10.296738
1295	T1891	Administer requests for release or disclosure of protected information	2025-05-27 02:46:10.296738
1296	T1892	Develop vendor review procedures	2025-05-27 02:46:10.296738
1297	T1893	Develop vendor auditing procedures	2025-05-27 02:46:10.296738
1298	T1894	Determine if partner and business agreements address privacy requirements and responsibilities	2025-05-27 02:46:10.296738
1299	T1895	Provide legal advice for business partner contracts	2025-05-27 02:46:10.296738
1300	T1896	Mitigate Personal Identifiable Information (PII) breaches	2025-05-27 02:46:10.296738
1301	T1897	Administer action on organizational privacy complaints	2025-05-27 02:46:10.296738
1302	T1898	Determine if the organization's privacy program complies with federal and state privacy laws and regulations	2025-05-27 02:46:10.296738
1303	T1899	Identify organizational privacy compliance gaps	2025-05-27 02:46:10.296738
1304	T1900	Correct organizational privacy compliance gaps	2025-05-27 02:46:10.296738
1305	T1901	Manage privacy breaches	2025-05-27 02:46:10.296738
1306	T1902	Implement and maintain organizational privacy policies and procedures	2025-05-27 02:46:10.296738
1307	T1903	Develop and maintain privacy and confidentiality information notices	2025-05-27 02:46:10.296738
1308	T1904	Determine business partner requirements	2025-05-27 02:46:10.296738
1309	T1905	Monitor advancements in information privacy technologies	2025-05-27 02:46:10.296738
1310	T1906	Establish a cybersecurity risk management program	2025-05-27 02:46:10.296738
1311	T1907	Establish organizational risk management strategies	2025-05-27 02:46:10.296738
1312	T1908	Determine which business functions a system supports	2025-05-27 02:46:10.296738
1313	T1909	Determine system stakeholders	2025-05-27 02:46:10.296738
1314	T1910	Identify common controls available for inheritance by organizational systems	2025-05-27 02:50:07.671462
1315	T1911	Determine the security categorization for organizational systems	2025-05-27 02:50:07.671462
1316	T1912	Determine system boundaries	2025-05-27 02:50:07.671462
1317	T1913	Identify system security requirements	2025-05-27 02:50:07.671462
1318	T1914	Register systems with organizational program management offices	2025-05-27 02:50:07.671462
1319	T1915	Identify required system security controls	2025-05-27 02:50:07.671462
1320	T1916	Document planned system security control implementations	2025-05-27 02:50:07.671462
1321	T1917	Establish security control monitoring strategies	2025-05-27 02:50:07.671462
1322	T1918	Review and approve System Security Plans (SSPs)	2025-05-27 02:50:07.671462
1323	T1919	Implement system security controls	2025-05-27 02:50:07.671462
1324	T1920	Establish system configuration baselines	2025-05-27 02:50:07.671462
1325	T1921	Document changes to planned system control implementations	2025-05-27 02:50:07.671462
1326	T1922	Develop system security control assessment plans	2025-05-27 02:50:07.671462
1327	T1923	Approve system security control assessment plans	2025-05-27 02:50:07.671462
1328	T1924	Determine effectiveness of security controls	2025-05-27 02:50:07.671462
1329	T1925	Prepare security control assessment reports	2025-05-27 02:50:07.671462
1330	T1926	Conduct security control remediations	2025-05-27 02:50:07.671462
1331	T1927	Develop cybersecurity action plans and milestones	2025-05-27 02:50:07.671462
1332	T1928	Prepare authorization packages	2025-05-27 02:50:07.671462
1333	T1929	Submit authorization packages to authorizing officials for adjudication	2025-05-27 02:50:07.671462
1334	T1930	Determine risks of operating or using a system	2025-05-27 02:50:07.671462
1335	T1931	Determine risks of using common controls	2025-05-27 02:50:07.671462
1336	T1932	Implement cybersecurity action plans	2025-05-27 02:50:07.671462
1337	T1933	Determine if system security risks are acceptable	2025-05-27 02:50:07.671462
1338	T1934	Determine if common control risks are acceptable	2025-05-27 02:50:07.671462
1339	T1935	Update cybersecurity action plans	2025-05-27 02:50:07.671462
1340	T1936	Report system security status to authorizing officials	2025-05-27 02:50:07.671462
1341	T1937	Determine if system security meets acceptable risk levels	2025-05-27 02:50:07.671462
1342	T1938	Establish system disposal processes	2025-05-27 02:50:07.671462
1343	T1939	Implement system disposal processes	2025-05-27 02:50:07.671462
1344	T1940	Form continuous monitoring working groups	2025-05-27 02:50:07.671462
1345	T1941	Establish continuous monitoring scoring and grading metrics	2025-05-27 02:50:07.671462
1346	T1942	Integrate a continuous monitoring program into organizational security governance structures and policies	2025-05-27 02:50:07.671462
1347	T1943	Make cybersecurity investment decisions to address persistent issues	2025-05-27 02:50:07.671462
1348	T1944	Provide training and resources to continuous monitoring staff	2025-05-27 02:50:07.671462
1349	T1945	Prepare continuous monitoring reports	2025-05-27 02:50:07.671462
1350	T1946	Determine if risk metrics support continuous monitoring	2025-05-27 02:50:07.671462
1351	T1947	Determine if continuous monitoring data provides situational awareness of risk levels	2025-05-27 02:50:07.671462
1352	T1948	Define unacceptable risk threshold triggers for continuous monitoring data	2025-05-27 02:50:07.671462
1353	T1949	Establish system-level reporting categories	2025-05-27 02:50:07.671462
1354	T1950	Manage the continuous monitoring program	2025-05-27 02:50:07.671462
1355	T1951	Establish continuous monitoring communication processes	2025-05-27 02:50:07.671462
1356	T1952	Identify reporting requirements that are fulfilled by the continuous monitoring program	2025-05-27 02:50:07.671462
1357	T1953	Establish continuous monitoring reporting requirements	2025-05-27 02:50:07.671462
1358	T1954	Perform continuous monitoring	2025-05-27 02:50:07.671462
1359	T1955	Establish automated control assessment reporting requirements	2025-05-27 02:50:07.671462
1360	T1956	Conduct continuous monitoring data assessments	2025-05-27 02:50:07.671462
1361	T1957	Integrate continuous monitoring results in ongoing authorizations	2025-05-27 02:50:07.671462
1362	T1958	Establish access control processes for continuous monitoring tools and technologies	2025-05-27 02:50:07.671462
1363	T1959	Implement access control processes for continuous monitoring tools and technologies	2025-05-27 02:50:07.671462
1364	T1960	Establish technical help processes for continuous monitoring mitigators	2025-05-27 02:50:07.671462
1365	T1961	Communicate continuous monitoring reporting requirements	2025-05-27 02:50:07.671462
1366	T1962	Define responsibilities for implementing continuous monitoring tools or technologies	2025-05-27 02:50:07.671462
1367	T1963	Establish liaison to scoring and metrics working group	2025-05-27 02:50:07.671462
1368	T1964	Establish risk management processes	2025-05-27 02:50:07.671462
1369	T1965	Establish performance measurement requirements for continuous monitoring tools and technologies	2025-05-27 02:50:07.671462
1370	T1966	Assess continuous monitoring performance	2025-05-27 02:50:07.671462
1371	T1967	Coordinate responses to issues flagged during continuous monitoring	2025-05-27 02:50:07.671462
1372	T1968	Implement risk mitigation strategies	2025-05-27 02:50:07.671462
1373	T1969	Document system alerts	2025-05-27 02:50:07.671462
1374	T1970	Escalate system alerts that may indicate risks	2025-05-27 02:50:07.671462
1375	T1971	Disseminate anomalous activity reports to the insider threat hub	2025-05-27 02:50:07.671462
1376	T1972	Identify anomalous activity	2025-05-27 02:50:07.671462
1377	T1973	Conduct independent comprehensive assessments of target-specific information	2025-05-27 02:50:07.671462
1378	T1974	Conduct insider threat risk assessments	2025-05-27 02:50:07.671462
1379	T1975	Prepare insider threat briefings	2025-05-27 02:50:07.671462
1380	T1976	Recommend risk mitigation courses of action (CoA)	2025-05-27 02:50:07.671462
1381	T1977	Coordinate with internal and external incident management partners across jurisdictions	2025-05-27 02:50:07.671462
1382	T1978	Recommend improvements to insider threat detection processes	2025-05-27 02:50:07.671462
1383	T1979	Collect digital evidence that meets priority intelligence requirements	2025-05-27 02:50:07.671462
1384	T1980	Develop digital evidence reports for internal and external partners	2025-05-27 02:50:07.671462
1385	T1981	Develop elicitation indicators	2025-05-27 02:50:07.671462
1386	T1982	Identify high value assets	2025-05-27 02:50:07.671462
1387	T1983	Identify potential insider threats	2025-05-27 02:50:07.671462
1388	T1984	Notify appropriate personnel of imminent of imminent hostile intentions or activities	2025-05-27 02:50:07.671462
1389	T1985	Identify imminent or hostile intentions or activities	2025-05-27 02:50:07.671462
1390	T1986	Develop a continuously updated overview of an incident throughout the incident's life cycle	2025-05-27 02:50:07.671462
1391	T1987	Develop insider threat cyber operations indicators	2025-05-27 02:50:07.671462
1392	T1988	Integrate information from cyber resources, internal partners, and external partners	2025-05-27 02:50:07.671462
1393	T1989	Advise insider threat hub inquiries	2025-05-27 02:50:07.671462
1394	T1990	Conduct cybersecurity insider threat inquiries	2025-05-27 02:50:07.671462
1395	T1991	Deliver all-source cyber operations and intelligence indications and warnings	2025-05-27 02:50:07.671462
1396	T1992	Interpret network activity for intelligence value	2025-05-27 02:50:07.671462
1397	T1993	Monitor network activity for vulnerabilities	2025-05-27 02:50:07.671462
1398	T1994	Identify potential insider risks to networks	2025-05-27 02:50:07.671462
1399	T1995	Document potential insider risks to networks	2025-05-27 02:50:07.671462
1400	T1996	Report network vulnerabilities	2025-05-27 02:50:07.671462
1401	T1997	Develop insider threat investigation plans	2025-05-27 02:50:07.671462
1402	T1998	Investigate alleged insider threat cybersecurity policy violations	2025-05-27 02:50:07.671462
1403	T1999	Refer cases on active insider threat activities to law enforcement investigators	2025-05-27 02:50:07.671462
1404	T2000	Perform cybersecurity reviews	2025-05-27 02:50:07.671462
1405	T2001	Establish an insider threat risk management assessment program	2025-05-27 02:50:07.671462
1406	T2002	Recommend courses of action or countermeasures to mitigate risks	2025-05-27 02:50:07.671462
1407	T2003	Evaluate organizational insider risk response capabilities	2025-05-27 02:50:07.671462
1408	T2004	Document insider threat information sources	2025-05-27 02:50:07.671462
1409	T2005	Conduct insider threat studies	2025-05-27 02:50:07.671462
1410	T2006	Identify potential targets for exploitation	2025-05-27 02:50:07.671462
1411	T2007	Analyze potential targets for exploitation	2025-05-27 02:50:07.671462
1412	T2008	Vet insider threat targeting with law enforcement and intelligence partners	2025-05-27 02:50:07.671462
1413	T2009	Develop insider threat targets	2025-05-27 02:50:07.671462
1414	T2010	Maintain User Activity Monitoring (UAM) tools	2025-05-27 03:04:12.406655
1415	T2011	Monitor the output from User Activity Monitoring (UAM) tools	2025-05-27 03:04:12.406655
1416	T2012	Check network connections	2025-05-27 03:04:12.406655
1417	T2013	Look for indicators of intrusions	2025-05-27 03:04:12.406655
1418	T2014	Identify devices and networks on scene	2025-05-27 03:04:12.406655
1419	T2015	Collect devices containing digital evidence	2025-05-27 03:04:12.406655
1420	T2016	Identify areas of compromise	2025-05-27 03:04:12.406655
1421	T2017	Acquire digital evidence	2025-05-27 03:04:12.406655
1422	T2018	Create a digital footprint of raw or physical data	2025-05-27 03:04:12.406655
1423	T2019	Process data into readable format	2025-05-27 03:04:12.406655
1424	T2020	Prepare data for ingestion into application systems	2025-05-27 03:04:12.406655
1425	T2021	Recover deleted or overwritten data files	2025-05-27 03:04:12.406655
1426	T2022	Create derivative evidence from findings report	2025-05-27 03:04:12.406655
1427	T2023	Serve as subject expert in training fact witnesses for testifying	2025-05-27 03:04:12.406655
1428	T2024	Present factual causality to support attribution of criminal activity	2025-05-27 03:04:12.406655
1429	T2025	Prepare technical materials for legal proceedings	2025-05-27 03:04:12.406655
1430	T2026	Serve as liaison to prosecutors	2025-05-27 03:04:12.406655
1431	T2027	Manage forensic laboratory accreditation processes	2025-05-27 03:04:12.406655
1432	T2028	Develop OT inventory model for cybersecurity 	2025-05-27 03:04:12.406655
1433	T2029	Serve as OT engineering subject matter expert during development of change management policies and procedures	2025-05-27 03:04:12.406655
1434	T2030	Determine if implementation of security measures and controls meets regulatory standards and is in compliance with legal or policy requirements	2025-05-27 03:04:12.406655
1435	T2031	Identify gaps in OT network architecture	2025-05-27 03:04:12.406655
1436	T2032	Assign security level targets to network zones for control systems	2025-05-27 03:04:12.406655
1437	T2033	Create a change management plan	2025-05-27 03:04:12.406655
1438	T2034	Design cybersecurity tools for OT systems	2025-05-27 03:04:12.406655
1439	T2035	Perform a process hazard analysis (PHA)	2025-05-27 03:04:12.406655
1440	T2036	Review policies, standards, and regulations for conflicts that may create control system vulnerabilities	2025-05-27 03:04:12.406655
1441	T2037	Create cybersecurity inspection and test policies and procedures for OT systems	2025-05-27 03:04:12.406655
1442	T2038	Develop system procurement specifications	2025-05-27 03:04:12.406655
1443	T2039	Determine the impact of cybersecurity requirements on costs and budgeting	2025-05-27 03:04:12.406655
1444	T2040	Conduct cybersecurity reviews of OT system engineering plans and documentation	2025-05-27 03:04:12.406655
1445	T2041	Participate in safety system design processes to counteract potential cybersecurity sabotage	2025-05-27 03:04:12.406655
1446	T2042	Generate cyberattack scenarios of serious physical consequence	2025-05-27 03:04:12.406655
1447	T2043	Oversee implementation of system controls	2025-05-27 03:04:12.406655
1448	T2044	Develop system upgrade specifications	2025-05-27 03:04:12.406655
1449	T2045	Assign networked engineering assets to security zones	2025-05-27 03:04:12.406655
1450	T2046	Communicate implication of new and upgraded technologies to cybersecurity program stakeholders	2025-05-27 03:04:12.406655
1451	T2047	Inventory OT assets	2025-05-27 03:04:12.406655
1452	T2048	Recommend cybersecurity requirements for integration in continuity planning	2025-05-27 03:04:12.406655
1453	T2049	Serve as OT engineering subject matter expert for cybersecurity standards, policies, and procedures development	2025-05-27 03:04:12.406655
1454	T2050	Serve as OT engineering subject matter expert for development of organizational cybersecurity risk management plan	2025-05-27 03:04:12.406655
1455	T2051	Train cybersecurity defense technicians on OT system processes and procedures	2025-05-27 03:04:12.406655
\.


--
-- Data for Name: work_role_certifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.work_role_certifications (id, work_role_id, certification_id, required) FROM stdin;
\.


--
-- Data for Name: work_role_knowledge; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.work_role_knowledge (id, work_role_id, knowledge_item_id) FROM stdin;
1	85	1232
2	85	1279
3	85	1280
4	85	1281
5	85	1282
6	85	1283
7	85	1284
8	85	1285
9	85	1286
10	85	1287
11	85	1288
12	85	1289
13	85	1290
14	85	1291
15	85	1292
16	85	1317
17	85	1329
18	85	1332
19	85	1333
20	85	1334
21	85	1339
22	85	1354
23	85	1355
24	85	1357
25	85	1359
26	85	1360
27	85	1366
28	85	1373
29	85	1379
30	85	1387
31	85	1406
32	85	1407
33	85	1411
34	85	1442
35	85	1448
36	85	1450
37	85	1458
38	85	1472
39	85	1473
40	85	1535
41	85	1538
42	85	1539
43	85	1541
44	85	1554
45	85	1582
46	85	1606
47	85	1627
48	85	1646
49	85	1653
50	85	1732
51	85	1739
52	86	1253
53	86	1282
54	86	1283
55	86	1284
56	86	1285
57	86	1286
58	86	1287
59	86	1288
60	86	1289
61	86	1290
62	86	1291
63	86	1292
64	86	1299
65	86	1300
66	86	1351
67	86	1359
68	86	1360
69	86	1381
70	86	1420
71	86	1499
72	86	1550
73	86	1569
74	86	1570
75	86	1575
76	86	1582
77	86	1588
78	86	1606
79	86	1613
80	86	1648
81	86	1702
82	86	1740
83	86	1743
84	86	1746
85	86	1763
86	87	1249
87	87	1253
88	87	1257
89	87	1258
90	87	1261
91	87	1282
92	87	1283
93	87	1284
94	87	1285
95	87	1286
96	87	1287
97	87	1288
98	87	1289
99	87	1290
100	87	1291
101	87	1292
102	87	1299
103	87	1300
104	87	1351
105	87	1359
106	87	1360
107	87	1362
108	87	1381
109	87	1411
110	87	1426
111	87	1428
112	87	1433
113	87	1436
114	87	1439
115	87	1446
116	87	1488
117	87	1494
118	87	1499
119	87	1500
120	87	1509
121	87	1515
122	87	1550
123	87	1569
124	87	1570
125	87	1575
126	87	1582
127	87	1588
128	87	1606
129	87	1613
130	87	1667
131	87	1702
132	87	1704
133	87	1732
134	87	1740
135	87	1743
136	87	1744
137	87	1746
138	87	1763
139	87	1766
140	88	1252
141	88	1263
142	88	1268
143	88	1282
144	88	1283
145	88	1284
146	88	1285
147	88	1286
148	88	1287
149	88	1288
150	88	1289
151	88	1290
152	88	1291
153	88	1292
154	88	1326
155	88	1344
156	88	1351
157	88	1359
158	88	1360
159	88	1378
160	88	1381
161	88	1400
162	88	1409
163	88	1413
164	88	1420
165	88	1426
166	88	1433
167	88	1439
168	88	1445
169	88	1472
170	88	1473
171	88	1488
172	88	1492
173	88	1493
174	88	1494
175	88	1495
176	88	1496
177	88	1497
178	88	1500
179	88	1512
180	88	1517
181	88	1530
182	88	1541
183	88	1582
184	88	1606
185	88	1621
186	88	1652
187	88	1657
188	88	1743
189	89	1247
190	89	1252
191	89	1263
192	89	1268
193	89	1282
194	89	1283
195	89	1284
196	89	1285
197	89	1286
198	89	1287
199	89	1288
200	89	1289
201	89	1290
202	89	1291
203	89	1292
204	89	1293
205	89	1294
206	89	1297
207	89	1326
208	89	1336
209	89	1337
210	89	1338
211	89	1344
212	89	1351
213	89	1352
214	89	1359
215	89	1360
216	89	1367
217	89	1374
218	89	1378
219	89	1381
220	89	1400
221	89	1409
222	89	1413
223	89	1414
224	89	1418
225	89	1420
226	89	1426
227	89	1433
228	89	1439
229	89	1445
230	89	1447
231	89	1465
232	89	1470
233	89	1471
234	89	1472
235	89	1473
236	89	1488
237	89	1492
238	89	1493
239	89	1494
240	89	1495
241	89	1496
242	89	1497
243	89	1500
244	89	1512
245	89	1517
246	89	1530
247	89	1531
248	89	1541
249	89	1582
250	89	1606
251	89	1621
252	89	1630
253	89	1639
254	89	1652
255	89	1656
256	89	1657
257	89	1658
258	130	1282
259	130	1283
260	130	1284
261	130	1285
262	130	1286
263	130	1287
264	130	1288
265	130	1289
266	130	1290
267	130	1291
268	130	1292
269	130	1293
270	130	1294
271	130	1304
272	130	1344
273	130	1351
274	130	1354
275	130	1355
276	130	1359
277	130	1360
278	130	1392
279	130	1393
280	130	1408
281	130	1427
282	130	1428
283	130	1429
284	130	1437
285	130	1438
286	130	1442
287	130	1499
288	130	1525
289	130	1526
290	130	1551
291	130	1552
292	130	1561
293	130	1582
294	130	1588
295	130	1606
296	130	1627
297	130	1640
298	130	1703
299	130	1742
300	91	1243
301	91	1253
302	91	1282
303	91	1283
304	91	1284
305	91	1285
306	91	1286
307	91	1287
308	91	1288
309	91	1289
310	91	1290
311	91	1291
312	91	1292
313	91	1296
314	91	1297
315	91	1336
316	91	1337
317	91	1338
318	91	1351
319	91	1359
320	91	1360
321	91	1391
322	91	1392
323	91	1393
324	91	1408
325	91	1426
326	91	1427
327	91	1428
328	91	1429
329	91	1433
330	91	1439
331	91	1447
332	91	1499
333	91	1543
334	91	1582
335	91	1588
336	91	1606
337	91	1615
338	91	1648
339	91	1652
340	91	1740
341	91	1743
342	91	1748
343	91	1766
344	91	1782
345	92	1243
346	92	1253
347	92	1254
348	92	1268
349	92	1282
350	92	1283
351	92	1284
352	92	1285
353	92	1286
354	92	1287
355	92	1288
356	92	1289
357	92	1290
358	92	1291
359	92	1292
360	92	1295
361	92	1326
362	92	1356
363	92	1359
364	92	1360
365	92	1381
366	92	1400
367	92	1488
368	92	1492
369	92	1493
370	92	1499
371	92	1522
372	92	1532
373	92	1533
374	92	1569
375	92	1570
376	92	1578
377	92	1582
378	92	1588
379	92	1606
380	92	1619
381	92	1640
382	92	1678
383	92	1687
384	92	1703
385	92	1722
386	92	1743
387	92	1752
388	92	1754
389	92	1757
390	92	1758
391	92	1769
392	92	1793
393	93	1243
394	93	1250
395	93	1251
396	93	1259
397	93	1260
398	93	1262
399	93	1282
400	93	1283
401	93	1284
402	93	1285
403	93	1286
404	93	1287
405	93	1288
406	93	1289
407	93	1290
408	93	1291
409	93	1292
410	93	1298
411	93	1329
412	93	1332
413	93	1335
414	93	1336
415	93	1337
416	93	1338
417	93	1342
418	93	1343
419	93	1344
420	93	1351
421	93	1359
422	93	1360
423	93	1362
424	93	1379
425	93	1411
426	93	1427
427	93	1428
428	93	1429
429	93	1431
430	93	1432
431	93	1436
432	93	1442
433	93	1443
434	93	1444
435	93	1446
436	93	1470
437	93	1471
438	93	1475
439	93	1476
440	93	1479
441	93	1480
442	93	1519
443	93	1520
444	93	1527
445	93	1529
446	93	1582
447	93	1606
448	93	1702
449	93	1740
450	93	1763
451	94	1243
452	94	1259
453	94	1260
454	94	1262
455	94	1282
456	94	1283
457	94	1284
458	94	1285
459	94	1286
460	94	1287
461	94	1288
462	94	1289
463	94	1290
464	94	1291
465	94	1292
466	94	1298
467	94	1329
468	94	1336
469	94	1337
470	94	1338
471	94	1341
472	94	1342
473	94	1343
474	94	1359
475	94	1360
476	94	1362
477	94	1379
478	94	1411
479	94	1427
480	94	1428
481	94	1429
482	94	1436
483	94	1442
484	94	1443
485	94	1444
486	94	1446
487	94	1470
488	94	1471
489	94	1475
490	94	1476
491	94	1479
492	94	1480
493	94	1527
494	94	1529
495	94	1582
496	94	1606
497	94	1702
498	94	1740
499	94	1763
500	95	1243
501	95	1259
502	95	1260
503	95	1262
504	95	1282
505	95	1283
506	95	1284
507	95	1285
508	95	1286
509	95	1287
510	95	1288
511	95	1289
512	95	1290
513	95	1291
514	95	1292
515	95	1298
516	95	1329
517	95	1335
518	95	1336
519	95	1337
520	95	1338
521	95	1341
522	95	1342
523	95	1343
524	95	1344
525	95	1351
526	95	1359
527	95	1360
528	95	1362
529	95	1379
530	95	1411
531	95	1427
532	95	1428
533	95	1429
534	95	1436
535	95	1442
536	95	1443
537	95	1444
538	95	1446
539	95	1470
540	95	1471
541	95	1475
542	95	1476
543	95	1479
544	95	1480
545	95	1527
546	95	1529
547	95	1582
548	95	1606
549	95	1702
550	95	1740
551	95	1763
552	97	1232
553	97	1241
554	97	1262
555	97	1264
556	97	1267
557	97	1268
558	97	1282
559	97	1283
560	97	1284
561	97	1285
562	97	1286
563	97	1287
564	97	1288
565	97	1289
566	97	1290
567	97	1291
568	97	1292
569	97	1293
570	97	1294
571	97	1295
572	97	1296
573	97	1297
574	97	1299
575	97	1300
576	97	1306
577	97	1309
578	97	1310
579	97	1311
580	97	1315
581	97	1317
582	97	1318
583	97	1319
584	97	1320
585	97	1321
586	97	1326
587	97	1328
588	97	1329
589	97	1331
590	97	1336
591	97	1337
592	97	1338
593	97	1339
594	97	1342
595	97	1343
596	97	1344
597	97	1350
598	97	1351
599	97	1354
600	97	1355
601	97	1357
602	97	1359
603	97	1360
604	97	1366
605	97	1368
606	97	1369
607	97	1373
608	97	1375
609	97	1384
610	97	1386
611	97	1387
612	97	1392
613	97	1393
614	97	1399
615	97	1408
616	97	1411
617	97	1414
618	97	1422
619	97	1427
620	97	1428
621	97	1429
622	97	1436
623	97	1442
624	97	1446
625	97	1447
626	97	1448
627	97	1450
628	97	1458
629	97	1465
630	97	1466
631	97	1472
632	97	1473
633	97	1477
634	97	1478
635	97	1484
636	97	1485
637	97	1486
638	97	1487
639	97	1488
640	97	1492
641	97	1493
642	97	1499
643	97	1522
644	97	1524
645	97	1525
646	97	1526
647	97	1529
648	97	1531
649	97	1535
650	97	1541
651	97	1549
652	97	1554
653	97	1555
654	97	1560
655	97	1562
656	97	1563
657	97	1569
658	97	1570
659	97	1571
660	97	1572
661	97	1573
662	97	1582
663	97	1584
664	97	1585
665	97	1588
666	97	1606
667	97	1623
668	97	1627
669	97	1633
670	97	1639
671	97	1645
672	97	1646
673	97	1648
674	97	1653
675	97	1657
676	97	1665
677	97	1667
678	97	1668
679	97	1669
680	97	1670
681	97	1675
682	97	1676
683	97	1740
684	98	1249
685	98	1253
686	98	1282
687	98	1283
688	98	1284
689	98	1285
690	98	1286
691	98	1287
692	98	1288
693	98	1289
694	98	1290
695	98	1291
696	98	1292
697	98	1293
698	98	1294
699	98	1299
700	98	1300
701	98	1306
702	98	1318
703	98	1319
704	98	1328
705	98	1329
706	98	1331
707	98	1336
708	98	1337
709	98	1338
710	98	1342
711	98	1343
712	98	1344
713	98	1351
714	98	1354
715	98	1355
716	98	1359
717	98	1360
718	98	1368
719	98	1369
720	98	1375
721	98	1386
722	98	1392
723	98	1393
724	98	1399
725	98	1408
726	98	1411
727	98	1427
728	98	1428
729	98	1429
730	98	1436
731	98	1442
732	98	1446
733	98	1447
734	98	1466
735	98	1477
736	98	1478
737	98	1484
738	98	1485
739	98	1486
740	98	1487
741	98	1499
742	98	1522
743	98	1524
744	98	1525
745	98	1526
746	98	1549
747	98	1555
748	98	1562
749	98	1563
750	98	1569
751	98	1570
752	98	1582
753	98	1588
754	98	1606
755	98	1627
756	98	1646
757	98	1648
758	98	1653
759	90	1232
760	90	1236
761	90	1282
762	90	1283
763	90	1284
764	90	1285
765	90	1286
766	90	1287
767	90	1288
768	90	1289
769	90	1290
770	90	1291
771	90	1292
772	90	1293
773	90	1294
774	90	1295
775	90	1309
776	90	1317
777	90	1318
778	90	1324
779	90	1325
780	90	1329
781	90	1331
782	90	1332
783	90	1333
784	90	1334
785	90	1335
786	90	1339
787	90	1340
788	90	1342
789	90	1343
790	90	1344
791	90	1348
792	90	1349
793	90	1351
794	90	1352
795	90	1354
796	90	1355
797	90	1357
798	90	1359
799	90	1360
800	90	1362
801	90	1366
802	90	1367
803	90	1373
804	90	1377
805	90	1378
806	90	1379
807	90	1386
808	90	1387
809	90	1391
810	90	1399
811	90	1406
812	90	1407
813	90	1411
814	90	1426
815	90	1428
816	90	1430
817	90	1431
818	90	1432
819	90	1433
820	90	1435
821	90	1436
822	90	1439
823	90	1442
824	90	1445
825	90	1446
826	90	1447
827	90	1448
828	90	1450
829	90	1455
830	90	1456
831	90	1458
832	90	1466
833	90	1472
834	90	1473
835	90	1477
836	90	1478
837	90	1484
838	90	1485
839	90	1498
840	90	1499
841	90	1522
842	90	1524
843	90	1525
844	90	1526
845	90	1535
846	90	1541
847	90	1554
848	90	1562
849	90	1563
850	90	1569
851	90	1570
852	90	1582
853	90	1606
854	90	1627
855	90	1646
856	90	1648
857	90	1653
858	90	1662
859	90	1700
860	90	1702
861	90	1732
862	90	1739
863	90	1740
864	90	1743
865	90	1748
866	90	1749
867	90	1766
868	90	1778
869	90	1782
870	99	1243
871	99	1282
872	99	1283
873	99	1284
874	99	1285
875	99	1286
876	99	1287
877	99	1288
878	99	1289
879	99	1290
880	99	1291
881	99	1292
882	99	1329
883	99	1342
884	99	1343
885	99	1359
886	99	1360
887	99	1362
888	99	1411
889	99	1428
890	99	1436
891	99	1443
892	99	1444
893	99	1446
894	99	1529
895	99	1582
896	99	1606
897	99	1702
898	99	1740
899	99	1763
900	100	1262
901	100	1282
902	100	1283
903	100	1284
904	100	1285
905	100	1286
906	100	1287
907	100	1288
908	100	1289
909	100	1290
910	100	1291
911	100	1292
912	100	1329
913	100	1335
914	100	1341
915	100	1342
916	100	1343
917	100	1359
918	100	1360
919	100	1362
920	100	1379
921	100	1411
922	100	1427
923	100	1428
924	100	1429
925	100	1436
926	100	1443
927	100	1444
928	100	1446
929	100	1475
930	100	1476
931	100	1479
932	100	1480
933	100	1529
934	100	1582
935	100	1606
936	100	1702
937	100	1763
938	120	1282
939	120	1283
940	120	1284
941	120	1285
942	120	1286
943	120	1287
944	120	1288
945	120	1289
946	120	1290
947	120	1291
948	120	1292
949	120	1293
950	120	1294
951	120	1324
952	120	1325
953	120	1340
954	120	1352
955	120	1359
956	120	1360
957	120	1367
958	120	1378
959	120	1392
960	120	1393
961	120	1396
962	120	1397
963	120	1398
964	120	1403
965	120	1404
966	120	1408
967	120	1410
968	120	1412
969	120	1441
970	120	1445
971	120	1491
972	120	1499
973	120	1506
974	120	1507
975	120	1508
976	120	1516
977	120	1530
978	120	1569
979	120	1570
980	120	1575
981	120	1582
982	120	1606
983	120	1608
984	120	1648
985	120	1682
986	120	1703
987	120	1713
988	120	1714
989	120	1715
990	120	1716
991	120	1717
992	121	1245
993	121	1282
994	121	1283
995	121	1284
996	121	1285
997	121	1286
998	121	1287
999	121	1288
1000	121	1289
1001	121	1290
1002	121	1291
1003	121	1292
1004	121	1304
1005	121	1305
1006	121	1309
1007	121	1318
1008	121	1332
1009	121	1333
1010	121	1334
1011	121	1352
1012	121	1359
1013	121	1360
1014	121	1367
1015	121	1368
1016	121	1378
1017	121	1386
1018	121	1394
1019	121	1395
1020	121	1399
1021	121	1401
1022	121	1402
1023	121	1403
1024	121	1404
1025	121	1405
1026	121	1408
1027	121	1410
1028	121	1412
1029	121	1414
1030	121	1416
1031	121	1417
1032	121	1418
1033	121	1420
1034	121	1445
1035	121	1448
1036	121	1450
1037	121	1457
1038	121	1458
1039	121	1459
1040	121	1460
1041	121	1461
1042	121	1462
1043	121	1463
1044	121	1464
1045	121	1465
1046	121	1466
1047	121	1477
1048	121	1478
1049	121	1499
1050	121	1518
1051	121	1521
1052	121	1522
1053	121	1523
1054	121	1530
1055	121	1548
1056	121	1554
1057	121	1569
1058	121	1570
1059	121	1580
1060	121	1582
1061	121	1598
1062	121	1606
1063	121	1608
1064	121	1630
1065	121	1639
1066	121	1648
1067	121	1660
1068	121	1661
1069	121	1682
1070	121	1707
1071	121	1709
1072	121	1713
1073	121	1714
1074	121	1715
1075	121	1716
1076	121	1717
1077	121	1724
1078	121	1736
1079	121	1777
1080	121	1831
1081	121	1832
1082	121	1833
1083	121	1834
1084	121	1835
1085	101	1232
1086	101	1233
1087	101	1236
1088	101	1255
1089	101	1282
1090	101	1283
1091	101	1284
1092	101	1285
1093	101	1286
1094	101	1287
1095	101	1288
1096	101	1289
1097	101	1290
1098	101	1291
1099	101	1292
1100	101	1293
1101	101	1294
1102	101	1295
1103	101	1296
1104	101	1297
1105	101	1298
1106	101	1299
1107	101	1300
1108	101	1302
1109	101	1306
1110	101	1315
1111	101	1317
1112	101	1318
1113	101	1322
1114	101	1326
1115	101	1327
1116	101	1328
1117	101	1335
1118	101	1336
1119	101	1337
1120	101	1338
1121	101	1339
1122	101	1344
1123	101	1347
1124	101	1350
1125	101	1351
1126	101	1352
1127	101	1353
1128	101	1357
1129	101	1359
1130	101	1360
1131	101	1361
1132	101	1364
1133	101	1365
1134	101	1366
1135	101	1367
1136	101	1373
1137	101	1376
1138	101	1380
1139	101	1381
1140	101	1386
1141	101	1387
1142	101	1399
1143	101	1422
1144	101	1443
1145	101	1444
1146	101	1447
1147	101	1448
1148	101	1450
1149	101	1453
1150	101	1454
1151	101	1455
1152	101	1456
1153	101	1458
1154	101	1466
1155	101	1472
1156	101	1473
1157	101	1475
1158	101	1476
1159	101	1477
1160	101	1478
1161	101	1479
1162	101	1480
1163	101	1481
1164	101	1482
1165	101	1483
1166	101	1484
1167	101	1485
1168	101	1498
1169	101	1501
1170	101	1513
1171	101	1514
1172	101	1522
1173	101	1524
1174	101	1525
1175	101	1526
1176	101	1528
1177	101	1534
1178	101	1535
1179	101	1540
1180	101	1541
1181	101	1549
1182	101	1554
1183	101	1555
1184	101	1556
1185	101	1559
1186	101	1582
1187	101	1606
1188	101	1626
1189	101	1649
1190	101	1650
1191	101	1655
1192	101	1664
1193	101	1677
1194	101	1678
1195	101	1687
1196	101	1702
1197	101	1705
1198	101	1721
1199	101	1730
1200	101	1734
1201	101	1754
1202	101	1769
1203	101	1773
1204	101	1780
1205	101	1789
1206	102	1255
1207	102	1282
1208	102	1283
1209	102	1284
1210	102	1285
1211	102	1286
1212	102	1287
1213	102	1288
1214	102	1289
1215	102	1290
1216	102	1291
1217	102	1292
1218	102	1293
1219	102	1294
1220	102	1315
1221	102	1318
1222	102	1319
1223	102	1322
1224	102	1328
1225	102	1335
1226	102	1336
1227	102	1337
1228	102	1338
1229	102	1339
1230	102	1347
1231	102	1350
1232	102	1352
1233	102	1353
1234	102	1357
1235	102	1359
1236	102	1360
1237	102	1364
1238	102	1365
1239	102	1366
1240	102	1367
1241	102	1373
1242	102	1380
1243	102	1381
1244	102	1386
1245	102	1387
1246	102	1399
1247	102	1443
1248	102	1444
1249	102	1447
1250	102	1448
1251	102	1450
1252	102	1455
1253	102	1456
1254	102	1458
1255	102	1472
1256	102	1473
1257	102	1475
1258	102	1476
1259	102	1477
1260	102	1478
1261	102	1479
1262	102	1480
1263	102	1486
1264	102	1487
1265	102	1490
1266	102	1498
1267	102	1501
1268	102	1513
1269	102	1514
1270	102	1522
1271	102	1528
1272	102	1534
1273	102	1535
1274	102	1540
1275	102	1541
1276	102	1554
1277	102	1555
1278	102	1556
1279	102	1559
1280	102	1582
1281	102	1606
1282	102	1655
1283	102	1664
1284	102	1677
1285	102	1678
1286	102	1687
1287	102	1721
1288	102	1730
1289	102	1751
1290	102	1754
1291	102	1769
1292	102	1773
1293	102	1780
1294	102	1789
1295	103	1235
1296	103	1248
1297	103	1282
1298	103	1283
1299	103	1284
1300	103	1285
1301	103	1286
1302	103	1287
1303	103	1288
1304	103	1289
1305	103	1290
1306	103	1291
1307	103	1292
1308	103	1301
1309	103	1303
1310	103	1318
1311	103	1319
1312	103	1320
1313	103	1321
1314	103	1329
1315	103	1330
1316	103	1336
1317	103	1337
1318	103	1338
1319	103	1342
1320	103	1343
1321	103	1345
1322	103	1346
1323	103	1347
1324	103	1352
1325	103	1356
1326	103	1359
1327	103	1360
1328	103	1363
1329	103	1365
1330	103	1367
1331	103	1370
1332	103	1371
1333	103	1372
1334	103	1373
1335	103	1375
1336	103	1376
1337	103	1386
1338	103	1390
1339	103	1399
1340	103	1411
1341	103	1421
1342	103	1422
1343	103	1428
1344	103	1434
1345	103	1435
1346	103	1436
1347	103	1447
1348	103	1477
1349	103	1478
1350	103	1484
1351	103	1485
1352	103	1498
1353	103	1522
1354	103	1524
1355	103	1525
1356	103	1526
1357	103	1527
1358	103	1555
1359	103	1562
1360	103	1563
1361	103	1564
1362	103	1582
1363	103	1606
1364	103	1648
1365	103	1668
1366	103	1684
1367	103	1685
1368	103	1693
1369	103	1702
1370	103	1710
1371	103	1711
1372	103	1712
1373	103	1719
1374	103	1726
1375	103	1731
1376	103	1761
1377	103	1762
1378	103	1765
1379	103	1767
1380	103	1771
1381	103	1772
1382	103	1789
1383	103	1792
1384	126	1232
1385	126	1233
1386	126	1235
1387	126	1262
1388	126	1282
1389	126	1283
1390	126	1284
1391	126	1285
1392	126	1286
1393	126	1287
1394	126	1288
1395	126	1289
1396	126	1290
1397	126	1291
1398	126	1292
1399	126	1293
1400	126	1294
1401	126	1302
1402	126	1306
1403	126	1315
1404	126	1318
1405	126	1319
1406	126	1320
1407	126	1321
1408	126	1322
1409	126	1323
1410	126	1324
1411	126	1325
1412	126	1327
1413	126	1329
1414	126	1330
1415	126	1336
1416	126	1337
1417	126	1338
1418	126	1339
1419	126	1344
1420	126	1345
1421	126	1347
1422	126	1350
1423	126	1352
1424	126	1353
1425	126	1354
1426	126	1355
1427	126	1356
1428	126	1357
1429	126	1359
1430	126	1360
1431	126	1363
1432	126	1364
1433	126	1365
1434	126	1366
1435	126	1367
1436	126	1372
1437	126	1373
1438	126	1375
1439	126	1376
1440	126	1377
1441	126	1379
1442	126	1380
1443	126	1381
1444	126	1386
1445	126	1387
1446	126	1399
1447	126	1411
1448	126	1421
1449	126	1422
1450	126	1428
1451	126	1436
1452	126	1446
1453	126	1447
1454	126	1448
1455	126	1450
1456	126	1453
1457	126	1454
1458	126	1455
1459	126	1456
1460	126	1458
1461	126	1466
1462	126	1472
1463	126	1473
1464	126	1477
1465	126	1478
1466	126	1479
1467	126	1480
1468	126	1484
1469	126	1485
1470	126	1486
1471	126	1487
1472	126	1498
1473	126	1522
1474	126	1524
1475	126	1525
1476	126	1526
1477	126	1529
1478	126	1535
1479	126	1541
1480	126	1544
1481	126	1549
1482	126	1554
1483	126	1555
1484	126	1559
1485	126	1582
1486	126	1606
1487	126	1633
1488	126	1649
1489	126	1650
1490	126	1657
1491	126	1669
1492	126	1678
1493	126	1686
1494	126	1687
1495	126	1710
1496	126	1711
1497	126	1712
1498	126	1720
1499	126	1725
1500	126	1754
1501	126	1769
1502	126	1788
1503	104	1235
1504	104	1282
1505	104	1283
1506	104	1284
1507	104	1285
1508	104	1286
1509	104	1287
1510	104	1288
1511	104	1289
1512	104	1290
1513	104	1291
1514	104	1292
1515	104	1301
1516	104	1303
1517	104	1318
1518	104	1319
1519	104	1320
1520	104	1321
1521	104	1329
1522	104	1330
1523	104	1336
1524	104	1337
1525	104	1338
1526	104	1342
1527	104	1343
1528	104	1345
1529	104	1346
1530	104	1347
1531	104	1352
1532	104	1356
1533	104	1359
1534	104	1360
1535	104	1363
1536	104	1365
1537	104	1367
1538	104	1370
1539	104	1371
1540	104	1372
1541	104	1373
1542	104	1375
1543	104	1376
1544	104	1386
1545	104	1390
1546	104	1399
1547	104	1411
1548	104	1421
1549	104	1422
1550	104	1428
1551	104	1434
1552	104	1435
1553	104	1436
1554	104	1447
1555	104	1453
1556	104	1454
1557	104	1477
1558	104	1478
1559	104	1484
1560	104	1485
1561	104	1522
1562	104	1524
1563	104	1525
1564	104	1526
1565	104	1527
1566	104	1555
1567	104	1562
1568	104	1563
1569	104	1564
1570	104	1582
1571	104	1606
1572	104	1648
1573	104	1662
1574	104	1668
1575	104	1684
1576	104	1685
1577	104	1693
1578	104	1695
1579	104	1702
1580	104	1710
1581	104	1711
1582	104	1712
1583	104	1719
1584	104	1726
1585	104	1762
1586	104	1765
1587	104	1771
1588	104	1772
1589	105	1232
1590	105	1233
1591	105	1282
1592	105	1283
1593	105	1284
1594	105	1285
1595	105	1286
1596	105	1287
1597	105	1288
1598	105	1289
1599	105	1290
1600	105	1291
1601	105	1292
1602	105	1293
1603	105	1294
1604	105	1295
1605	105	1298
1606	105	1306
1607	105	1323
1608	105	1329
1609	105	1335
1610	105	1336
1611	105	1337
1612	105	1338
1613	105	1339
1614	105	1341
1615	105	1344
1616	105	1350
1617	105	1351
1618	105	1352
1619	105	1353
1620	105	1354
1621	105	1355
1622	105	1356
1623	105	1357
1624	105	1359
1625	105	1360
1626	105	1363
1627	105	1364
1628	105	1365
1629	105	1366
1630	105	1367
1631	105	1373
1632	105	1376
1633	105	1377
1634	105	1379
1635	105	1380
1636	105	1381
1637	105	1387
1638	105	1411
1639	105	1428
1640	105	1436
1641	105	1442
1642	105	1446
1643	105	1447
1644	105	1448
1645	105	1450
1646	105	1455
1647	105	1456
1648	105	1458
1649	105	1472
1650	105	1473
1651	105	1479
1652	105	1480
1653	105	1498
1654	105	1499
1655	105	1527
1656	105	1535
1657	105	1541
1658	105	1549
1659	105	1554
1660	105	1559
1661	105	1569
1662	105	1570
1663	105	1582
1664	105	1606
1665	105	1627
1666	105	1646
1667	105	1653
1668	105	1655
1669	105	1689
1670	105	1695
1671	105	1770
1672	105	1784
1673	105	1785
1674	127	1235
1675	127	1282
1676	127	1283
1677	127	1284
1678	127	1285
1679	127	1286
1680	127	1287
1681	127	1288
1682	127	1289
1683	127	1290
1684	127	1291
1685	127	1292
1686	127	1293
1687	127	1294
1688	127	1318
1689	127	1319
1690	127	1328
1691	127	1329
1692	127	1336
1693	127	1337
1694	127	1338
1695	127	1339
1696	127	1357
1697	127	1359
1698	127	1360
1699	127	1366
1700	127	1373
1701	127	1378
1702	127	1380
1703	127	1386
1704	127	1387
1705	127	1399
1706	127	1411
1707	127	1421
1708	127	1428
1709	127	1436
1710	127	1445
1711	127	1446
1712	127	1447
1713	127	1448
1714	127	1450
1715	127	1458
1716	127	1472
1717	127	1473
1718	127	1477
1719	127	1478
1720	127	1486
1721	127	1487
1722	127	1488
1723	127	1498
1724	127	1522
1725	127	1524
1726	127	1525
1727	127	1526
1728	127	1535
1729	127	1541
1730	127	1554
1731	127	1582
1732	127	1606
1733	127	1669
1734	106	1238
1735	106	1282
1736	106	1283
1737	106	1284
1738	106	1285
1739	106	1286
1740	106	1287
1741	106	1288
1742	106	1289
1743	106	1290
1744	106	1291
1745	106	1292
1746	106	1296
1747	106	1304
1748	106	1306
1749	106	1318
1750	106	1326
1751	106	1329
1752	106	1339
1753	106	1344
1754	106	1351
1755	106	1357
1756	106	1359
1757	106	1360
1758	106	1366
1759	106	1373
1760	106	1379
1761	106	1381
1762	106	1386
1763	106	1387
1764	106	1388
1765	106	1399
1766	106	1400
1767	106	1405
1768	106	1411
1769	106	1417
1770	106	1420
1771	106	1428
1772	106	1436
1773	106	1442
1774	106	1446
1775	106	1447
1776	106	1448
1777	106	1449
1778	106	1450
1779	106	1458
1780	106	1477
1781	106	1478
1782	106	1484
1783	106	1485
1784	106	1489
1785	106	1491
1786	106	1501
1787	106	1522
1788	106	1530
1789	106	1531
1790	106	1532
1791	106	1533
1792	106	1535
1793	106	1543
1794	106	1549
1795	106	1554
1796	106	1562
1797	106	1563
1798	106	1582
1799	106	1606
1800	106	1610
1801	106	1627
1802	106	1643
1803	106	1657
1804	106	1733
1805	106	1764
1806	106	1774
1807	107	1272
1808	107	1283
1809	107	1284
1810	107	1285
1811	107	1286
1812	107	1287
1813	107	1288
1814	107	1289
1815	107	1329
1816	107	1336
1817	107	1337
1818	107	1338
1819	107	1342
1820	107	1343
1821	107	1430
1822	107	1443
1823	107	1645
1824	107	1689
1825	107	1740
1826	107	1742
1827	107	1836
1828	107	1837
1829	107	1838
1830	107	1839
1831	107	1840
1832	107	1841
1833	107	1842
1834	107	1843
1835	107	1844
1836	107	1845
1837	107	1846
1838	107	1847
1839	107	1848
1840	107	1849
1841	107	1850
1842	107	1851
1843	107	1852
1844	107	1853
1845	107	1854
1846	107	1855
1847	107	1856
1848	107	1857
1849	107	1858
1850	107	1859
1851	107	1860
1852	107	1861
1853	107	1862
1854	108	1235
1855	108	1256
1856	108	1282
1857	108	1283
1858	108	1284
1859	108	1285
1860	108	1286
1861	108	1287
1862	108	1288
1863	108	1289
1864	108	1290
1865	108	1291
1866	108	1292
1867	108	1293
1868	108	1294
1869	108	1301
1870	108	1302
1871	108	1303
1872	108	1307
1873	108	1308
1874	108	1310
1875	108	1311
1876	108	1312
1877	108	1313
1878	108	1314
1879	108	1315
1880	108	1316
1881	108	1324
1882	108	1325
1883	108	1344
1884	108	1346
1885	108	1347
1886	108	1350
1887	108	1352
1888	108	1354
1889	108	1355
1890	108	1358
1891	108	1359
1892	108	1360
1893	108	1367
1894	108	1374
1895	108	1383
1896	108	1413
1897	108	1421
1898	108	1422
1899	108	1469
1900	108	1474
1901	108	1504
1902	108	1511
1903	108	1521
1904	108	1559
1905	108	1560
1906	108	1582
1907	108	1589
1908	108	1590
1909	108	1606
1910	108	1663
1911	108	1665
1912	108	1666
1913	108	1668
1914	108	1670
1915	108	1708
1916	108	1719
1917	108	1776
1918	108	1786
1919	108	1791
1920	109	1282
1921	109	1283
1922	109	1284
1923	109	1285
1924	109	1286
1925	109	1287
1926	109	1288
1927	109	1289
1928	109	1290
1929	109	1291
1930	109	1292
1931	109	1293
1932	109	1294
1933	109	1306
1934	109	1307
1935	109	1308
1936	109	1309
1937	109	1310
1938	109	1311
1939	109	1312
1940	109	1313
1941	109	1314
1942	109	1315
1943	109	1316
1944	109	1324
1945	109	1325
1946	109	1350
1947	109	1352
1948	109	1354
1949	109	1355
1950	109	1358
1951	109	1359
1952	109	1360
1953	109	1367
1954	109	1374
1955	109	1385
1956	109	1466
1957	109	1469
1958	109	1472
1959	109	1473
1960	109	1474
1961	109	1481
1962	109	1482
1963	109	1483
1964	109	1524
1965	109	1525
1966	109	1526
1967	109	1541
1968	109	1549
1969	109	1582
1970	109	1589
1971	109	1590
1972	109	1606
1973	109	1681
1974	109	1688
1975	109	1709
1976	109	1723
1977	110	1282
1978	110	1283
1979	110	1284
1980	110	1285
1981	110	1286
1982	110	1287
1983	110	1288
1984	110	1289
1985	110	1290
1986	110	1291
1987	110	1292
1988	110	1299
1989	110	1300
1990	110	1311
1991	110	1344
1992	110	1359
1993	110	1360
1994	110	1382
1995	110	1383
1996	110	1384
1997	110	1470
1998	110	1471
1999	110	1472
2000	110	1473
2001	110	1502
2002	110	1503
2003	110	1524
2004	110	1525
2005	110	1526
2006	110	1536
2007	110	1541
2008	110	1560
2009	110	1582
2010	110	1589
2011	110	1590
2012	110	1606
2013	110	1628
2014	110	1657
2015	111	1237
2016	111	1282
2017	111	1283
2018	111	1284
2019	111	1285
2020	111	1286
2021	111	1287
2022	111	1288
2023	111	1289
2024	111	1290
2025	111	1291
2026	111	1292
2027	111	1293
2028	111	1294
2029	111	1297
2030	111	1318
2031	111	1320
2032	111	1321
2033	111	1326
2034	111	1329
2035	111	1339
2036	111	1344
2037	111	1345
2038	111	1348
2039	111	1349
2040	111	1354
2041	111	1355
2042	111	1357
2043	111	1359
2044	111	1360
2045	111	1361
2046	111	1366
2047	111	1373
2048	111	1378
2049	111	1381
2050	111	1386
2051	111	1387
2052	111	1389
2053	111	1391
2054	111	1399
2055	111	1400
2056	111	1413
2057	111	1419
2058	111	1420
2059	111	1439
2060	111	1445
2061	111	1448
2062	111	1450
2063	111	1455
2064	111	1456
2065	111	1458
2066	111	1466
2067	111	1472
2068	111	1473
2069	111	1477
2070	111	1478
2071	111	1479
2072	111	1480
2073	111	1481
2074	111	1482
2075	111	1483
2076	111	1484
2077	111	1485
2078	111	1486
2079	111	1487
2080	111	1498
2081	111	1522
2082	111	1524
2083	111	1525
2084	111	1526
2085	111	1530
2086	111	1532
2087	111	1533
2088	111	1535
2089	111	1541
2090	111	1543
2091	111	1554
2092	111	1582
2093	111	1606
2094	111	1621
2095	111	1646
2096	111	1653
2097	111	1675
2098	112	1234
2099	112	1254
2100	112	1282
2101	112	1283
2102	112	1284
2103	112	1285
2104	112	1286
2105	112	1287
2106	112	1288
2107	112	1289
2108	112	1290
2109	112	1291
2110	112	1292
2111	112	1293
2112	112	1294
2113	112	1318
2114	112	1320
2115	112	1321
2116	112	1324
2117	112	1325
2118	112	1336
2119	112	1337
2120	112	1338
2121	112	1339
2122	112	1344
2123	112	1345
2124	112	1348
2125	112	1349
2126	112	1352
2127	112	1354
2128	112	1355
2129	112	1357
2130	112	1359
2131	112	1360
2132	112	1366
2133	112	1367
2134	112	1368
2135	112	1369
2136	112	1373
2137	112	1378
2138	112	1386
2139	112	1387
2140	112	1388
2141	112	1389
2142	112	1399
2143	112	1400
2144	112	1402
2145	112	1413
2146	112	1414
2147	112	1437
2148	112	1438
2149	112	1445
2150	112	1448
2151	112	1450
2152	112	1458
2153	112	1465
2154	112	1466
2155	112	1477
2156	112	1478
2157	112	1484
2158	112	1485
2159	112	1498
2160	112	1522
2161	112	1524
2162	112	1525
2163	112	1526
2164	112	1532
2165	112	1533
2166	112	1535
2167	112	1542
2168	112	1553
2169	112	1554
2170	112	1565
2171	112	1582
2172	112	1606
2173	112	1639
2174	112	1642
2175	112	1748
2176	112	1783
2177	113	1232
2178	113	1282
2179	113	1283
2180	113	1284
2181	113	1285
2182	113	1286
2183	113	1287
2184	113	1288
2185	113	1289
2186	113	1290
2187	113	1291
2188	113	1292
2189	113	1293
2190	113	1294
2191	113	1302
2192	113	1306
2193	113	1315
2194	113	1318
2195	113	1327
2196	113	1329
2197	113	1331
2198	113	1336
2199	113	1337
2200	113	1338
2201	113	1339
2202	113	1342
2203	113	1343
2204	113	1344
2205	113	1347
2206	113	1350
2207	113	1352
2208	113	1353
2209	113	1357
2210	113	1359
2211	113	1360
2212	113	1364
2213	113	1365
2214	113	1366
2215	113	1367
2216	113	1373
2217	113	1380
2218	113	1381
2219	113	1386
2220	113	1387
2221	113	1399
2222	113	1411
2223	113	1428
2224	113	1436
2225	113	1442
2226	113	1448
2227	113	1450
2228	113	1455
2229	113	1456
2230	113	1458
2231	113	1466
2232	113	1472
2233	113	1473
2234	113	1477
2235	113	1478
2236	113	1479
2237	113	1480
2238	113	1484
2239	113	1485
2240	113	1486
2241	113	1487
2242	113	1501
2243	113	1522
2244	113	1524
2245	113	1525
2246	113	1526
2247	113	1527
2248	113	1531
2249	113	1534
2250	113	1535
2251	113	1537
2252	113	1538
2253	113	1539
2254	113	1541
2255	113	1544
2256	113	1549
2257	113	1554
2258	113	1555
2259	113	1582
2260	113	1606
2261	113	1627
2262	113	1687
2263	113	1773
2264	113	1779
2265	128	1254
2266	128	1282
2267	128	1283
2268	128	1284
2269	128	1285
2270	128	1286
2271	128	1287
2272	128	1288
2273	128	1289
2274	128	1290
2275	128	1291
2276	128	1292
2277	128	1293
2278	128	1294
2279	128	1333
2280	128	1334
2281	128	1348
2282	128	1349
2283	128	1354
2284	128	1355
2285	128	1359
2286	128	1360
2287	128	1370
2288	128	1377
2289	128	1378
2290	128	1394
2291	128	1395
2292	128	1401
2293	128	1437
2294	128	1438
2295	128	1445
2296	128	1470
2297	128	1471
2298	128	1472
2299	128	1473
2300	128	1479
2301	128	1480
2302	128	1505
2303	128	1510
2304	128	1518
2305	128	1524
2306	128	1525
2307	128	1526
2308	128	1541
2309	128	1542
2310	128	1553
2311	128	1582
2312	128	1606
2313	128	1659
2314	128	1679
2315	128	1694
2316	128	1751
2317	114	1232
2318	114	1235
2319	114	1282
2320	114	1283
2321	114	1284
2322	114	1285
2323	114	1286
2324	114	1287
2325	114	1288
2326	114	1289
2327	114	1290
2328	114	1291
2329	114	1292
2330	114	1293
2331	114	1294
2332	114	1297
2333	114	1299
2334	114	1300
2335	114	1302
2336	114	1306
2337	114	1315
2338	114	1318
2339	114	1324
2340	114	1325
2341	114	1326
2342	114	1331
2343	114	1332
2344	114	1333
2345	114	1334
2346	114	1336
2347	114	1337
2348	114	1338
2349	114	1339
2350	114	1340
2351	114	1344
2352	114	1350
2353	114	1351
2354	114	1352
2355	114	1354
2356	114	1355
2357	114	1357
2358	114	1359
2359	114	1360
2360	114	1364
2361	114	1365
2362	114	1366
2363	114	1367
2364	114	1373
2365	114	1374
2366	114	1378
2367	114	1380
2368	114	1381
2369	114	1386
2370	114	1387
2371	114	1389
2372	114	1391
2373	114	1392
2374	114	1393
2375	114	1396
2376	114	1397
2377	114	1398
2378	114	1399
2379	114	1400
2380	114	1401
2381	114	1413
2382	114	1420
2383	114	1421
2384	114	1423
2385	114	1424
2386	114	1437
2387	114	1438
2388	114	1439
2389	114	1440
2390	114	1441
2391	114	1445
2392	114	1448
2393	114	1450
2394	114	1451
2395	114	1452
2396	114	1455
2397	114	1456
2398	114	1458
2399	114	1466
2400	114	1467
2401	114	1468
2402	114	1477
2403	114	1478
2404	114	1484
2405	114	1485
2406	114	1486
2407	114	1487
2408	114	1498
2409	114	1499
2410	114	1522
2411	114	1524
2412	114	1525
2413	114	1526
2414	114	1531
2415	114	1535
2416	114	1544
2417	114	1545
2418	114	1546
2419	114	1547
2420	114	1549
2421	114	1554
2422	114	1555
2423	114	1557
2424	114	1558
2425	114	1562
2426	114	1563
2427	114	1569
2428	114	1570
2429	114	1575
2430	114	1582
2431	114	1606
2432	114	1648
2433	114	1658
2434	114	1675
2435	114	1698
2436	114	1699
2437	114	1706
2438	114	1729
2439	114	1737
2440	114	1741
2441	114	1753
2442	115	1232
2443	115	1244
2444	115	1245
2445	115	1246
2446	115	1282
2447	115	1283
2448	115	1284
2449	115	1285
2450	115	1286
2451	115	1287
2452	115	1288
2453	115	1289
2454	115	1290
2455	115	1291
2456	115	1292
2457	115	1304
2458	115	1305
2459	115	1309
2460	115	1318
2461	115	1332
2462	115	1333
2463	115	1334
2464	115	1352
2465	115	1359
2466	115	1360
2467	115	1367
2468	115	1368
2469	115	1369
2470	115	1378
2471	115	1386
2472	115	1394
2473	115	1395
2474	115	1399
2475	115	1401
2476	115	1402
2477	115	1403
2478	115	1404
2479	115	1405
2480	115	1408
2481	115	1410
2482	115	1412
2483	115	1414
2484	115	1415
2485	115	1416
2486	115	1417
2487	115	1418
2488	115	1420
2489	115	1425
2490	115	1445
2491	115	1448
2492	115	1450
2493	115	1457
2494	115	1458
2495	115	1459
2496	115	1460
2497	115	1461
2498	115	1462
2499	115	1463
2500	115	1464
2501	115	1465
2502	115	1466
2503	115	1477
2504	115	1478
2505	115	1499
2506	115	1521
2507	115	1522
2508	115	1523
2509	115	1530
2510	115	1546
2511	115	1566
2512	115	1569
2513	115	1570
2514	115	1579
2515	115	1580
2516	115	1581
2517	115	1582
2518	115	1598
2519	115	1606
2520	115	1608
2521	115	1630
2522	115	1639
2523	115	1648
2524	115	1660
2525	115	1661
2526	115	1682
2527	115	1709
2528	115	1713
2529	115	1714
2530	115	1715
2531	115	1716
2532	115	1717
2533	115	1724
2534	115	1736
2535	115	1753
2536	116	1282
2537	116	1283
2538	116	1284
2539	116	1285
2540	116	1286
2541	116	1287
2542	116	1288
2543	116	1289
2544	116	1290
2545	116	1291
2546	116	1292
2547	116	1293
2548	116	1294
2549	116	1297
2550	116	1309
2551	116	1317
2552	116	1318
2553	116	1324
2554	116	1325
2555	116	1326
2556	116	1332
2557	116	1333
2558	116	1334
2559	116	1340
2560	116	1354
2561	116	1355
2562	116	1359
2563	116	1360
2564	116	1378
2565	116	1386
2566	116	1391
2567	116	1399
2568	116	1437
2569	116	1438
2570	116	1440
2571	116	1441
2572	116	1445
2573	116	1451
2574	116	1452
2575	116	1464
2576	116	1472
2577	116	1473
2578	116	1477
2579	116	1478
2580	116	1498
2581	116	1505
2582	116	1522
2583	116	1523
2584	116	1531
2585	116	1541
2586	116	1575
2587	116	1582
2588	116	1606
2589	116	1626
2590	116	1648
2591	117	1282
2592	117	1283
2593	117	1284
2594	117	1285
2595	117	1286
2596	117	1287
2597	117	1288
2598	117	1289
2599	117	1290
2600	117	1291
2601	117	1292
2602	117	1293
2603	117	1294
2604	117	1309
2605	117	1318
2606	117	1324
2607	117	1325
2608	117	1332
2609	117	1333
2610	117	1334
2611	117	1336
2612	117	1337
2613	117	1338
2614	117	1342
2615	117	1354
2616	117	1355
2617	117	1359
2618	117	1360
2619	117	1378
2620	117	1386
2621	117	1389
2622	117	1391
2623	117	1399
2624	117	1400
2625	117	1419
2626	117	1437
2627	117	1438
2628	117	1445
2629	117	1477
2630	117	1478
2631	117	1488
2632	117	1498
2633	117	1522
2634	117	1532
2635	117	1533
2636	117	1557
2637	117	1558
2638	117	1582
2639	117	1606
2640	117	1768
2641	117	1790
2642	129	1244
2643	129	1245
2644	129	1246
2645	129	1265
2646	129	1266
2647	129	1282
2648	129	1283
2649	129	1284
2650	129	1285
2651	129	1286
2652	129	1287
2653	129	1290
2654	129	1291
2655	129	1292
2656	129	1297
2657	129	1315
2658	129	1318
2659	129	1329
2660	129	1342
2661	129	1343
2662	129	1359
2663	129	1360
2664	129	1386
2665	129	1392
2666	129	1393
2667	129	1410
2668	129	1469
2669	129	1477
2670	129	1478
2671	129	1516
2672	129	1606
2673	129	1613
2674	129	1620
2675	129	1654
2676	129	1665
2677	129	1713
2678	129	1714
2679	129	1716
2680	129	1717
2681	129	1740
2682	129	1748
2683	129	1756
2684	129	1766
2685	129	1794
2686	129	1795
2687	129	1796
2688	129	1797
2689	129	1798
2690	129	1799
2691	129	1800
2692	129	1801
2693	129	1802
2694	129	1803
2695	129	1804
2696	129	1805
2697	129	1807
2698	129	1808
2699	129	1809
2700	129	1810
2701	129	1811
2702	129	1812
2703	129	1813
2704	129	1814
2705	129	1815
2706	129	1816
2707	129	1817
2708	129	1818
2709	129	1819
2710	129	1820
2711	129	1821
2712	129	1822
2713	129	1823
2714	129	1824
2715	129	1825
2716	129	1826
2717	118	1232
2718	118	1242
2719	118	1264
2720	118	1267
2721	118	1282
2722	118	1283
2723	118	1284
2724	118	1285
2725	118	1286
2726	118	1287
2727	118	1288
2728	118	1289
2729	118	1290
2730	118	1291
2731	118	1292
2732	118	1297
2733	118	1298
2734	118	1305
2735	118	1326
2736	118	1327
2737	118	1359
2738	118	1360
2739	118	1374
2740	118	1381
2741	118	1394
2742	118	1395
2743	118	1396
2744	118	1397
2745	118	1398
2746	118	1400
2747	118	1414
2748	118	1420
2749	118	1426
2750	118	1433
2751	118	1439
2752	118	1451
2753	118	1452
2754	118	1464
2755	118	1465
2756	118	1472
2757	118	1473
2758	118	1522
2759	118	1523
2760	118	1532
2761	118	1533
2762	118	1541
2763	118	1567
2764	118	1575
2765	118	1582
2766	118	1583
2767	118	1587
2768	118	1588
2769	118	1592
2770	118	1597
2771	118	1599
2772	118	1600
2773	118	1601
2774	118	1602
2775	118	1603
2776	118	1604
2777	118	1606
2778	118	1610
2779	118	1615
2780	118	1618
2781	118	1624
2782	118	1626
2783	118	1632
2784	118	1636
2785	118	1637
2786	118	1638
2787	118	1639
2788	118	1669
2789	118	1670
2790	118	1676
2791	118	1680
2792	118	1756
2793	119	1235
2794	119	1282
2795	119	1283
2796	119	1284
2797	119	1285
2798	119	1286
2799	119	1287
2800	119	1288
2801	119	1289
2802	119	1290
2803	119	1291
2804	119	1292
2805	119	1293
2806	119	1294
2807	119	1296
2808	119	1306
2809	119	1309
2810	119	1318
2811	119	1324
2812	119	1325
2813	119	1336
2814	119	1337
2815	119	1338
2816	119	1350
2817	119	1359
2818	119	1360
2819	119	1368
2820	119	1369
2821	119	1378
2822	119	1386
2823	119	1387
2824	119	1391
2825	119	1399
2826	119	1405
2827	119	1421
2828	119	1440
2829	119	1441
2830	119	1445
2831	119	1451
2832	119	1452
2833	119	1472
2834	119	1473
2835	119	1477
2836	119	1478
2837	119	1486
2838	119	1487
2839	119	1489
2840	119	1498
2841	119	1522
2842	119	1531
2843	119	1541
2844	119	1546
2845	119	1549
2846	119	1562
2847	119	1563
2848	119	1575
2849	119	1582
2850	119	1606
2851	119	1645
2852	119	1648
2853	119	1656
2854	119	1696
2855	119	1697
2856	119	1742
\.


--
-- Data for Name: work_role_skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.work_role_skills (id, work_role_id, skill_id) FROM stdin;
1	85	153
2	85	223
3	85	227
4	85	245
5	85	268
6	85	306
7	85	307
8	85	460
9	85	467
10	85	474
11	85	491
12	86	74
13	86	162
14	86	175
15	86	179
16	86	334
17	86	352
18	86	353
19	86	366
20	86	441
21	87	61
22	87	62
23	87	64
24	87	65
25	87	66
26	87	74
27	87	78
28	87	79
29	87	90
30	87	162
31	87	175
32	87	179
33	87	282
34	87	296
35	87	333
36	87	441
37	87	467
38	87	474
39	87	491
40	87	502
41	88	25
42	88	53
43	88	59
44	88	63
45	88	92
46	88	98
47	88	99
48	88	134
49	88	135
50	88	192
51	88	193
52	88	250
53	88	251
54	88	259
55	88	277
56	88	333
57	88	352
58	88	353
59	88	378
60	88	387
61	88	422
62	88	427
63	89	28
64	89	35
65	89	47
66	89	48
67	89	49
68	89	53
69	89	54
70	89	55
71	89	56
72	89	57
73	89	58
74	89	59
75	89	60
76	89	61
77	89	62
78	89	63
79	89	92
80	89	98
81	89	99
82	89	134
83	89	135
84	89	139
85	89	140
86	89	150
87	89	184
88	89	192
89	89	193
90	89	221
91	89	240
92	89	241
93	89	246
94	89	249
95	89	250
96	89	251
97	89	259
98	89	261
99	89	262
100	89	267
101	89	277
102	89	278
103	89	292
104	89	300
105	89	333
106	89	335
107	89	352
108	89	353
109	89	374
110	89	375
111	89	378
112	89	385
113	89	387
114	89	415
115	89	422
116	89	427
117	89	487
118	130	82
119	130	83
120	130	84
121	130	259
122	130	333
123	91	30
124	91	74
125	91	82
126	91	83
127	91	84
128	91	99
129	91	168
130	91	172
131	91	213
132	91	259
133	91	333
134	91	347
135	91	348
136	91	421
137	91	422
138	91	427
139	91	441
140	91	445
141	92	63
142	92	74
143	92	75
144	92	76
145	92	114
146	92	117
147	92	188
148	92	189
149	92	250
150	92	251
151	92	259
152	92	334
153	92	415
154	92	418
155	92	419
156	92	420
157	92	438
158	92	441
159	92	467
160	92	474
161	92	491
162	93	52
163	93	72
164	93	73
165	93	80
166	93	81
167	93	91
168	93	129
169	93	130
170	93	204
171	93	205
172	93	229
173	93	230
174	93	322
175	93	334
176	93	390
177	93	431
178	93	441
179	93	484
180	94	52
181	94	80
182	94	81
183	94	91
184	94	129
185	94	130
186	94	204
187	94	205
188	94	229
189	94	230
190	94	322
191	94	334
192	94	390
193	94	431
194	94	484
195	95	52
196	95	80
197	95	81
198	95	91
199	95	129
200	95	130
201	95	204
202	95	205
203	95	229
204	95	230
205	95	322
206	95	334
207	95	390
208	95	431
209	95	441
210	95	484
211	97	19
212	97	28
213	97	30
214	97	33
215	97	34
216	97	36
217	97	37
218	97	38
219	97	43
220	97	44
221	97	53
222	97	54
223	97	55
224	97	56
225	97	57
226	97	59
227	97	61
228	97	62
229	97	69
230	97	70
231	97	71
232	97	77
233	97	82
234	97	83
235	97	84
236	97	91
237	97	98
238	97	99
239	97	103
240	97	104
241	97	105
242	97	106
243	97	107
244	97	108
245	97	109
246	97	111
247	97	114
248	97	129
249	97	130
250	97	132
251	97	133
252	97	139
253	97	140
254	97	150
255	97	165
256	97	166
257	97	168
258	97	172
259	97	175
260	97	186
261	97	192
262	97	193
263	97	207
264	97	208
265	97	223
266	97	227
267	97	228
268	97	229
269	97	230
270	97	250
271	97	251
272	97	263
273	97	277
274	97	281
275	97	283
276	97	284
277	97	290
278	97	291
279	97	294
280	97	296
281	97	303
282	97	304
283	97	305
284	97	306
285	97	307
286	97	313
287	97	316
288	97	322
289	97	324
290	97	333
291	97	334
292	97	335
293	97	340
294	97	341
295	97	344
296	97	349
297	97	350
298	97	351
299	97	352
300	97	353
301	97	354
302	97	356
303	97	357
304	97	358
305	97	359
306	97	360
307	97	361
308	97	365
309	97	366
310	97	367
311	97	375
312	97	377
313	97	378
314	97	386
315	97	387
316	97	389
317	97	391
318	97	392
319	97	403
320	97	404
321	97	406
322	97	412
323	97	413
324	97	414
325	97	415
326	97	422
327	97	423
328	97	427
329	97	429
330	97	433
331	97	434
332	97	487
333	97	491
334	98	64
335	98	65
336	98	66
337	98	74
338	98	82
339	98	83
340	98	84
341	98	98
342	98	100
343	98	107
344	98	114
345	98	132
346	98	133
347	98	162
348	98	175
349	98	333
350	98	423
351	98	427
352	90	129
353	90	130
354	90	132
355	90	133
356	90	171
357	90	213
358	90	221
359	90	223
360	90	227
361	90	265
362	90	266
363	90	269
364	90	445
365	90	460
366	90	467
367	90	474
368	90	491
369	99	334
370	99	431
371	100	91
372	100	129
373	100	130
374	100	229
375	100	230
376	100	268
377	100	431
378	120	136
379	120	137
380	120	138
381	120	144
382	120	171
383	120	238
384	120	256
385	120	257
386	120	258
387	120	269
388	120	300
389	120	427
390	120	466
391	120	470
392	120	472
393	120	479
394	120	480
395	120	500
396	120	504
397	121	35
398	121	46
399	121	53
400	121	99
401	121	139
402	121	143
403	121	163
404	121	238
405	121	248
406	121	254
407	121	255
408	121	256
409	121	257
410	121	261
411	121	271
412	121	272
413	121	273
414	121	274
415	121	300
416	121	453
417	121	470
418	121	472
419	121	473
420	121	476
421	121	480
422	121	496
423	121	539
424	121	540
425	121	541
426	121	542
427	101	34
428	101	36
429	101	51
430	101	53
431	101	54
432	101	55
433	101	86
434	101	87
435	101	96
436	101	97
437	101	98
438	101	125
439	101	132
440	101	133
441	101	192
442	101	193
443	101	200
444	101	218
445	101	219
446	101	220
447	101	223
448	101	227
449	101	239
450	101	245
451	101	247
452	101	262
453	101	281
454	101	286
455	101	287
456	101	304
457	101	306
458	101	307
459	101	308
460	101	322
461	101	323
462	101	324
463	101	331
464	101	332
465	101	333
466	101	365
467	101	393
468	101	415
469	101	433
470	101	434
471	101	442
472	101	469
473	101	493
474	101	503
475	102	51
476	102	88
477	102	94
478	102	95
479	102	132
480	102	133
481	102	192
482	102	193
483	102	200
484	102	219
485	102	220
486	102	223
487	102	227
488	102	239
489	102	246
490	102	323
491	102	324
492	102	331
493	102	333
494	102	393
495	102	433
496	102	434
497	102	442
498	102	469
499	102	493
500	102	503
501	103	36
502	103	37
503	103	50
504	103	85
505	103	132
506	103	133
507	103	192
508	103	193
509	103	209
510	103	211
511	103	212
512	103	214
513	103	218
514	103	223
515	103	246
516	103	304
517	103	306
518	103	307
519	103	319
520	103	444
521	103	455
522	103	491
523	103	492
524	103	495
525	126	34
526	126	36
527	126	51
528	126	53
529	126	59
530	126	77
531	126	86
532	126	87
533	126	91
534	126	96
535	126	97
536	126	98
537	126	129
538	126	130
539	126	132
540	126	133
541	126	186
542	126	192
543	126	193
544	126	218
545	126	219
546	126	220
547	126	223
548	126	227
549	126	268
550	126	304
551	126	313
552	126	323
553	126	324
554	126	329
555	126	333
556	126	378
557	126	412
558	126	413
559	126	414
560	126	443
561	126	477
562	126	491
563	126	503
564	126	507
565	104	37
566	104	132
567	104	133
568	104	192
569	104	193
570	104	211
571	104	212
572	104	218
573	104	223
574	104	265
575	104	266
576	104	304
577	104	306
578	104	307
579	104	444
580	104	448
581	104	491
582	104	495
583	105	25
584	105	132
585	105	133
586	105	162
587	105	175
588	105	200
589	105	203
590	105	204
591	105	205
592	105	239
593	105	303
594	105	322
595	105	323
596	105	324
597	105	361
598	105	390
599	105	423
600	105	442
601	105	443
602	105	449
603	105	484
604	105	491
605	105	498
606	105	501
607	127	19
608	127	24
609	127	69
610	127	70
611	127	71
612	127	77
613	127	207
614	127	208
615	127	217
616	127	222
617	127	228
618	127	246
619	127	247
620	127	279
621	127	281
622	127	283
623	127	284
624	127	288
625	127	415
626	127	461
627	127	499
628	106	36
629	106	53
630	106	59
631	106	132
632	106	133
633	106	142
634	106	148
635	106	149
636	106	150
637	106	186
638	106	192
639	106	193
640	106	200
641	106	211
642	106	212
643	106	309
644	106	317
645	106	318
646	106	324
647	106	378
648	106	427
649	106	446
650	107	34
651	107	53
652	107	54
653	107	55
654	107	59
655	107	98
656	107	126
657	107	128
658	107	185
659	107	322
660	107	333
661	107	426
662	107	543
663	107	544
664	107	545
665	107	546
666	107	547
667	107	548
668	107	549
669	107	550
670	107	551
671	107	552
672	107	553
673	107	554
674	107	555
675	108	20
676	108	21
677	108	29
678	108	31
679	108	32
680	108	36
681	108	67
682	108	68
683	108	207
684	108	208
685	108	211
686	108	212
687	108	228
688	108	235
689	108	246
690	108	249
691	108	259
692	108	270
693	108	271
694	108	275
695	108	280
696	108	285
697	108	289
698	108	293
699	108	295
700	108	297
701	108	298
702	108	299
703	108	329
704	108	340
705	108	341
706	108	349
707	108	350
708	108	351
709	108	352
710	108	365
711	108	371
712	108	415
713	108	427
714	108	428
715	108	439
716	108	440
717	108	447
718	108	454
719	108	470
720	108	490
721	108	505
722	109	23
723	109	194
724	109	195
725	109	207
726	109	208
727	109	228
728	109	235
729	109	365
730	109	415
731	109	439
732	109	440
733	109	447
734	109	454
735	109	505
736	110	18
737	110	169
738	110	184
739	110	206
740	110	235
741	110	378
742	111	22
743	111	26
744	111	89
745	111	92
746	111	93
747	111	118
748	111	224
749	111	225
750	111	231
751	111	232
752	111	233
753	111	234
754	111	264
755	111	267
756	111	320
757	111	324
758	111	330
759	111	332
760	111	359
761	111	386
762	111	435
763	112	23
764	112	30
765	112	75
766	112	76
767	112	98
768	112	106
769	112	115
770	112	116
771	112	118
772	112	139
773	112	140
774	112	154
775	112	155
776	112	210
777	112	226
778	112	231
779	112	236
780	112	242
781	112	255
782	112	262
783	112	311
784	112	312
785	112	321
786	112	323
787	112	324
788	112	325
789	112	326
790	112	334
791	112	366
792	112	376
793	112	393
794	112	463
795	113	34
796	113	146
797	113	147
798	113	150
799	113	151
800	113	152
801	113	153
802	113	192
803	113	193
804	113	219
805	113	220
806	113	223
807	113	227
808	113	246
809	113	316
810	113	323
811	113	324
812	113	335
813	128	75
814	128	76
815	128	145
816	128	154
817	128	155
818	128	231
819	128	242
820	128	243
821	128	244
822	128	310
823	128	327
824	128	328
825	128	334
826	128	425
827	128	426
828	128	427
829	128	463
830	128	468
831	128	470
832	128	502
833	114	35
834	114	150
835	114	157
836	114	171
837	114	192
838	114	193
839	114	215
840	114	216
841	114	221
842	114	223
843	114	227
844	114	242
845	114	249
846	114	263
847	114	276
848	114	300
849	114	316
850	114	335
851	114	352
852	114	359
853	114	386
854	114	429
855	114	457
856	114	458
857	114	459
858	114	465
859	114	470
860	114	473
861	114	475
862	114	479
863	114	480
864	114	481
865	114	483
866	114	486
867	114	487
868	114	488
869	114	497
870	114	502
871	115	35
872	115	46
873	115	139
874	115	140
875	115	141
876	115	142
877	115	143
878	115	158
879	115	163
880	115	224
881	115	225
882	115	238
883	115	248
884	115	252
885	115	253
886	115	254
887	115	255
888	115	256
889	115	257
890	115	258
891	115	260
892	115	261
893	115	270
894	115	271
895	115	272
896	115	273
897	115	274
898	115	300
899	115	301
900	115	302
901	115	320
902	115	326
903	115	441
904	115	453
905	115	470
906	115	472
907	115	473
908	115	476
909	115	480
910	115	488
911	115	494
912	115	496
913	116	26
914	116	27
915	116	150
916	116	171
917	116	193
918	116	196
919	116	197
920	116	198
921	116	199
922	116	221
923	116	238
924	116	256
925	116	257
926	116	258
927	116	263
928	116	264
929	116	300
930	116	335
931	116	425
932	116	426
933	116	441
934	116	470
935	116	480
936	117	26
937	117	201
938	117	202
939	117	241
940	117	242
941	117	245
942	117	264
943	117	292
944	117	294
945	117	450
946	117	506
947	129	46
948	129	59
949	129	110
950	129	144
951	129	189
952	129	207
953	129	208
954	129	228
955	129	237
956	129	259
957	129	335
958	129	336
959	129	365
960	129	381
961	129	415
962	129	437
963	129	441
964	129	466
965	129	470
966	129	480
967	129	487
968	129	500
969	129	504
970	129	508
971	129	509
972	129	510
973	129	511
974	129	512
975	129	513
976	129	514
977	129	515
978	129	516
979	129	517
980	129	518
981	129	519
982	129	520
983	118	30
984	118	40
985	118	53
986	118	98
987	118	101
988	118	102
989	118	103
990	118	104
991	118	106
992	118	111
993	118	112
994	118	113
995	118	139
996	118	140
997	118	160
998	118	167
999	118	168
1000	118	171
1001	118	172
1002	118	173
1003	118	174
1004	118	176
1005	118	177
1006	118	187
1007	118	188
1008	118	189
1009	118	204
1010	118	205
1011	118	228
1012	118	249
1013	118	282
1014	118	322
1015	118	339
1016	118	342
1017	118	344
1018	118	349
1019	118	352
1020	118	353
1021	118	355
1022	118	356
1023	118	361
1024	118	365
1025	118	381
1026	118	383
1027	118	387
1028	118	395
1029	118	404
1030	118	405
1031	118	415
1032	118	483
1033	118	489
1034	119	150
1035	119	159
1036	119	186
1037	119	192
1038	119	193
1039	119	221
1040	119	223
1041	119	227
1042	119	237
1043	119	240
1044	119	246
1045	119	290
1046	119	291
1047	119	305
1048	119	324
1049	119	333
1050	119	335
1051	119	424
\.


--
-- Data for Name: work_role_tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.work_role_tasks (id, work_role_id, task_id) FROM stdin;
1	101	516
2	101	524
3	101	525
4	101	527
5	101	543
6	101	544
7	101	545
8	101	548
9	101	579
10	85	589
11	85	590
12	85	591
13	85	592
14	85	594
15	85	596
16	85	597
17	85	623
18	85	624
19	85	625
20	85	652
21	85	677
22	85	678
23	85	739
24	85	747
25	85	857
26	85	867
27	86	540
28	86	594
29	86	602
30	86	671
31	86	721
32	86	745
33	86	746
34	86	863
35	86	892
36	86	893
37	86	914
38	86	915
39	86	950
40	86	951
41	86	952
42	86	953
43	86	954
44	86	992
45	86	1020
46	86	1032
47	86	1038
48	86	1048
49	86	1074
50	86	1098
51	86	1159
52	87	523
53	87	540
54	87	557
55	87	594
56	87	596
57	87	599
58	87	602
59	87	607
60	87	608
61	87	621
62	87	624
63	87	625
64	87	652
65	87	671
66	87	677
67	87	678
68	87	721
69	87	745
70	87	746
71	87	784
72	87	863
73	87	892
74	87	893
75	87	914
76	87	915
77	87	950
78	87	951
79	87	952
80	87	953
81	87	954
82	87	992
83	87	1002
84	87	1003
85	87	1005
86	87	1006
87	87	1015
88	87	1016
89	87	1017
90	87	1018
91	87	1020
92	87	1022
93	87	1023
94	87	1024
95	87	1025
96	87	1026
97	87	1027
98	87	1032
99	87	1034
100	87	1035
101	87	1038
102	87	1039
103	87	1048
104	87	1074
105	87	1098
106	87	1107
107	87	1108
108	87	1159
109	87	1177
110	88	557
111	88	594
112	88	599
113	88	607
114	88	608
115	88	619
116	88	868
117	88	891
118	88	892
119	88	893
120	88	894
121	88	967
122	88	968
123	88	969
124	88	970
125	88	971
126	88	972
127	88	973
128	88	994
129	88	1002
130	88	1003
131	88	1007
132	88	1018
133	88	1019
134	88	1031
135	88	1032
136	88	1162
137	88	1274
138	88	1275
139	88	1277
140	89	522
141	89	582
142	89	583
143	89	594
144	89	599
145	89	607
146	89	608
147	89	619
148	89	657
149	89	719
150	89	720
151	89	868
152	89	891
153	89	967
154	89	968
155	89	969
156	89	970
157	89	971
158	89	972
159	89	973
160	89	974
161	89	975
162	89	977
163	89	1002
164	89	1003
165	89	1018
166	89	1019
167	89	1041
168	89	1073
169	89	1092
170	89	1148
171	89	1149
172	89	1150
173	89	1163
174	89	1274
175	89	1275
176	89	1277
177	130	514
178	130	539
179	130	594
180	130	597
181	130	634
182	130	635
183	130	750
184	130	1067
185	130	1091
186	130	1101
187	130	1104
188	130	1153
189	91	514
190	91	594
191	91	607
192	91	608
193	91	619
194	91	620
195	91	621
196	91	622
197	91	624
198	91	625
199	91	652
200	91	709
201	91	710
202	91	778
203	91	783
204	91	784
205	91	791
206	91	795
207	91	864
208	91	865
209	91	867
210	91	892
211	91	893
212	91	899
213	91	911
214	91	912
215	91	913
216	91	933
217	91	934
218	91	1006
219	91	1032
220	91	1074
221	91	1098
222	91	1140
223	91	1234
224	91	1266
225	91	1310
226	92	577
227	92	588
228	92	594
229	92	619
230	92	623
231	92	624
232	92	625
233	92	648
234	92	656
235	92	660
236	92	682
237	92	683
238	92	709
239	92	710
240	92	750
241	92	781
242	92	782
243	92	836
244	92	891
245	92	892
246	92	893
247	92	1032
248	92	1045
249	92	1048
250	92	1104
251	92	1257
252	92	1258
253	92	1259
254	92	1260
255	92	1261
256	92	1262
257	92	1263
258	92	1264
259	92	1265
260	92	1266
261	92	1267
262	92	1268
263	92	1269
264	92	1270
265	92	1271
266	92	1272
267	92	1273
268	92	1274
269	92	1275
270	92	1276
271	92	1277
272	92	1278
273	92	1279
274	92	1280
275	92	1281
276	92	1282
277	92	1283
278	92	1284
279	92	1285
280	92	1286
281	92	1287
282	92	1288
283	92	1289
284	92	1290
285	92	1291
286	92	1292
287	92	1293
288	92	1294
289	92	1295
290	92	1296
291	92	1297
292	92	1298
293	92	1299
294	92	1300
295	92	1301
296	92	1302
297	92	1303
298	92	1304
299	92	1305
300	92	1306
301	92	1307
302	92	1309
303	92	1311
304	93	539
305	93	554
306	93	585
307	93	594
308	93	597
309	93	600
310	93	605
311	93	632
312	93	633
313	93	717
314	93	718
315	93	784
316	93	816
317	93	848
318	93	863
319	93	901
320	93	902
321	93	923
322	93	924
323	93	926
324	93	950
325	93	951
326	93	952
327	93	953
328	93	954
329	93	955
330	93	991
331	93	1004
332	93	1021
333	93	1028
334	93	1036
335	93	1037
336	93	1053
337	93	1155
338	93	1156
339	93	1158
340	93	1175
341	93	1176
342	94	539
343	94	554
344	94	585
345	94	594
346	94	596
347	94	597
348	94	600
349	94	605
350	94	709
351	94	710
352	94	717
353	94	718
354	94	784
355	94	816
356	94	848
357	94	863
358	94	901
359	94	902
360	94	923
361	94	924
362	94	926
363	94	950
364	94	951
365	94	952
366	94	953
367	94	954
368	94	955
369	94	991
370	94	1004
371	94	1028
372	94	1030
373	94	1053
374	94	1054
375	94	1107
376	94	1108
377	94	1155
378	94	1156
379	94	1175
380	94	1176
381	95	539
382	95	554
383	95	585
384	95	594
385	95	596
386	95	597
387	95	600
388	95	605
389	95	632
390	95	633
391	95	717
392	95	718
393	95	784
394	95	816
395	95	848
396	95	863
397	95	901
398	95	902
399	95	923
400	95	924
401	95	926
402	95	950
403	95	951
404	95	952
405	95	953
406	95	954
407	95	955
408	95	991
409	95	1004
410	95	1021
411	95	1028
412	95	1030
413	95	1036
414	95	1037
415	95	1053
416	95	1054
417	95	1107
418	95	1108
419	95	1155
420	95	1156
421	95	1175
422	95	1176
423	97	548
424	97	560
425	97	586
426	97	587
427	97	593
428	97	594
429	97	595
430	97	596
431	97	597
432	97	600
433	97	604
434	97	607
435	97	608
436	97	610
437	97	612
438	97	613
439	97	619
440	97	620
441	97	644
442	97	648
443	97	682
444	97	683
445	97	789
446	97	820
447	97	821
448	97	822
449	97	823
450	97	826
451	97	827
452	97	828
453	97	829
454	97	851
455	97	862
456	97	884
457	97	885
458	97	886
459	97	887
460	97	896
461	97	897
462	97	900
463	97	912
464	97	913
465	97	914
466	97	915
467	97	918
468	97	919
469	97	922
470	97	925
471	97	926
472	97	993
473	97	1045
474	97	1249
475	98	560
476	98	593
477	98	594
478	98	596
479	98	597
480	98	607
481	98	608
482	98	671
483	98	789
484	98	862
485	90	593
486	90	594
487	90	596
488	90	597
489	90	600
490	90	617
491	90	621
492	90	622
493	90	623
494	90	624
495	90	625
496	90	626
497	90	650
498	90	651
499	90	652
500	90	677
501	90	678
502	90	739
503	90	741
504	90	742
505	90	743
506	90	744
507	90	747
508	90	749
509	90	762
510	90	778
511	90	779
512	90	780
513	90	781
514	90	782
515	90	783
516	90	784
517	90	790
518	90	791
519	90	792
520	90	793
521	90	795
522	90	802
523	90	803
524	90	804
525	90	841
526	90	842
527	90	843
528	90	848
529	90	850
530	90	852
531	90	855
532	90	857
533	90	861
534	90	864
535	90	865
536	90	867
537	90	874
538	90	878
539	90	892
540	90	893
541	90	899
542	90	900
543	90	901
544	90	902
545	90	911
546	90	912
547	90	913
548	90	914
549	90	915
550	90	925
551	90	926
552	90	930
553	90	931
554	90	932
555	90	933
556	90	934
557	90	1032
558	90	1140
559	90	1155
560	90	1156
561	99	539
562	99	594
563	99	600
564	99	784
565	99	863
566	99	926
567	99	950
568	99	951
569	99	952
570	99	953
571	99	954
572	99	955
573	99	1028
574	99	1054
575	99	1175
576	99	1176
577	100	554
578	100	594
579	100	600
580	100	632
581	100	633
582	100	717
583	100	718
584	100	863
585	100	901
586	100	902
587	100	950
588	100	951
589	100	952
590	100	953
591	100	954
592	100	955
593	100	1036
594	100	1037
595	100	1054
596	120	538
597	120	594
598	120	654
599	120	658
600	120	659
601	120	701
602	120	748
603	120	752
604	120	753
605	120	757
606	120	759
607	120	760
608	120	761
609	120	768
610	120	798
611	120	799
612	120	881
613	120	882
614	120	995
615	120	1012
616	120	1013
617	120	1033
618	120	1061
619	120	1066
620	120	1082
621	120	1097
622	120	1106
623	120	1154
624	120	1183
625	120	1210
626	121	532
627	121	533
628	121	534
629	121	535
630	121	536
631	121	537
632	121	629
633	121	630
634	121	654
635	121	666
636	121	667
637	121	668
638	121	684
639	121	685
640	121	722
641	121	736
642	121	752
643	121	760
644	121	768
645	121	810
646	121	813
647	121	839
648	121	858
649	121	879
650	121	880
651	121	881
652	121	882
653	121	889
654	121	927
655	121	938
656	121	939
657	121	940
658	121	1042
659	121	1072
660	121	1097
661	121	1161
662	121	1416
663	121	1417
664	121	1418
665	121	1419
666	121	1420
667	121	1421
668	121	1422
669	121	1423
670	121	1424
671	121	1425
672	121	1426
673	121	1427
674	121	1428
675	121	1429
676	121	1430
677	121	1431
678	101	521
679	101	565
680	101	584
681	101	593
682	101	594
683	101	601
684	101	603
685	101	642
686	101	660
687	101	664
688	101	665
689	101	686
690	101	687
691	101	688
692	101	689
693	101	690
694	101	714
695	101	715
696	101	716
697	101	730
698	101	731
699	101	740
700	101	820
701	101	821
702	101	822
703	101	850
704	101	851
705	101	918
706	101	919
707	101	920
708	101	921
709	101	959
710	101	960
711	101	966
712	101	979
713	101	982
714	101	990
715	101	1063
716	101	1064
717	101	1075
718	101	1076
719	101	1077
720	101	1083
721	101	1099
722	101	1100
723	101	1111
724	101	1117
725	101	1137
726	101	1181
727	101	1182
728	102	521
729	102	565
730	102	584
731	102	593
732	102	594
733	102	601
734	102	642
735	102	660
736	102	664
737	102	665
738	102	686
739	102	687
740	102	688
741	102	689
742	102	690
743	102	740
744	102	851
745	102	920
746	102	921
747	102	959
748	102	960
749	102	966
750	102	979
751	102	982
752	102	985
753	102	990
754	102	1063
755	102	1064
756	102	1075
757	102	1076
758	102	1077
759	102	1083
760	102	1099
761	102	1100
762	102	1117
763	102	1137
764	102	1145
765	102	1151
766	102	1152
767	102	1160
768	102	1180
769	103	518
770	103	549
771	103	593
772	103	594
773	103	632
774	103	633
775	103	636
776	103	638
777	103	639
778	103	646
779	103	647
780	103	653
781	103	662
782	103	663
783	103	672
784	103	680
785	103	681
786	103	699
787	103	751
788	103	758
789	103	763
790	103	764
791	103	765
792	103	766
793	103	815
794	103	818
795	103	819
796	103	826
797	103	837
798	103	838
799	103	859
800	103	866
801	103	875
802	103	876
803	103	877
804	103	917
805	103	956
806	103	978
807	103	1055
808	103	1065
809	103	1069
810	103	1084
811	103	1085
812	103	1129
813	103	1130
814	103	1131
815	103	1178
816	103	1179
817	126	521
818	126	524
819	126	525
820	126	544
821	126	584
822	126	593
823	126	594
824	126	596
825	126	600
826	126	601
827	126	604
828	126	610
829	126	612
830	126	613
831	126	637
832	126	640
833	126	643
834	126	644
835	126	645
836	126	648
837	126	660
838	126	682
839	126	683
840	126	686
841	126	687
842	126	688
843	126	692
844	126	693
845	126	695
846	126	696
847	126	697
848	126	698
849	126	702
850	126	711
851	126	712
852	126	713
853	126	723
854	126	724
855	126	725
856	126	726
857	126	727
858	126	754
859	126	755
860	126	756
861	126	767
862	126	826
863	126	849
864	126	851
865	126	866
866	126	869
867	126	883
868	126	920
869	126	921
870	126	922
871	126	957
872	126	1010
873	126	1011
874	126	1045
875	126	1063
876	126	1064
877	126	1075
878	126	1076
879	126	1078
880	126	1117
881	126	1137
882	126	1138
883	126	1139
884	126	1140
885	126	1146
886	126	1147
887	126	1158
888	126	1167
889	126	1168
890	104	549
891	104	593
892	104	594
893	104	617
894	104	638
895	104	639
896	104	646
897	104	647
898	104	670
899	104	672
900	104	751
901	104	758
902	104	763
903	104	764
904	104	765
905	104	766
906	104	779
907	104	780
908	104	815
909	104	826
910	104	859
911	104	866
912	104	875
913	104	876
914	104	877
915	104	911
916	104	916
917	104	956
918	104	978
919	104	1065
920	104	1069
921	104	1084
922	104	1085
923	104	1144
924	104	1178
925	104	1179
926	104	1195
927	104	1317
928	105	541
929	105	593
930	105	594
931	105	596
932	105	597
933	105	600
934	105	605
935	105	661
936	105	671
937	105	679
938	105	691
939	105	703
940	105	775
941	105	800
942	105	801
943	105	816
944	105	840
945	105	923
946	105	924
947	105	948
948	105	949
949	105	964
950	105	965
951	105	979
952	105	986
953	105	987
954	105	1083
955	105	1090
956	105	1127
957	127	519
958	127	545
959	127	562
960	127	563
961	127	594
962	127	614
963	127	700
964	127	702
965	127	769
966	127	770
967	127	771
968	127	773
969	127	774
970	127	812
971	127	903
972	127	1040
973	127	1062
974	127	1141
975	127	1164
976	127	1165
977	127	1166
978	127	1249
979	106	593
980	106	594
981	106	597
982	106	610
983	106	644
984	106	648
985	106	682
986	106	683
987	106	706
988	106	894
989	106	895
990	106	935
991	106	936
992	106	937
993	106	980
994	106	981
995	106	1045
996	106	1047
997	106	1049
998	106	1050
999	106	1051
1000	106	1052
1001	106	1164
1002	107	516
1003	107	634
1004	107	635
1005	107	688
1006	107	726
1007	107	727
1008	107	746
1009	107	748
1010	107	800
1011	107	801
1012	107	895
1013	107	902
1014	107	1083
1015	107	1173
1016	107	1432
1017	107	1433
1018	107	1434
1019	107	1435
1020	107	1436
1021	107	1437
1022	107	1438
1023	107	1439
1024	107	1440
1025	107	1441
1026	107	1442
1027	107	1443
1028	107	1444
1029	107	1445
1030	107	1446
1031	107	1447
1032	107	1448
1033	107	1449
1034	107	1450
1035	107	1451
1036	107	1452
1037	107	1453
1038	107	1454
1039	107	1455
1040	108	517
1041	108	551
1042	108	552
1043	108	559
1044	108	594
1045	108	628
1046	108	629
1047	108	630
1048	108	631
1049	108	854
1050	108	956
1051	108	996
1052	108	1001
1053	108	1014
1054	108	1047
1055	109	528
1056	109	550
1057	109	555
1058	109	558
1059	109	594
1060	109	630
1061	109	631
1062	109	787
1063	109	788
1064	109	806
1065	109	854
1066	109	958
1067	109	1118
1068	109	1119
1069	110	594
1070	110	669
1071	110	779
1072	110	780
1073	110	796
1074	110	797
1075	110	830
1076	110	831
1077	110	853
1078	110	911
1079	110	1060
1080	110	1079
1081	110	1080
1082	110	1081
1083	110	1195
1084	110	1317
1085	111	520
1086	111	526
1087	111	527
1088	111	530
1089	111	594
1090	111	615
1091	111	664
1092	111	665
1093	111	707
1094	111	708
1095	111	769
1096	111	770
1097	111	771
1098	111	773
1099	111	774
1100	111	805
1101	111	870
1102	111	871
1103	112	556
1104	112	564
1105	112	594
1106	112	656
1107	112	694
1108	112	704
1109	112	705
1110	112	785
1111	112	832
1112	112	833
1113	112	834
1114	112	891
1115	112	1056
1116	112	1057
1117	112	1058
1118	112	1068
1119	112	1083
1120	112	1086
1121	112	1087
1122	112	1123
1123	112	1124
1124	112	1125
1125	112	1132
1126	112	1133
1127	112	1142
1128	112	1143
1129	113	548
1130	113	594
1131	113	597
1132	113	640
1133	113	641
1134	113	642
1135	113	733
1136	113	734
1137	113	735
1138	113	737
1139	113	738
1140	113	772
1141	113	776
1142	113	777
1143	113	812
1144	113	820
1145	113	821
1146	113	822
1147	113	835
1148	113	844
1149	113	851
1150	113	884
1151	113	993
1152	113	1078
1153	113	1088
1154	113	1089
1155	113	1094
1156	113	1095
1157	113	1096
1158	113	1103
1159	113	1105
1160	113	1112
1161	113	1113
1162	113	1114
1163	113	1117
1164	113	1122
1165	113	1128
1166	113	1137
1167	113	1138
1168	113	1139
1169	113	1157
1170	113	1169
1171	113	1170
1172	113	1172
1173	128	542
1174	128	594
1175	128	598
1176	128	773
1177	128	774
1178	128	891
1179	128	961
1180	128	967
1181	128	968
1182	128	983
1183	128	985
1184	128	1093
1185	128	1109
1186	128	1120
1187	128	1121
1188	128	1123
1189	128	1124
1190	128	1125
1191	128	1126
1192	128	1134
1193	128	1135
1194	128	1160
1195	128	1180
1196	114	515
1197	114	531
1198	114	546
1199	114	547
1200	114	594
1201	114	595
1202	114	648
1203	114	649
1204	114	676
1205	114	683
1206	114	737
1207	114	738
1208	114	798
1209	114	799
1210	114	811
1211	114	823
1212	114	835
1213	114	847
1214	114	856
1215	114	904
1216	114	905
1217	114	906
1218	114	907
1219	114	908
1220	114	941
1221	114	942
1222	114	943
1223	114	944
1224	114	945
1225	114	946
1226	114	947
1227	114	962
1228	114	984
1229	114	1094
1230	114	1095
1231	114	1096
1232	114	1103
1233	114	1136
1234	114	1137
1235	114	1157
1236	114	1169
1237	114	1170
1238	114	1172
1239	115	532
1240	115	533
1241	115	534
1242	115	535
1243	115	536
1244	115	537
1245	115	553
1246	115	594
1247	115	616
1248	115	648
1249	115	654
1250	115	666
1251	115	667
1252	115	668
1253	115	682
1254	115	683
1255	115	684
1256	115	685
1257	115	722
1258	115	736
1259	115	752
1260	115	760
1261	115	810
1262	115	817
1263	115	839
1264	115	858
1265	115	879
1266	115	880
1267	115	881
1268	115	882
1269	115	927
1270	115	928
1271	115	929
1272	115	938
1273	115	939
1274	115	940
1275	115	943
1276	115	963
1277	115	1042
1278	115	1043
1279	115	1044
1280	115	1045
1281	115	1046
1282	115	1066
1283	115	1161
1284	115	1171
1285	116	531
1286	116	543
1287	116	561
1288	116	594
1289	116	648
1290	116	649
1291	116	673
1292	116	674
1293	116	682
1294	116	683
1295	116	807
1296	116	808
1297	116	809
1298	116	813
1299	116	814
1300	116	817
1301	116	856
1302	116	872
1303	116	873
1304	116	889
1305	116	890
1306	116	927
1307	116	928
1308	116	929
1309	116	963
1310	116	1041
1311	116	1045
1312	116	1136
1313	116	1171
1314	117	594
1315	117	675
1316	117	824
1317	117	825
1318	117	909
1319	117	910
1320	117	988
1321	117	989
1322	117	998
1323	117	1059
1324	117	1071
1325	117	1110
1326	117	1115
1327	117	1116
1328	129	621
1329	129	622
1330	129	627
1331	129	648
1332	129	649
1333	129	723
1334	129	725
1335	129	784
1336	129	823
1337	129	881
1338	129	882
1339	129	995
1340	129	1066
1341	129	1146
1342	129	1205
1343	129	1210
1344	129	1218
1345	129	1220
1346	129	1244
1347	129	1245
1348	129	1373
1349	129	1374
1350	129	1375
1351	129	1377
1352	129	1378
1353	129	1379
1354	129	1380
1355	129	1381
1356	129	1382
1357	129	1383
1358	129	1384
1359	129	1385
1360	129	1386
1361	129	1387
1362	129	1389
1363	129	1390
1364	129	1391
1365	129	1392
1366	129	1393
1367	129	1394
1368	129	1395
1369	129	1396
1370	129	1397
1371	129	1398
1372	129	1399
1373	129	1400
1374	129	1401
1375	129	1402
1376	129	1403
1377	129	1405
1378	129	1407
1379	129	1408
1380	129	1409
1381	129	1410
1382	129	1411
1383	129	1413
1384	129	1414
1385	129	1415
1386	118	566
1387	118	567
1388	118	569
1389	118	570
1390	118	571
1391	118	573
1392	118	576
1393	118	594
1394	118	606
1395	118	618
1396	118	619
1397	118	620
1398	118	1184
1399	118	1185
1400	118	1186
1401	118	1187
1402	118	1188
1403	118	1189
1404	118	1190
1405	118	1193
1406	118	1194
1407	118	1203
1408	118	1223
1409	118	1224
1410	118	1225
1411	118	1226
1412	118	1227
1413	118	1228
1414	118	1229
1415	118	1230
1416	118	1231
1417	118	1232
1418	118	1241
1419	118	1242
1420	118	1243
1421	118	1244
1422	118	1247
1423	118	1252
1424	119	594
1425	119	610
1426	119	634
1427	119	635
1428	119	644
1429	119	648
1430	119	655
1431	119	682
1432	119	683
1433	119	786
1434	119	836
1435	119	898
1436	119	1045
1437	119	1173
1438	119	1174
\.


--
-- Data for Name: work_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.work_roles (id, code, name, description, specialty_area_id, category_id, created_at) FROM stdin;
86	OG-WRL-002	Cybersecurity Policy and Planning	Responsible for developing and maintaining cybersecurity plans, strategy, and policy to support and align with organizational cybersecurity initiatives and regulatory compliance.	\N	29	2025-05-26 20:54:11.863324
87	OG-WRL-003	Cybersecurity Workforce Management	Responsible for developing cybersecurity workforce plans, assessments, strategies, and guidance, including cybersecurity-related staff training, education, and hiring processes. Makes adjustments in response to or in anticipation of changes to cybersecurity-related policy, technology, and staffing needs and requirements. Authors mandated workforce planning strategies to maintain compliance with legislation, regulation, and policy.	\N	29	2025-05-26 20:54:11.863324
88	OG-WRL-004	Cybersecurity Curriculum Development	Responsible for developing, planning, coordinating, and evaluating cybersecurity awareness, training, or education content, methods, and techniques based on instructional needs and requirements.	\N	29	2025-05-26 20:54:11.863324
89	OG-WRL-005	Cybersecurity Instruction	Responsible for developing and conducting cybersecurity awareness, training, or education.	\N	29	2025-05-26 20:54:11.863324
91	OG-WRL-007	Executive Cybersecurity Leadership	Responsible for establishing vision and direction for an organization's cybersecurity operations and resources and their impact on digital and physical spaces. Possesses authority to make and execute decisions that impact an organization broadly, including policy approval and stakeholder engagement.	\N	29	2025-05-26 20:54:11.863324
92	OG-WRL-008	Privacy Compliance	Responsible for developing and overseeing an organization's privacy compliance program and staff, including establishing and managing privacy-related governance, policy, and incident response needs.	\N	29	2025-05-26 20:54:11.863324
93	OG-WRL-009	Product Support Management	Responsible for planning, estimating costs, budgeting, developing, implementing, and managing product support strategies in order to field and maintain the readiness and operational capability of systems and components.	\N	29	2025-05-26 20:54:11.863324
94	OG-WRL-010	Program Management	Responsible for leading, coordinating, and the overall success of a defined program. Includes communicating about the program and ensuring alignment with agency or organizational priorities.	\N	29	2025-05-26 20:54:11.863324
95	OG-WRL-011	Secure Project Management	Responsible for overseeing and directly managing technology projects. Ensures cybersecurity is built into projects to protect the organization's critical infrastructure and assets, reduce risk, and meet organizational goals. Tracks and communicates project status and demonstrates project value to the organization.	\N	29	2025-05-26 20:54:11.863324
97	OG-WRL-012	Security Control Assessment	Responsible for conducting independent comprehensive assessments of management, operational, and technical security controls and control enhancements employed within or inherited by a system to determine their overall effectiveness.	\N	29	2025-05-26 20:54:11.863324
98	OG-WRL-013	Systems Authorization	Responsible for operating an information system at an acceptable level of risk to organizational operations, organizational assets, individuals, other organizations, and the nation.	\N	29	2025-05-26 20:54:11.863324
90	OG-WRL-014	Systems Security Management	Responsible for managing the cybersecurity of a program, organization, system, or enclave.	\N	29	2025-05-26 20:54:11.863324
85	OG-WRL-001	Communications Security Management	Responsible for managing the Communications Security (COMSEC) resources of an organization.	\N	29	2025-05-26 20:54:11.863324
99	OG-WRL-015	Technology Portfolio Management	Responsible for managing a portfolio of technology investments that align with the overall needs of mission and enterprise priorities.	\N	29	2025-05-26 20:54:11.863324
100	OG-WRL-016	Technology Program Auditing	Responsible for conducting evaluations of technology programs or their individual components to determine compliance with published standards.	\N	29	2025-05-26 20:54:11.863324
101	DD-WRL-001	Cybersecurity Architecture	Responsible for ensuring that security requirements are adequately addressed in all aspects of enterprise architecture, including reference models, segment and solution architectures, and the resulting systems that protect and support organizational mission and business processes.	\N	31	2025-05-26 20:54:11.863324
102	DD-WRL-002	Enterprise Architecture	Responsible for developing and maintaining business, systems, and information processes to support enterprise mission needs. Develops technology rules and requirements that describe baseline and target architectures.	\N	31	2025-05-26 20:54:11.863324
103	DD-WRL-003	Secure Software Development	Responsible for developing, creating, modifying, and maintaining computer applications, software, or specialized utility programs.	\N	31	2025-05-26 20:54:11.863324
104	DD-WRL-005	Software Security Assessment	Responsible for analyzing the security of new or existing computer applications, software, or specialized utility programs and delivering actionable results.	\N	31	2025-05-26 20:54:11.863324
105	DD-WRL-006	Systems Requirements Planning	Responsible for consulting with internal and external customers to evaluate and translate functional requirements and integrating security policies into technical solutions.	\N	31	2025-05-26 20:54:11.863324
106	DD-WRL-008	Technology Research and Development	Responsible for conducting software and systems engineering and software systems research to develop new capabilities with fully integrated cybersecurity. Conducts comprehensive technology research to evaluate potential vulnerabilities in cyberspace systems.	\N	31	2025-05-26 20:54:11.863324
107	DD-WRL-009	Operational Technology (OT) Cybersecurity Engineering	Responsible for working within the engineering department to design and create systems, processes, and procedures that maintain the safety, reliability, controllability, and security of industrial systems in the face of intentional and incidental cyber-related events. Interfaces with Chief Information Security Officer, plant managers, and industrial cybersecurity technicians.	\N	31	2025-05-26 20:54:11.863324
126	DD-WRL-004	Secure Systems Development	Responsible for the secure design, development, and testing of systems and the evaluation of system security throughout the systems development life cycle.	\N	31	2025-05-27 05:18:51.905745
127	DD-WRL-007	Systems Testing and Evaluation	Responsible for planning, preparing, and executing system tests; evaluating test results against specifications and requirements; and reporting test results and findings.	\N	31	2025-05-27 05:18:51.905745
120	IN-WRL-001	Cybercrime Investigation	Responsible for investigating cyberspace intrusion incidents and crimes. Applies tactics, techniques, and procedures for a full range of investigative tools and processes and appropriately balances the benefits of prosecution versus intelligence gathering.	\N	30	2025-05-26 20:54:11.863324
121	IN-WRL-002	Digital Evidence Analysis	Responsible for identifying, collecting, examining, and preserving digital evidence using controlled and documented analytical and investigative techniques.	\N	30	2025-05-26 20:54:11.863324
108	IO-WRL-001	Data Analysis	Responsible for analyzing data from multiple disparate sources to provide cybersecurity and privacy insight. Designs and implements custom algorithms, workflow processes, and layouts for complex, enterprise-scale data sets used for modeling, data mining, and research purposes.	\N	32	2025-05-26 20:54:11.863324
109	IO-WRL-002	Database Administration	Responsible for administering databases and data management systems that allow for the secure storage, query, protection, and utilization of data.	\N	32	2025-05-26 20:54:11.863324
110	IO-WRL-003	Knowledge Management	Responsible for managing and administering processes and tools to identify, document, and access an organization's intellectual capital.	\N	32	2025-05-26 20:54:11.863324
111	IO-WRL-004	Network Operations	Responsible for planning, implementing, and operating network services and systems, including hardware and virtual environments.	\N	32	2025-05-26 20:54:11.863324
112	IO-WRL-005	Systems Administration	Responsible for setting up and maintaining a system or specific components of a system in adherence with organizational security policies and procedures. Includes hardware and software installation, configuration, and updates; user account management; backup and recovery management; and security control implementation.	\N	32	2025-05-26 20:54:11.863324
113	IO-WRL-006	Systems Security Analysis	Responsible for developing and analyzing the integration, testing, operations, and maintenance of systems security. Prepares, performs, and manages the security aspects of implementing and operating a system.	\N	32	2025-05-26 20:54:11.863324
128	IO-WRL-007	Technical Support	Responsible for providing technical support to customers who need assistance utilizing client-level hardware and software in accordance with established or approved organizational policies and processes.	\N	32	2025-05-27 05:21:29.353131
114	PD-WRL-001	Defensive Cybersecurity	Responsible for analyzing data collected from various cybersecurity defense tools to mitigate risks.	\N	33	2025-05-26 20:54:11.863324
115	PD-WRL-002	Digital Forensics	Responsible for analyzing digital evidence from computer security incidents to derive useful information in support of system and network vulnerability mitigation.	\N	33	2025-05-26 20:54:11.863324
116	PD-WRL-003	Incident Response	Responsible for investigating, analyzing, and responding to network cybersecurity incidents.	\N	33	2025-05-26 20:54:11.863324
117	PD-WRL-004	Infrastructure Support	Responsible for testing, implementing, deploying, maintaining, and administering infrastructure hardware and software for cybersecurity.	\N	33	2025-05-26 20:54:11.863324
118	PD-WRL-006	Threat Analysis	Responsible for collecting, processing, analyzing, and disseminating cybersecurity threat assessments. Develops cybersecurity indicators to maintain awareness of the status of the highly dynamic operating environment.	\N	33	2025-05-26 20:54:11.863324
119	PD-WRL-007	Vulnerability Analysis	Responsible for assessing systems and networks to identify deviations from acceptable configurations, enclave policy, or local policy. Measure effectiveness of defense-in-depth architecture against known vulnerabilities.	\N	33	2025-05-26 20:54:11.863324
129	PD-WRL-005	Insider Threat Analysis	Responsible for identifying and assessing the capabilities and activities of cybersecurity insider threats; produces findings to help initialize and support law enforcement and counterintelligence activities and investigations.	\N	33	2025-05-27 05:24:15.208704
130	OG-WRL-006	Cybersecurity Legal Advice	Responsible for providing cybersecurity legal advice and recommendations, including monitoring related legislation and regulations.	\N	29	2025-05-27 05:48:09.319397
\.


--
-- Name: career_level_certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_level_certifications_id_seq', 462, true);


--
-- Name: career_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_levels_id_seq', 174, true);


--
-- Name: career_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_positions_id_seq', 104, true);


--
-- Name: career_track_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_track_categories_id_seq', 59, true);


--
-- Name: career_tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_tracks_id_seq', 48, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 33, true);


--
-- Name: certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.certifications_id_seq', 195, true);


--
-- Name: import_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.import_history_id_seq', 6, true);


--
-- Name: knowledge_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.knowledge_items_id_seq', 1862, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skills_id_seq', 555, true);


--
-- Name: specialty_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.specialty_areas_id_seq', 43, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tasks_id_seq', 1455, true);


--
-- Name: work_role_certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.work_role_certifications_id_seq', 1, false);


--
-- Name: work_role_knowledge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.work_role_knowledge_id_seq', 2856, true);


--
-- Name: work_role_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.work_role_skills_id_seq', 1051, true);


--
-- Name: work_role_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.work_role_tasks_id_seq', 1438, true);


--
-- Name: work_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.work_roles_id_seq', 130, true);


--
-- Name: career_level_certifications career_level_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_level_certifications
    ADD CONSTRAINT career_level_certifications_pkey PRIMARY KEY (id);


--
-- Name: career_levels career_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_levels
    ADD CONSTRAINT career_levels_pkey PRIMARY KEY (id);


--
-- Name: career_positions career_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_positions
    ADD CONSTRAINT career_positions_pkey PRIMARY KEY (id);


--
-- Name: career_track_categories career_track_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_track_categories
    ADD CONSTRAINT career_track_categories_pkey PRIMARY KEY (id);


--
-- Name: career_tracks career_tracks_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_tracks
    ADD CONSTRAINT career_tracks_name_unique UNIQUE (name);


--
-- Name: career_tracks career_tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_tracks
    ADD CONSTRAINT career_tracks_pkey PRIMARY KEY (id);


--
-- Name: categories categories_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_code_unique UNIQUE (code);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_code_unique UNIQUE (code);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: import_history import_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_history
    ADD CONSTRAINT import_history_pkey PRIMARY KEY (id);


--
-- Name: knowledge_items knowledge_items_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_items
    ADD CONSTRAINT knowledge_items_code_unique UNIQUE (code);


--
-- Name: knowledge_items knowledge_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_items
    ADD CONSTRAINT knowledge_items_pkey PRIMARY KEY (id);


--
-- Name: skills skills_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_code_unique UNIQUE (code);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: specialty_areas specialty_areas_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_areas
    ADD CONSTRAINT specialty_areas_code_unique UNIQUE (code);


--
-- Name: specialty_areas specialty_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_areas
    ADD CONSTRAINT specialty_areas_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_code_unique UNIQUE (code);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: work_role_certifications work_role_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_certifications
    ADD CONSTRAINT work_role_certifications_pkey PRIMARY KEY (id);


--
-- Name: work_role_knowledge work_role_knowledge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_knowledge
    ADD CONSTRAINT work_role_knowledge_pkey PRIMARY KEY (id);


--
-- Name: work_role_skills work_role_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_skills
    ADD CONSTRAINT work_role_skills_pkey PRIMARY KEY (id);


--
-- Name: work_role_tasks work_role_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_tasks
    ADD CONSTRAINT work_role_tasks_pkey PRIMARY KEY (id);


--
-- Name: work_roles work_roles_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_code_unique UNIQUE (code);


--
-- Name: work_roles work_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_pkey PRIMARY KEY (id);


--
-- Name: career_level_certifications career_level_certifications_career_level_id_career_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_level_certifications
    ADD CONSTRAINT career_level_certifications_career_level_id_career_levels_id_fk FOREIGN KEY (career_level_id) REFERENCES public.career_levels(id);


--
-- Name: career_level_certifications career_level_certifications_certification_id_certifications_id_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_level_certifications
    ADD CONSTRAINT career_level_certifications_certification_id_certifications_id_ FOREIGN KEY (certification_id) REFERENCES public.certifications(id);


--
-- Name: career_levels career_levels_career_track_id_career_tracks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_levels
    ADD CONSTRAINT career_levels_career_track_id_career_tracks_id_fk FOREIGN KEY (career_track_id) REFERENCES public.career_tracks(id);


--
-- Name: career_positions career_positions_career_level_id_career_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_positions
    ADD CONSTRAINT career_positions_career_level_id_career_levels_id_fk FOREIGN KEY (career_level_id) REFERENCES public.career_levels(id);


--
-- Name: career_positions career_positions_nice_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_positions
    ADD CONSTRAINT career_positions_nice_work_role_id_work_roles_id_fk FOREIGN KEY (nice_work_role_id) REFERENCES public.work_roles(id);


--
-- Name: career_track_categories career_track_categories_career_track_id_career_tracks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_track_categories
    ADD CONSTRAINT career_track_categories_career_track_id_career_tracks_id_fk FOREIGN KEY (career_track_id) REFERENCES public.career_tracks(id);


--
-- Name: career_track_categories career_track_categories_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_track_categories
    ADD CONSTRAINT career_track_categories_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: specialty_areas specialty_areas_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_areas
    ADD CONSTRAINT specialty_areas_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: work_role_certifications work_role_certifications_certification_id_certifications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_certifications
    ADD CONSTRAINT work_role_certifications_certification_id_certifications_id_fk FOREIGN KEY (certification_id) REFERENCES public.certifications(id);


--
-- Name: work_role_certifications work_role_certifications_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_certifications
    ADD CONSTRAINT work_role_certifications_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: work_role_knowledge work_role_knowledge_knowledge_item_id_knowledge_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_knowledge
    ADD CONSTRAINT work_role_knowledge_knowledge_item_id_knowledge_items_id_fk FOREIGN KEY (knowledge_item_id) REFERENCES public.knowledge_items(id);


--
-- Name: work_role_knowledge work_role_knowledge_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_knowledge
    ADD CONSTRAINT work_role_knowledge_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: work_role_skills work_role_skills_skill_id_skills_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_skills
    ADD CONSTRAINT work_role_skills_skill_id_skills_id_fk FOREIGN KEY (skill_id) REFERENCES public.skills(id);


--
-- Name: work_role_skills work_role_skills_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_skills
    ADD CONSTRAINT work_role_skills_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: work_role_tasks work_role_tasks_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_tasks
    ADD CONSTRAINT work_role_tasks_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: work_role_tasks work_role_tasks_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_role_tasks
    ADD CONSTRAINT work_role_tasks_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: work_roles work_roles_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: work_roles work_roles_specialty_area_id_specialty_areas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_specialty_area_id_specialty_areas_id_fk FOREIGN KEY (specialty_area_id) REFERENCES public.specialty_areas(id);


--
-- PostgreSQL database dump complete
--

