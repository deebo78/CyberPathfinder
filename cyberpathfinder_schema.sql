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

DROP DATABASE IF EXISTS neondb;
--
-- Name: neondb; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';


ALTER DATABASE neondb OWNER TO neondb_owner;

\connect neondb

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: career_level_certifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.career_level_certifications (
    id integer NOT NULL,
    career_level_id integer NOT NULL,
    certification_id integer NOT NULL,
    priority integer DEFAULT 1,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.career_level_certifications OWNER TO neondb_owner;

--
-- Name: career_level_certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_level_certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_level_certifications_id_seq OWNER TO neondb_owner;

--
-- Name: career_level_certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_level_certifications_id_seq OWNED BY public.career_level_certifications.id;


--
-- Name: career_level_knowledge; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.career_level_knowledge (
    id integer NOT NULL,
    career_level_id integer NOT NULL,
    knowledge_item_id integer NOT NULL,
    importance text DEFAULT 'required'::text,
    source text DEFAULT 'inherited'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.career_level_knowledge OWNER TO neondb_owner;

--
-- Name: career_level_knowledge_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_level_knowledge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_level_knowledge_id_seq OWNER TO neondb_owner;

--
-- Name: career_level_knowledge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_level_knowledge_id_seq OWNED BY public.career_level_knowledge.id;


--
-- Name: career_level_skills; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.career_level_skills (
    id integer NOT NULL,
    career_level_id integer NOT NULL,
    skill_id integer NOT NULL,
    importance text DEFAULT 'required'::text,
    source text DEFAULT 'inherited'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.career_level_skills OWNER TO neondb_owner;

--
-- Name: career_level_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_level_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_level_skills_id_seq OWNER TO neondb_owner;

--
-- Name: career_level_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_level_skills_id_seq OWNED BY public.career_level_skills.id;


--
-- Name: career_level_tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.career_level_tasks (
    id integer NOT NULL,
    career_level_id integer NOT NULL,
    task_id integer NOT NULL,
    importance text DEFAULT 'required'::text,
    source text DEFAULT 'inherited'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.career_level_tasks OWNER TO neondb_owner;

--
-- Name: career_level_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_level_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_level_tasks_id_seq OWNER TO neondb_owner;

--
-- Name: career_level_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_level_tasks_id_seq OWNED BY public.career_level_tasks.id;


--
-- Name: career_level_work_roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.career_level_work_roles (
    id integer NOT NULL,
    career_level_id integer NOT NULL,
    work_role_id integer NOT NULL,
    priority integer DEFAULT 1,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.career_level_work_roles OWNER TO neondb_owner;

--
-- Name: career_level_work_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_level_work_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_level_work_roles_id_seq OWNER TO neondb_owner;

--
-- Name: career_level_work_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_level_work_roles_id_seq OWNED BY public.career_level_work_roles.id;


--
-- Name: career_levels; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.career_levels OWNER TO neondb_owner;

--
-- Name: career_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_levels_id_seq OWNER TO neondb_owner;

--
-- Name: career_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_levels_id_seq OWNED BY public.career_levels.id;


--
-- Name: career_positions; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.career_positions OWNER TO neondb_owner;

--
-- Name: career_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_positions_id_seq OWNER TO neondb_owner;

--
-- Name: career_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_positions_id_seq OWNED BY public.career_positions.id;


--
-- Name: career_track_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.career_track_categories (
    id integer NOT NULL,
    career_track_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.career_track_categories OWNER TO neondb_owner;

--
-- Name: career_track_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_track_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_track_categories_id_seq OWNER TO neondb_owner;

--
-- Name: career_track_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_track_categories_id_seq OWNED BY public.career_track_categories.id;


--
-- Name: career_tracks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.career_tracks (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    overview text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.career_tracks OWNER TO neondb_owner;

--
-- Name: career_tracks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.career_tracks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_tracks_id_seq OWNER TO neondb_owner;

--
-- Name: career_tracks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.career_tracks_id_seq OWNED BY public.career_tracks.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO neondb_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO neondb_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.certifications OWNER TO neondb_owner;

--
-- Name: certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certifications_id_seq OWNER TO neondb_owner;

--
-- Name: certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.certifications_id_seq OWNED BY public.certifications.id;


--
-- Name: import_history; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.import_history OWNER TO neondb_owner;

--
-- Name: import_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.import_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.import_history_id_seq OWNER TO neondb_owner;

--
-- Name: import_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.import_history_id_seq OWNED BY public.import_history.id;


--
-- Name: knowledge_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.knowledge_items (
    id integer NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.knowledge_items OWNER TO neondb_owner;

--
-- Name: knowledge_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.knowledge_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knowledge_items_id_seq OWNER TO neondb_owner;

--
-- Name: knowledge_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.knowledge_items_id_seq OWNED BY public.knowledge_items.id;


--
-- Name: resume_analyses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resume_analyses (
    id integer NOT NULL,
    filename text NOT NULL,
    original_text text NOT NULL,
    extracted_data jsonb NOT NULL,
    career_recommendations jsonb NOT NULL,
    analysis_metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.resume_analyses OWNER TO neondb_owner;

--
-- Name: resume_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.resume_analyses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resume_analyses_id_seq OWNER TO neondb_owner;

--
-- Name: resume_analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.resume_analyses_id_seq OWNED BY public.resume_analyses.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.skills OWNER TO neondb_owner;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO neondb_owner;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: specialty_areas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.specialty_areas (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    category_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.specialty_areas OWNER TO neondb_owner;

--
-- Name: specialty_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.specialty_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.specialty_areas_id_seq OWNER TO neondb_owner;

--
-- Name: specialty_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.specialty_areas_id_seq OWNED BY public.specialty_areas.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tasks OWNER TO neondb_owner;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO neondb_owner;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: work_role_certifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.work_role_certifications (
    id integer NOT NULL,
    work_role_id integer NOT NULL,
    certification_id integer NOT NULL,
    required boolean DEFAULT false
);


ALTER TABLE public.work_role_certifications OWNER TO neondb_owner;

--
-- Name: work_role_certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.work_role_certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_role_certifications_id_seq OWNER TO neondb_owner;

--
-- Name: work_role_certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.work_role_certifications_id_seq OWNED BY public.work_role_certifications.id;


--
-- Name: work_role_knowledge; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.work_role_knowledge (
    id integer NOT NULL,
    work_role_id integer NOT NULL,
    knowledge_item_id integer NOT NULL
);


ALTER TABLE public.work_role_knowledge OWNER TO neondb_owner;

--
-- Name: work_role_knowledge_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.work_role_knowledge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_role_knowledge_id_seq OWNER TO neondb_owner;

--
-- Name: work_role_knowledge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.work_role_knowledge_id_seq OWNED BY public.work_role_knowledge.id;


--
-- Name: work_role_skills; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.work_role_skills (
    id integer NOT NULL,
    work_role_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.work_role_skills OWNER TO neondb_owner;

--
-- Name: work_role_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.work_role_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_role_skills_id_seq OWNER TO neondb_owner;

--
-- Name: work_role_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.work_role_skills_id_seq OWNED BY public.work_role_skills.id;


--
-- Name: work_role_tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.work_role_tasks (
    id integer NOT NULL,
    work_role_id integer NOT NULL,
    task_id integer NOT NULL
);


ALTER TABLE public.work_role_tasks OWNER TO neondb_owner;

--
-- Name: work_role_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.work_role_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_role_tasks_id_seq OWNER TO neondb_owner;

--
-- Name: work_role_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.work_role_tasks_id_seq OWNED BY public.work_role_tasks.id;


--
-- Name: work_roles; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.work_roles OWNER TO neondb_owner;

--
-- Name: work_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.work_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_roles_id_seq OWNER TO neondb_owner;

--
-- Name: work_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.work_roles_id_seq OWNED BY public.work_roles.id;


--
-- Name: career_level_certifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_certifications ALTER COLUMN id SET DEFAULT nextval('public.career_level_certifications_id_seq'::regclass);


--
-- Name: career_level_knowledge id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_knowledge ALTER COLUMN id SET DEFAULT nextval('public.career_level_knowledge_id_seq'::regclass);


--
-- Name: career_level_skills id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_skills ALTER COLUMN id SET DEFAULT nextval('public.career_level_skills_id_seq'::regclass);


--
-- Name: career_level_tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_tasks ALTER COLUMN id SET DEFAULT nextval('public.career_level_tasks_id_seq'::regclass);


--
-- Name: career_level_work_roles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_work_roles ALTER COLUMN id SET DEFAULT nextval('public.career_level_work_roles_id_seq'::regclass);


--
-- Name: career_levels id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_levels ALTER COLUMN id SET DEFAULT nextval('public.career_levels_id_seq'::regclass);


--
-- Name: career_positions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_positions ALTER COLUMN id SET DEFAULT nextval('public.career_positions_id_seq'::regclass);


--
-- Name: career_track_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_track_categories ALTER COLUMN id SET DEFAULT nextval('public.career_track_categories_id_seq'::regclass);


--
-- Name: career_tracks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_tracks ALTER COLUMN id SET DEFAULT nextval('public.career_tracks_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: certifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certifications ALTER COLUMN id SET DEFAULT nextval('public.certifications_id_seq'::regclass);


--
-- Name: import_history id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.import_history ALTER COLUMN id SET DEFAULT nextval('public.import_history_id_seq'::regclass);


--
-- Name: knowledge_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.knowledge_items ALTER COLUMN id SET DEFAULT nextval('public.knowledge_items_id_seq'::regclass);


--
-- Name: resume_analyses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_analyses ALTER COLUMN id SET DEFAULT nextval('public.resume_analyses_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Name: specialty_areas id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.specialty_areas ALTER COLUMN id SET DEFAULT nextval('public.specialty_areas_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: work_role_certifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_certifications ALTER COLUMN id SET DEFAULT nextval('public.work_role_certifications_id_seq'::regclass);


--
-- Name: work_role_knowledge id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_knowledge ALTER COLUMN id SET DEFAULT nextval('public.work_role_knowledge_id_seq'::regclass);


--
-- Name: work_role_skills id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_skills ALTER COLUMN id SET DEFAULT nextval('public.work_role_skills_id_seq'::regclass);


--
-- Name: work_role_tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_tasks ALTER COLUMN id SET DEFAULT nextval('public.work_role_tasks_id_seq'::regclass);


--
-- Name: work_roles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_roles ALTER COLUMN id SET DEFAULT nextval('public.work_roles_id_seq'::regclass);


--
-- Name: career_level_certifications career_level_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_certifications
    ADD CONSTRAINT career_level_certifications_pkey PRIMARY KEY (id);


--
-- Name: career_level_knowledge career_level_knowledge_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_knowledge
    ADD CONSTRAINT career_level_knowledge_pkey PRIMARY KEY (id);


--
-- Name: career_level_skills career_level_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_skills
    ADD CONSTRAINT career_level_skills_pkey PRIMARY KEY (id);


--
-- Name: career_level_tasks career_level_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_tasks
    ADD CONSTRAINT career_level_tasks_pkey PRIMARY KEY (id);


--
-- Name: career_level_work_roles career_level_work_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_work_roles
    ADD CONSTRAINT career_level_work_roles_pkey PRIMARY KEY (id);


--
-- Name: career_levels career_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_levels
    ADD CONSTRAINT career_levels_pkey PRIMARY KEY (id);


--
-- Name: career_positions career_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_positions
    ADD CONSTRAINT career_positions_pkey PRIMARY KEY (id);


--
-- Name: career_track_categories career_track_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_track_categories
    ADD CONSTRAINT career_track_categories_pkey PRIMARY KEY (id);


--
-- Name: career_tracks career_tracks_name_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_tracks
    ADD CONSTRAINT career_tracks_name_unique UNIQUE (name);


--
-- Name: career_tracks career_tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_tracks
    ADD CONSTRAINT career_tracks_pkey PRIMARY KEY (id);


--
-- Name: categories categories_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_code_unique UNIQUE (code);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_code_unique UNIQUE (code);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: import_history import_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.import_history
    ADD CONSTRAINT import_history_pkey PRIMARY KEY (id);


--
-- Name: knowledge_items knowledge_items_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.knowledge_items
    ADD CONSTRAINT knowledge_items_code_unique UNIQUE (code);


--
-- Name: knowledge_items knowledge_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.knowledge_items
    ADD CONSTRAINT knowledge_items_pkey PRIMARY KEY (id);


--
-- Name: resume_analyses resume_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_analyses
    ADD CONSTRAINT resume_analyses_pkey PRIMARY KEY (id);


--
-- Name: skills skills_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_code_unique UNIQUE (code);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: specialty_areas specialty_areas_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.specialty_areas
    ADD CONSTRAINT specialty_areas_code_unique UNIQUE (code);


--
-- Name: specialty_areas specialty_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.specialty_areas
    ADD CONSTRAINT specialty_areas_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_code_unique UNIQUE (code);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: work_role_certifications work_role_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_certifications
    ADD CONSTRAINT work_role_certifications_pkey PRIMARY KEY (id);


--
-- Name: work_role_knowledge work_role_knowledge_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_knowledge
    ADD CONSTRAINT work_role_knowledge_pkey PRIMARY KEY (id);


--
-- Name: work_role_skills work_role_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_skills
    ADD CONSTRAINT work_role_skills_pkey PRIMARY KEY (id);


--
-- Name: work_role_tasks work_role_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_tasks
    ADD CONSTRAINT work_role_tasks_pkey PRIMARY KEY (id);


--
-- Name: work_roles work_roles_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_code_unique UNIQUE (code);


--
-- Name: work_roles work_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_pkey PRIMARY KEY (id);


--
-- Name: career_level_certifications career_level_certifications_career_level_id_career_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_certifications
    ADD CONSTRAINT career_level_certifications_career_level_id_career_levels_id_fk FOREIGN KEY (career_level_id) REFERENCES public.career_levels(id);


--
-- Name: career_level_certifications career_level_certifications_certification_id_certifications_id_; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_certifications
    ADD CONSTRAINT career_level_certifications_certification_id_certifications_id_ FOREIGN KEY (certification_id) REFERENCES public.certifications(id);


--
-- Name: career_level_knowledge career_level_knowledge_career_level_id_career_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_knowledge
    ADD CONSTRAINT career_level_knowledge_career_level_id_career_levels_id_fk FOREIGN KEY (career_level_id) REFERENCES public.career_levels(id);


--
-- Name: career_level_knowledge career_level_knowledge_knowledge_item_id_knowledge_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_knowledge
    ADD CONSTRAINT career_level_knowledge_knowledge_item_id_knowledge_items_id_fk FOREIGN KEY (knowledge_item_id) REFERENCES public.knowledge_items(id);


--
-- Name: career_level_skills career_level_skills_career_level_id_career_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_skills
    ADD CONSTRAINT career_level_skills_career_level_id_career_levels_id_fk FOREIGN KEY (career_level_id) REFERENCES public.career_levels(id);


--
-- Name: career_level_skills career_level_skills_skill_id_skills_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_skills
    ADD CONSTRAINT career_level_skills_skill_id_skills_id_fk FOREIGN KEY (skill_id) REFERENCES public.skills(id);


--
-- Name: career_level_tasks career_level_tasks_career_level_id_career_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_tasks
    ADD CONSTRAINT career_level_tasks_career_level_id_career_levels_id_fk FOREIGN KEY (career_level_id) REFERENCES public.career_levels(id);


--
-- Name: career_level_tasks career_level_tasks_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_tasks
    ADD CONSTRAINT career_level_tasks_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: career_level_work_roles career_level_work_roles_career_level_id_career_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_work_roles
    ADD CONSTRAINT career_level_work_roles_career_level_id_career_levels_id_fk FOREIGN KEY (career_level_id) REFERENCES public.career_levels(id);


--
-- Name: career_level_work_roles career_level_work_roles_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_level_work_roles
    ADD CONSTRAINT career_level_work_roles_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: career_levels career_levels_career_track_id_career_tracks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_levels
    ADD CONSTRAINT career_levels_career_track_id_career_tracks_id_fk FOREIGN KEY (career_track_id) REFERENCES public.career_tracks(id);


--
-- Name: career_positions career_positions_career_level_id_career_levels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_positions
    ADD CONSTRAINT career_positions_career_level_id_career_levels_id_fk FOREIGN KEY (career_level_id) REFERENCES public.career_levels(id);


--
-- Name: career_positions career_positions_nice_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_positions
    ADD CONSTRAINT career_positions_nice_work_role_id_work_roles_id_fk FOREIGN KEY (nice_work_role_id) REFERENCES public.work_roles(id);


--
-- Name: career_track_categories career_track_categories_career_track_id_career_tracks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_track_categories
    ADD CONSTRAINT career_track_categories_career_track_id_career_tracks_id_fk FOREIGN KEY (career_track_id) REFERENCES public.career_tracks(id);


--
-- Name: career_track_categories career_track_categories_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.career_track_categories
    ADD CONSTRAINT career_track_categories_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: specialty_areas specialty_areas_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.specialty_areas
    ADD CONSTRAINT specialty_areas_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: work_role_certifications work_role_certifications_certification_id_certifications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_certifications
    ADD CONSTRAINT work_role_certifications_certification_id_certifications_id_fk FOREIGN KEY (certification_id) REFERENCES public.certifications(id);


--
-- Name: work_role_certifications work_role_certifications_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_certifications
    ADD CONSTRAINT work_role_certifications_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: work_role_knowledge work_role_knowledge_knowledge_item_id_knowledge_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_knowledge
    ADD CONSTRAINT work_role_knowledge_knowledge_item_id_knowledge_items_id_fk FOREIGN KEY (knowledge_item_id) REFERENCES public.knowledge_items(id);


--
-- Name: work_role_knowledge work_role_knowledge_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_knowledge
    ADD CONSTRAINT work_role_knowledge_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: work_role_skills work_role_skills_skill_id_skills_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_skills
    ADD CONSTRAINT work_role_skills_skill_id_skills_id_fk FOREIGN KEY (skill_id) REFERENCES public.skills(id);


--
-- Name: work_role_skills work_role_skills_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_skills
    ADD CONSTRAINT work_role_skills_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: work_role_tasks work_role_tasks_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_tasks
    ADD CONSTRAINT work_role_tasks_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: work_role_tasks work_role_tasks_work_role_id_work_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_role_tasks
    ADD CONSTRAINT work_role_tasks_work_role_id_work_roles_id_fk FOREIGN KEY (work_role_id) REFERENCES public.work_roles(id);


--
-- Name: work_roles work_roles_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: work_roles work_roles_specialty_area_id_specialty_areas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_roles
    ADD CONSTRAINT work_roles_specialty_area_id_specialty_areas_id_fk FOREIGN KEY (specialty_area_id) REFERENCES public.specialty_areas(id);


--
-- Name: DATABASE neondb; Type: ACL; Schema: -; Owner: neondb_owner
--

GRANT ALL ON DATABASE neondb TO neon_superuser;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

