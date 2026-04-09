--
-- PostgreSQL database dump
--

\restrict y6llya2Q1DZNinda45qwpjFeg9hPo2vQ9fW6LjhHCiLbwAsJ3g7CfMJRcBGKorC

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id integer,
    details text,
    ip_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: cofunding_commitments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cofunding_commitments (
    id integer NOT NULL,
    proposal_id integer NOT NULL,
    organization_id integer NOT NULL,
    amount integer NOT NULL,
    percentage_share text DEFAULT '0'::text NOT NULL,
    status text DEFAULT 'committed'::text NOT NULL,
    notes text,
    committed_at timestamp with time zone DEFAULT now() NOT NULL,
    confirmed_at timestamp with time zone
);


--
-- Name: cofunding_commitments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cofunding_commitments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cofunding_commitments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cofunding_commitments_id_seq OWNED BY public.cofunding_commitments.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info'::text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    link_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    description text,
    logo_url text,
    website text,
    province text,
    city text,
    address text,
    phone text,
    email text,
    npwp text,
    legal_status text,
    verification_status text DEFAULT 'pending'::text NOT NULL,
    trust_score integer DEFAULT 0,
    verified_at timestamp with time zone,
    total_proposals integer DEFAULT 0 NOT NULL,
    total_funded integer DEFAULT 0 NOT NULL,
    success_rate text DEFAULT '0'::text NOT NULL,
    focus_areas text[] DEFAULT '{}'::text[] NOT NULL,
    sdg_goals integer[] DEFAULT '{}'::integer[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    nib text,
    sk_kemenkumham text,
    legal_entity_type text,
    founding_year integer,
    director_name text,
    contact_person_name text,
    contact_person_phone text,
    bank_name text,
    bank_account_number text,
    bank_account_name text
);


--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: project_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_milestones (
    id integer NOT NULL,
    project_id integer NOT NULL,
    title text NOT NULL,
    description text,
    due_date text,
    completed_at timestamp with time zone,
    status text DEFAULT 'belum'::text NOT NULL,
    progress_percent integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: project_milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_milestones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_milestones_id_seq OWNED BY public.project_milestones.id;


--
-- Name: project_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_reports (
    id integer NOT NULL,
    project_id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    report_type text DEFAULT 'progres'::text NOT NULL,
    budget_used integer,
    beneficiaries_count integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: project_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_reports_id_seq OWNED BY public.project_reports.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    proposal_id integer NOT NULL,
    status text DEFAULT 'aktif'::text NOT NULL,
    budget_used integer DEFAULT 0 NOT NULL,
    progress_percent integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: proposal_budget_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proposal_budget_items (
    id integer NOT NULL,
    proposal_id integer NOT NULL,
    description text NOT NULL,
    amount integer NOT NULL,
    category text DEFAULT 'umum'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: proposal_budget_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.proposal_budget_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: proposal_budget_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.proposal_budget_items_id_seq OWNED BY public.proposal_budget_items.id;


--
-- Name: proposal_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proposal_status_history (
    id integer NOT NULL,
    proposal_id integer NOT NULL,
    status text NOT NULL,
    notes text,
    changed_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: proposal_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.proposal_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: proposal_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.proposal_status_history_id_seq OWNED BY public.proposal_status_history.id;


--
-- Name: proposals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proposals (
    id integer NOT NULL,
    title text NOT NULL,
    summary text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    category text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    organization_id integer NOT NULL,
    province text NOT NULL,
    city text,
    target_beneficiaries integer DEFAULT 0 NOT NULL,
    budget_total integer DEFAULT 0 NOT NULL,
    funded_amount integer DEFAULT 0 NOT NULL,
    start_date text,
    end_date text,
    sdg_goals integer[] DEFAULT '{}'::integer[] NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    ai_score integer,
    ai_summary text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.proposals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: proposals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.proposals_id_seq OWNED BY public.proposals.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'ngo'::text NOT NULL,
    avatar_url text,
    is_active boolean DEFAULT true NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    organization_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: cofunding_commitments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cofunding_commitments ALTER COLUMN id SET DEFAULT nextval('public.cofunding_commitments_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: project_milestones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_milestones ALTER COLUMN id SET DEFAULT nextval('public.project_milestones_id_seq'::regclass);


--
-- Name: project_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_reports ALTER COLUMN id SET DEFAULT nextval('public.project_reports_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: proposal_budget_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proposal_budget_items ALTER COLUMN id SET DEFAULT nextval('public.proposal_budget_items_id_seq'::regclass);


--
-- Name: proposal_status_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proposal_status_history ALTER COLUMN id SET DEFAULT nextval('public.proposal_status_history_id_seq'::regclass);


--
-- Name: proposals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proposals ALTER COLUMN id SET DEFAULT nextval('public.proposals_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address, created_at) FROM stdin;
1	4	REGISTER	user	4	\N	202.124.8.1	2026-04-09 16:52:55.032836+00
2	4	CREATE_ORGANIZATION	organization	4	Komunitas Belajar Nusantara	202.124.8.1	2026-04-09 16:52:55.032836+00
3	4	CREATE_PROPOSAL	proposal	1	Program Beasiswa	202.124.8.1	2026-04-09 16:52:55.032836+00
4	7	VERIFY_ORGANIZATION_VERIFIED	organization	4	Verifikasi dokumen lengkap	10.0.0.5	2026-04-09 16:52:55.032836+00
5	1	LOGIN	user	1	\N	10.0.0.1	2026-04-09 16:52:55.032836+00
6	2	CREATE_COFUNDING	cofunding	1	Rp 150.000.000 untuk beasiswa	203.45.23.10	2026-04-09 16:52:55.032836+00
7	6	CREATE_PROPOSAL	proposal	2	Program Mangrove Bali	118.98.44.12	2026-04-09 16:52:55.032836+00
8	1	VERIFY_ORGANIZATION_VERIFIED	organization	5	Dokumen sah dan valid	10.0.0.1	2026-04-09 16:52:55.032836+00
9	1	LOGIN	user	1	\N	::1	2026-04-09 17:23:23.096901+00
10	9	REGISTER	user	9	\N	::1	2026-04-09 17:23:28.212192+00
11	1	LOGIN	user	1	\N	::ffff:127.0.0.1	2026-04-09 17:24:33.361355+00
12	2	LOGIN	user	2	\N	::ffff:127.0.0.1	2026-04-09 17:25:31.262451+00
13	4	LOGIN	user	4	\N	::ffff:127.0.0.1	2026-04-09 17:26:24.463603+00
14	7	LOGIN	user	7	\N	::ffff:127.0.0.1	2026-04-09 17:27:22.548022+00
15	8	LOGIN	user	8	\N	::ffff:127.0.0.1	2026-04-09 17:28:04.924392+00
16	2	LOGIN	user	2	\N	::ffff:127.0.0.1	2026-04-09 17:36:14.66376+00
17	10	REGISTER	user	10	\N	::ffff:127.0.0.1	2026-04-09 17:41:13.062839+00
\.


--
-- Data for Name: cofunding_commitments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cofunding_commitments (id, proposal_id, organization_id, amount, percentage_share, status, notes, committed_at, confirmed_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, title, message, type, is_read, link_url, created_at) FROM stdin;
1	4	Proposal Beasiswa Disetujui	Selamat! Proposal beasiswa Anda telah disetujui dan akan segera didanai.	success	t	/proposals/1	2026-04-09 16:52:51.273492+00
2	4	Laporan Bulanan Diperlukan	Mohon upload laporan perkembangan proyek bulan ini sebelum tanggal 30.	warning	f	/projects/1	2026-04-09 16:52:51.273492+00
3	5	Proposal MCK Diterima	Proposal Anda telah kami terima dan sedang dalam proses review.	info	f	/proposals/5	2026-04-09 16:52:51.273492+00
4	6	Penanaman Mangrove Berjalan	Proyek penanaman mangrove telah memasuki tahap penanaman kedua. Selamat!	success	t	/projects/2	2026-04-09 16:52:51.273492+00
5	2	Proposal Baru Menunggu Review	Ada 2 proposal baru yang sesuai dengan fokus CSR Anda. Segera tinjau.	info	f	/proposals	2026-04-09 16:52:51.273492+00
6	3	Co-funding Dikonfirmasi	Komitmen pendanaan sebesar Rp 50.000.000 untuk program klinik NTT berhasil dikonfirmasi.	success	f	/cofunding	2026-04-09 16:52:51.273492+00
7	7	Antrian Verifikasi Organisasi	Ada 2 organisasi baru yang menunggu verifikasi dokumen legalitas.	warning	f	/organizations	2026-04-09 16:52:51.273492+00
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.organizations (id, name, type, description, logo_url, website, province, city, address, phone, email, npwp, legal_status, verification_status, trust_score, verified_at, total_proposals, total_funded, success_rate, focus_areas, sdg_goals, created_at, updated_at, nib, sk_kemenkumham, legal_entity_type, founding_year, director_name, contact_person_name, contact_person_phone, bank_name, bank_account_number, bank_account_name) FROM stdin;
1	PT Pertamina (Persero)	perusahaan	Perusahaan energi nasional terbesar di Indonesia yang berkomitmen pada program CSR berkelanjutan.	\N	https://pertamina.com	DKI Jakarta	Jakarta Selatan	\N	\N	\N	\N	\N	verified	95	2026-04-09 16:50:58.417398+00	0	450000000	78.5	{lingkungan,pendidikan,kesehatan,ekonomi}	{4,7,13,17}	2026-04-09 16:50:58.417398+00	2026-04-09 16:50:58.417398+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	PT Bank Rakyat Indonesia (Persero)	perusahaan	Bank BUMN terbesar yang fokus pada pemberdayaan UMKM dan ekonomi kerakyatan.	\N	https://bri.co.id	DKI Jakarta	Jakarta Pusat	\N	\N	\N	\N	\N	verified	92	2026-04-09 16:50:58.417398+00	0	320000000	82.3	{ekonomi,pendidikan,umkm}	{1,2,8,10}	2026-04-09 16:50:58.417398+00	2026-04-09 16:50:58.417398+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	Yayasan Rumah Zakat	yayasan	Lembaga filantropi yang mengelola zakat, infaq, dan sedekah untuk pemberdayaan masyarakat.	\N	https://rumahzakat.org	Jawa Barat	Bandung	\N	\N	\N	\N	\N	verified	88	2026-04-09 16:50:58.417398+00	12	0	91.7	{pendidikan,kesehatan,ekonomi,kebencanaan}	{1,2,3,4}	2026-04-09 16:50:58.417398+00	2026-04-09 16:50:58.417398+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	Komunitas Belajar Nusantara	komunitas	Gerakan pendidikan non-formal yang menyediakan akses belajar gratis bagi anak-anak kurang mampu.	\N	\N	Jawa Tengah	Semarang	\N	\N	\N	\N	\N	verified	75	2026-04-09 16:50:58.417398+00	8	0	87.5	{pendidikan}	{4}	2026-04-09 16:50:58.417398+00	2026-04-09 16:50:58.417398+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	Yayasan Konservasi Alam Indonesia	ngo	Organisasi lingkungan yang fokus pada konservasi hutan, laut, dan keanekaragaman hayati.	\N	https://ykaji.or.id	Bali	Denpasar	\N	\N	\N	\N	\N	verified	82	2026-04-09 16:50:58.417398+00	6	0	83.3	{lingkungan}	{13,14,15}	2026-04-09 16:50:58.417398+00	2026-04-09 16:50:58.417398+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	Koperasi Petani Maju Bersama	komunitas	Koperasi yang memberdayakan petani lokal melalui akses modal, teknologi, dan pasar.	\N	\N	Jawa Timur	Malang	\N	\N	\N	\N	\N	pending	60	\N	3	0	66.7	{ekonomi,umkm}	{1,2,8}	2026-04-09 16:50:58.417398+00	2026-04-09 16:50:58.417398+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	Sekolah Alam Kreasi Bangsa	sekolah	Sekolah alternatif berbasis alam yang memberikan pendidikan holistik dan gratis bagi anak-anak.	\N	\N	DI Yogyakarta	Sleman	\N	\N	\N	\N	\N	verified	78	2026-04-09 16:50:58.417398+00	4	0	75.0	{pendidikan}	{4}	2026-04-09 16:50:58.417398+00	2026-04-09 16:50:58.417398+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	Startup Sosial TaniDigi	startup_sosial	Platform teknologi pertanian yang membantu petani mengakses pasar digital dan informasi cuaca.	\N	https://tanidigi.id	Jawa Barat	Bogor	\N	\N	\N	\N	\N	pending	55	\N	2	0	50.0	{ekonomi,umkm}	{2,8,9}	2026-04-09 16:50:58.417398+00	2026-04-09 16:50:58.417398+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: project_milestones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project_milestones (id, project_id, title, description, due_date, completed_at, status, progress_percent, created_at) FROM stdin;
1	1	Seleksi dan Verifikasi Calon Penerima Beasiswa	Proses seleksi dokumen, wawancara, dan verifikasi data sosial ekonomi	2024-02-28	\N	selesai	100	2026-04-09 16:52:20.844577+00
2	1	Distribusi Beasiswa Semester Ganjil 2024	Pencairan dan distribusi dana beasiswa untuk semester pertama	2024-03-31	\N	selesai	100	2026-04-09 16:52:20.844577+00
3	1	Monitoring Prestasi dan Kehadiran Siswa	Pemantauan perkembangan akademik dan kehadiran penerima beasiswa	2024-08-31	\N	berjalan	60	2026-04-09 16:52:20.844577+00
4	1	Distribusi Beasiswa Semester Genap 2024	Pencairan dan distribusi dana beasiswa untuk semester kedua	2024-09-30	\N	belum	0	2026-04-09 16:52:20.844577+00
5	2	Sosialisasi Program kepada Komunitas Nelayan	Pertemuan dengan kepala desa dan komunitas nelayan di 5 desa	2024-03-15	\N	selesai	100	2026-04-09 16:52:20.844577+00
6	2	Pembibitan dan Persiapan Lahan Penanaman	Pembibitan 12.000 bibit mangrove dan persiapan lahan di pesisir	2024-04-30	\N	selesai	100	2026-04-09 16:52:20.844577+00
7	2	Penanaman Tahap 1 (5.000 pohon)	Penanaman bersama komunitas di desa Perancak dan Kedonganan	2024-06-30	\N	selesai	100	2026-04-09 16:52:20.844577+00
8	2	Penanaman Tahap 2 (5.000 pohon) dan Monitoring	Penanaman tahap kedua dan monitoring pertumbuhan	2024-10-31	\N	berjalan	45	2026-04-09 16:52:20.844577+00
\.


--
-- Data for Name: project_reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project_reports (id, project_id, title, content, report_type, budget_used, beneficiaries_count, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, proposal_id, status, budget_used, progress_percent, created_at, updated_at) FROM stdin;
1	1	aktif	85000000	65	2026-04-09 16:52:16.990599+00	2026-04-09 16:52:16.990599+00
2	2	aktif	52000000	72	2026-04-09 16:52:16.990599+00	2026-04-09 16:52:16.990599+00
\.


--
-- Data for Name: proposal_budget_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.proposal_budget_items (id, proposal_id, description, amount, category, created_at) FROM stdin;
\.


--
-- Data for Name: proposal_status_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.proposal_status_history (id, proposal_id, status, notes, changed_by, created_at) FROM stdin;
1	1	draft	\N	4	2026-04-09 16:52:47.311988+00
2	1	dikirim	Proposal telah lengkap dan siap ditinjau	4	2026-04-09 16:52:47.311988+00
3	1	review	Sedang dalam proses review oleh tim verifikator	7	2026-04-09 16:52:47.311988+00
4	1	disetujui	Proposal disetujui. Silakan konfirmasi jadwal pelaksanaan.	7	2026-04-09 16:52:47.311988+00
5	1	didanai	Dana telah dicairkan dan proyek siap dimulai	2	2026-04-09 16:52:47.311988+00
6	2	draft	\N	6	2026-04-09 16:52:47.311988+00
7	2	dikirim	Dokumen lengkap, siap untuk tinjauan	6	2026-04-09 16:52:47.311988+00
8	2	disetujui	Program konservasi sangat relevan dengan fokus CSR kami	1	2026-04-09 16:52:47.311988+00
9	2	berjalan	Proyek sudah berjalan sesuai rencana	1	2026-04-09 16:52:47.311988+00
10	3	draft	\N	4	2026-04-09 16:52:47.311988+00
11	3	dikirim	\N	4	2026-04-09 16:52:47.311988+00
12	3	review	Proposal memerlukan dokumen tambahan: izin lokasi klinik	7	2026-04-09 16:52:47.311988+00
13	3	disetujui	Disetujui dengan catatan: koordinasi dengan Dinas Kesehatan setempat	3	2026-04-09 16:52:47.311988+00
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.proposals (id, title, summary, description, category, status, organization_id, province, city, target_beneficiaries, budget_total, funded_amount, start_date, end_date, sdg_goals, tags, ai_score, ai_summary, created_at, updated_at) FROM stdin;
5	Pembangunan MCK Komunal Ramah Lingkungan di 20 Dusun	Pembangunan 20 unit MCK komunal dengan sistem biodigester dan pengomposan di desa-desa yang masih buang air sembarangan.	Sanitasi yang buruk masih menjadi masalah serius di daerah pedesaan Indonesia. Sekitar 20 dusun di Jawa Timur masih memiliki lebih dari 60% warga yang buang air sembarangan. Program ini membangun MCK komunal modern dengan teknologi biodigester yang mengolah limbah menjadi biogas dan pupuk organik. Setiap unit MCK dilengkapi dengan 4 toilet, 2 kamar mandi, wastafel, dan fasilitas cuci tangan. Warga juga mendapat edukasi tentang PHBS dan pengelolaan sampah rumah tangga.	infrastruktur	dikirim	4	Jawa Timur	Banyuwangi	4000	120000000	0	2025-05-01	2026-04-30	{6,11}	{sanitasi,mck,jawa-timur,lingkungan}	74	\N	2026-04-09 16:52:00.045839+00	2026-04-09 16:52:00.045839+00
6	Bantuan Pemulihan Ekonomi Korban Banjir Demak 2024	Memberikan modal usaha dan pelatihan wirausaha kepada 300 kepala keluarga korban banjir Demak yang kehilangan mata pencaharian.	Banjir besar yang melanda Demak pada Februari 2024 menyebabkan ribuan kepala keluarga kehilangan aset dan mata pencaharian. Program pemulihan ekonomi ini memberikan modal usaha awal sebesar Rp 1-3 juta per KK, pelatihan kewirausahaan praktis, dan pendampingan selama 6 bulan. Fokus usaha: perdagangan kecil, olahan makanan, kerajinan, dan jasa. Kami juga memfasilitasi akses ke program KUR dan kredit mikro lainnya.	kebencanaan	draft	4	Jawa Tengah	Demak	300	95000000	0	\N	\N	{1,8,11}	{banjir,demak,pemulihan,kebencanaan,modal-usaha}	68	\N	2026-04-09 16:52:00.045839+00	2026-04-09 16:52:00.045839+00
7	Digitalisasi 50 UMKM Kuliner Tradisional Yogyakarta	Membantu 50 pelaku UMKM kuliner tradisional Yogyakarta untuk go digital, meningkatkan omset, dan melestarikan kuliner warisan budaya.	Yogyakarta memiliki ribuan UMKM kuliner tradisional yang terancam punah karena kalah bersaing dengan bisnis modern. Program ini memberikan pendampingan untuk membuat akun usaha di GoFood, ShopeeFood, dan Instagram; pembuatan foto produk profesional; pelatihan manajemen keuangan sederhana; dan sertifikat halal/PIRT. Target: 50 UMKM dengan rata-rata peningkatan omset 40% dalam 6 bulan.	umkm	dikirim	7	DI Yogyakarta	Kota Yogyakarta	5000	55000000	0	2025-06-01	2025-11-30	{8,11}	{umkm,kuliner,yogyakarta,digital,warisan-budaya}	77	\N	2026-04-09 16:52:00.045839+00	2026-04-09 16:52:00.045839+00
4	Pemberdayaan UMKM Digital Perempuan Petani Kopi Aceh	Membantu 150 perempuan petani kopi di Aceh Tengah untuk memasarkan produk secara digital dan meningkatkan nilai tambah.	Petani kopi perempuan di Aceh Tengah menghasilkan kopi Gayo berkualitas dunia, namun tidak memiliki akses pasar yang memadai. Program ini memberikan pelatihan pemasaran digital, pembuatan kemasan premium, sertifikasi organik, dan akses platform e-commerce. Kami juga membantu pembentukan koperasi perempuan dan fasilitasi akses kredit usaha mikro. Dampak yang diharapkan adalah peningkatan pendapatan 30-50% bagi 150 perempuan petani.	perempuan	review	3	Aceh	Aceh Tengah	150	75000000	0	2025-04-01	2025-10-31	{2,5,8,10}	{perempuan,kopi,aceh,umkm,digital}	83	Proposal ini mendapat skor 83/100. Proposal layak untuk dipertimbangkan.	2026-04-09 16:52:00.045839+00	2026-04-09 17:27:29.52+00
1	Program Beasiswa Siswa Berprestasi dari Keluarga Kurang Mampu	Memberikan beasiswa penuh kepada 200 siswa SMA berprestasi dari keluarga kurang mampu di Jawa Tengah selama 2 tahun.	Program beasiswa ini dirancang untuk memastikan setiap siswa berprestasi di Jawa Tengah memiliki kesempatan yang sama untuk melanjutkan pendidikan. Kami akan memberikan beasiswa penuh termasuk biaya sekolah, seragam, buku, dan uang saku bulanan kepada 200 siswa terpilih dari keluarga dengan penghasilan di bawah rata-rata. Program akan disertai dengan mentoring karir dan pembinaan karakter.	pendidikan	didanai	4	Jawa Tengah	Semarang	200	150000000	150000000	2024-01-15	2025-12-31	{4,10}	{beasiswa,pendidikan,siswa,jawa-tengah}	80	Proposal ini mendapat skor 80/100. Proposal layak untuk dipertimbangkan.	2026-04-09 16:52:00.045839+00	2026-04-09 17:28:17.029+00
2	Penanaman 10.000 Pohon Bakau di Pesisir Bali	Program rehabilitasi ekosistem mangrove di 5 desa pesisir Bali untuk mengurangi abrasi dan meningkatkan kesejahteraan nelayan.	Abrasi pantai dan kerusakan ekosistem mangrove di Bali telah mengancam mata pencaharian ribuan nelayan dan komunitas pesisir. Program ini bertujuan menanam 10.000 bibit pohon bakau di sepanjang 15 km garis pantai di 5 desa pesisir di Kabupaten Badung dan Gianyar. Kegiatan akan melibatkan komunitas lokal, siswa sekolah, dan kelompok nelayan dalam proses penanaman, perawatan, dan monitoring pertumbuhan.	lingkungan	berjalan	5	Bali	Badung	3500	85000000	85000000	2024-03-01	2024-12-31	{13,14,15}	{mangrove,pesisir,bali,lingkungan}	88	Proposal ini mendapat skor 88/100. Proposal layak untuk dipertimbangkan.	2026-04-09 16:52:00.045839+00	2026-04-09 17:28:23.5+00
3	Klinik Kesehatan Gratis untuk Masyarakat Terpencil NTT	Mendirikan 3 klinik kesehatan gratis di daerah terpencil Nusa Tenggara Timur yang belum terjangkau fasilitas medis.	Nusa Tenggara Timur memiliki angka kematian ibu dan bayi tertinggi di Indonesia. Minimnya akses ke fasilitas kesehatan di daerah terpencil menjadi penyebab utama. Program ini akan mendirikan 3 klinik kesehatan di Kabupaten Manggarai Barat, Sumba Barat, dan Alor. Setiap klinik dilengkapi dengan tenaga medis profesional, obat-obatan esensial, dan peralatan dasar. Selain pelayanan kuratif, kami juga menyelenggarakan program penyuluhan kesehatan dan imunisasi bagi ibu dan anak.	kesehatan	disetujui	3	NTT	Manggarai Barat	5000	200000000	50000000	2025-01-01	2025-12-31	{3,10}	{kesehatan,ntt,klinik,ibu-anak}	85	Proposal ini mendapat skor 85/100. Proposal layak untuk dipertimbangkan.	2026-04-09 16:52:00.045839+00	2026-04-09 17:36:21.47+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password_hash, role, avatar_url, is_active, email_verified, organization_id, created_at, updated_at) FROM stdin;
1	Admin Platform	admin@csrhub.id	76f37c0034c53c11b242317457a4f38e1fb993abf1539a678b01ce8fc7193709	admin	\N	t	t	\N	2026-04-09 16:51:14.619331+00	2026-04-09 16:51:14.619331+00
2	Budi Santoso	budi@pertamina.com	76f37c0034c53c11b242317457a4f38e1fb993abf1539a678b01ce8fc7193709	perusahaan	\N	t	t	1	2026-04-09 16:51:14.619331+00	2026-04-09 16:51:14.619331+00
3	Siti Rahayu	siti@bri.co.id	76f37c0034c53c11b242317457a4f38e1fb993abf1539a678b01ce8fc7193709	perusahaan	\N	t	t	2	2026-04-09 16:51:14.619331+00	2026-04-09 16:51:14.619331+00
4	Ahmad Hidayat	ahmad@rumahzakat.org	76f37c0034c53c11b242317457a4f38e1fb993abf1539a678b01ce8fc7193709	ngo	\N	t	t	3	2026-04-09 16:51:14.619331+00	2026-04-09 16:51:14.619331+00
5	Dewi Kusuma	dewi@kbn.or.id	76f37c0034c53c11b242317457a4f38e1fb993abf1539a678b01ce8fc7193709	ngo	\N	t	t	4	2026-04-09 16:51:14.619331+00	2026-04-09 16:51:14.619331+00
6	Rudi Hartono	rudi@ykaji.or.id	76f37c0034c53c11b242317457a4f38e1fb993abf1539a678b01ce8fc7193709	ngo	\N	t	t	5	2026-04-09 16:51:14.619331+00	2026-04-09 16:51:14.619331+00
7	Supervisor Verifikasi	verifikator@csrhub.id	76f37c0034c53c11b242317457a4f38e1fb993abf1539a678b01ce8fc7193709	verifikator	\N	t	t	\N	2026-04-09 16:51:14.619331+00	2026-04-09 16:51:14.619331+00
8	Auditor Lapangan	auditor@csrhub.id	76f37c0034c53c11b242317457a4f38e1fb993abf1539a678b01ce8fc7193709	auditor	\N	t	t	\N	2026-04-09 16:51:14.619331+00	2026-04-09 16:51:14.619331+00
9	Test User	test@example.com	187939030fa13bc77dfad261cd2dcadf1f515cac330723debaed8bd006c66794	public	\N	t	f	\N	2026-04-09 17:23:28.208925+00	2026-04-09 17:23:28.208925+00
10	SLAMSMART	slamet.abdullah@gmail.com	934479ad286249672b6421557f3f36794d88f28b9362f23966399bbee17d9ee4	ngo	\N	t	f	\N	2026-04-09 17:41:13.059638+00	2026-04-09 17:41:13.059638+00
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 17, true);


--
-- Name: cofunding_commitments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cofunding_commitments_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 7, true);


--
-- Name: organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.organizations_id_seq', 8, true);


--
-- Name: project_milestones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_milestones_id_seq', 8, true);


--
-- Name: project_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_reports_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 2, true);


--
-- Name: proposal_budget_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.proposal_budget_items_id_seq', 1, false);


--
-- Name: proposal_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.proposal_status_history_id_seq', 13, true);


--
-- Name: proposals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.proposals_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: cofunding_commitments cofunding_commitments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cofunding_commitments
    ADD CONSTRAINT cofunding_commitments_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: project_milestones project_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_pkey PRIMARY KEY (id);


--
-- Name: project_reports project_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_reports
    ADD CONSTRAINT project_reports_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_proposal_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_proposal_id_unique UNIQUE (proposal_id);


--
-- Name: proposal_budget_items proposal_budget_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proposal_budget_items
    ADD CONSTRAINT proposal_budget_items_pkey PRIMARY KEY (id);


--
-- Name: proposal_status_history proposal_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proposal_status_history
    ADD CONSTRAINT proposal_status_history_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict y6llya2Q1DZNinda45qwpjFeg9hPo2vQ9fW6LjhHCiLbwAsJ3g7CfMJRcBGKorC

