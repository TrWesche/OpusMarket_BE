--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

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
-- Name: gathering_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gathering_images (
    id integer NOT NULL,
    gathering_id integer NOT NULL,
    url text NOT NULL,
    alt_text text,
    weight integer
);


ALTER TABLE public.gathering_images OWNER TO postgres;

--
-- Name: gathering_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gathering_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gathering_images_id_seq OWNER TO postgres;

--
-- Name: gathering_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gathering_images_id_seq OWNED BY public.gathering_images.id;


--
-- Name: gathering_merchants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gathering_merchants (
    id integer NOT NULL,
    gathering_id integer NOT NULL,
    merchant_id integer NOT NULL
);


ALTER TABLE public.gathering_merchants OWNER TO postgres;

--
-- Name: gathering_merchants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gathering_merchants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gathering_merchants_id_seq OWNER TO postgres;

--
-- Name: gathering_merchants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gathering_merchants_id_seq OWNED BY public.gathering_merchants.id;


--
-- Name: gatherings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gatherings (
    id integer NOT NULL,
    merchant_id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    link text NOT NULL,
    gathering_dt timestamp with time zone
);


ALTER TABLE public.gatherings OWNER TO postgres;

--
-- Name: gatherings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gatherings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gatherings_id_seq OWNER TO postgres;

--
-- Name: gatherings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gatherings_id_seq OWNED BY public.gatherings.id;


--
-- Name: merchant_about; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merchant_about (
    id integer NOT NULL,
    merchant_id integer NOT NULL,
    headline text,
    about text,
    logo_wide_url text,
    logo_narrow_url text
);


ALTER TABLE public.merchant_about OWNER TO postgres;

--
-- Name: merchant_about_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.merchant_about_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.merchant_about_id_seq OWNER TO postgres;

--
-- Name: merchant_about_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.merchant_about_id_seq OWNED BY public.merchant_about.id;


--
-- Name: merchant_bios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merchant_bios (
    id integer NOT NULL,
    merchant_id integer NOT NULL,
    name text NOT NULL,
    bio text NOT NULL,
    image_url text,
    alt_text text
);


ALTER TABLE public.merchant_bios OWNER TO postgres;

--
-- Name: merchant_bios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.merchant_bios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.merchant_bios_id_seq OWNER TO postgres;

--
-- Name: merchant_bios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.merchant_bios_id_seq OWNED BY public.merchant_bios.id;


--
-- Name: merchant_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merchant_images (
    id integer NOT NULL,
    merchant_id integer NOT NULL,
    url text NOT NULL,
    alt_text text
);


ALTER TABLE public.merchant_images OWNER TO postgres;

--
-- Name: merchant_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.merchant_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.merchant_images_id_seq OWNER TO postgres;

--
-- Name: merchant_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.merchant_images_id_seq OWNED BY public.merchant_images.id;


--
-- Name: merchants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merchants (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    display_name text NOT NULL
);


ALTER TABLE public.merchants OWNER TO postgres;

--
-- Name: merchants_featured; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merchants_featured (
    id integer NOT NULL,
    merchant_id integer NOT NULL,
    feature_set text NOT NULL
);


ALTER TABLE public.merchants_featured OWNER TO postgres;

--
-- Name: merchants_featured_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.merchants_featured_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.merchants_featured_id_seq OWNER TO postgres;

--
-- Name: merchants_featured_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.merchants_featured_id_seq OWNED BY public.merchants_featured.id;


--
-- Name: merchants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.merchants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.merchants_id_seq OWNER TO postgres;

--
-- Name: merchants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.merchants_id_seq OWNED BY public.merchants.id;


--
-- Name: order_coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_coupons (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    coupon_id integer,
    coupon_code text NOT NULL,
    pct_discount numeric NOT NULL
);


ALTER TABLE public.order_coupons OWNER TO postgres;

--
-- Name: order_coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_coupons_id_seq OWNER TO postgres;

--
-- Name: order_coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_coupons_id_seq OWNED BY public.order_coupons.id;


--
-- Name: order_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_products (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer,
    product_name text NOT NULL,
    quantity integer NOT NULL,
    base_price integer NOT NULL,
    promotion_price integer,
    coupon_discount numeric,
    final_price integer NOT NULL,
    modifier_id integer,
    modifier_name text
);


ALTER TABLE public.order_products OWNER TO postgres;

--
-- Name: order_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_products_id_seq OWNER TO postgres;

--
-- Name: order_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_products_id_seq OWNED BY public.order_products.id;


--
-- Name: order_promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_promotions (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer,
    promotion_id integer,
    promotion_price integer NOT NULL
);


ALTER TABLE public.order_promotions OWNER TO postgres;

--
-- Name: order_promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_promotions_id_seq OWNER TO postgres;

--
-- Name: order_promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_promotions_id_seq OWNED BY public.order_promotions.id;


--
-- Name: order_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status (
    id integer NOT NULL,
    order_id integer NOT NULL,
    status text NOT NULL,
    status_dt timestamp with time zone,
    notes text
);


ALTER TABLE public.order_status OWNER TO postgres;

--
-- Name: order_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_status_id_seq OWNER TO postgres;

--
-- Name: order_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_status_id_seq OWNED BY public.order_status.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    order_total integer,
    remote_payment_id text,
    remote_paymaent_dt timestamp with time zone,
    remote_order_id text,
    remote_receipt_id text,
    remote_receipt_url text
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_coupons (
    id integer NOT NULL,
    product_id integer NOT NULL,
    code text NOT NULL,
    pct_discount numeric NOT NULL,
    active boolean DEFAULT false
);


ALTER TABLE public.product_coupons OWNER TO postgres;

--
-- Name: product_coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_coupons_id_seq OWNER TO postgres;

--
-- Name: product_coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_coupons_id_seq OWNED BY public.product_coupons.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer NOT NULL,
    url text NOT NULL,
    alt_text text,
    weight integer
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_images_id_seq OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_meta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_meta (
    id integer NOT NULL,
    product_id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.product_meta OWNER TO postgres;

--
-- Name: product_meta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_meta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_meta_id_seq OWNER TO postgres;

--
-- Name: product_meta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_meta_id_seq OWNED BY public.product_meta.id;


--
-- Name: product_modifiers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_modifiers (
    id integer NOT NULL,
    product_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.product_modifiers OWNER TO postgres;

--
-- Name: product_modifiers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_modifiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_modifiers_id_seq OWNER TO postgres;

--
-- Name: product_modifiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_modifiers_id_seq OWNED BY public.product_modifiers.id;


--
-- Name: product_promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_promotions (
    id integer NOT NULL,
    product_id integer NOT NULL,
    promotion_price integer NOT NULL,
    active boolean DEFAULT false
);


ALTER TABLE public.product_promotions OWNER TO postgres;

--
-- Name: product_promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_promotions_id_seq OWNER TO postgres;

--
-- Name: product_promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_promotions_id_seq OWNED BY public.product_promotions.id;


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer NOT NULL,
    title text,
    body text,
    review_dt timestamp with time zone
);


ALTER TABLE public.product_reviews OWNER TO postgres;

--
-- Name: product_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_reviews_id_seq OWNER TO postgres;

--
-- Name: product_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    merchant_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    base_price integer NOT NULL,
    avg_rating numeric DEFAULT 0,
    qty_ratings integer DEFAULT 0,
    qty_views integer DEFAULT 0,
    qty_purchases integer DEFAULT 0,
    qty_returns integer DEFAULT 0
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_featured; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_featured (
    id integer NOT NULL,
    product_id integer,
    merchant_id integer,
    feature_set text NOT NULL,
    site_wide boolean DEFAULT false
);


ALTER TABLE public.products_featured OWNER TO postgres;

--
-- Name: products_featured_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_featured_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_featured_id_seq OWNER TO postgres;

--
-- Name: products_featured_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_featured_id_seq OWNED BY public.products_featured.id;


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: gathering_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gathering_images ALTER COLUMN id SET DEFAULT nextval('public.gathering_images_id_seq'::regclass);


--
-- Name: gathering_merchants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gathering_merchants ALTER COLUMN id SET DEFAULT nextval('public.gathering_merchants_id_seq'::regclass);


--
-- Name: gatherings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gatherings ALTER COLUMN id SET DEFAULT nextval('public.gatherings_id_seq'::regclass);


--
-- Name: merchant_about id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_about ALTER COLUMN id SET DEFAULT nextval('public.merchant_about_id_seq'::regclass);


--
-- Name: merchant_bios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_bios ALTER COLUMN id SET DEFAULT nextval('public.merchant_bios_id_seq'::regclass);


--
-- Name: merchant_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_images ALTER COLUMN id SET DEFAULT nextval('public.merchant_images_id_seq'::regclass);


--
-- Name: merchants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchants ALTER COLUMN id SET DEFAULT nextval('public.merchants_id_seq'::regclass);


--
-- Name: merchants_featured id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchants_featured ALTER COLUMN id SET DEFAULT nextval('public.merchants_featured_id_seq'::regclass);


--
-- Name: order_coupons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_coupons ALTER COLUMN id SET DEFAULT nextval('public.order_coupons_id_seq'::regclass);


--
-- Name: order_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products ALTER COLUMN id SET DEFAULT nextval('public.order_products_id_seq'::regclass);


--
-- Name: order_promotions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotions ALTER COLUMN id SET DEFAULT nextval('public.order_promotions_id_seq'::regclass);


--
-- Name: order_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status ALTER COLUMN id SET DEFAULT nextval('public.order_status_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product_coupons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_coupons ALTER COLUMN id SET DEFAULT nextval('public.product_coupons_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_meta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_meta ALTER COLUMN id SET DEFAULT nextval('public.product_meta_id_seq'::regclass);


--
-- Name: product_modifiers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_modifiers ALTER COLUMN id SET DEFAULT nextval('public.product_modifiers_id_seq'::regclass);


--
-- Name: product_promotions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_promotions ALTER COLUMN id SET DEFAULT nextval('public.product_promotions_id_seq'::regclass);


--
-- Name: product_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: products_featured id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_featured ALTER COLUMN id SET DEFAULT nextval('public.products_featured_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: gathering_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gathering_images (id, gathering_id, url, alt_text, weight) FROM stdin;
\.


--
-- Data for Name: gathering_merchants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gathering_merchants (id, gathering_id, merchant_id) FROM stdin;
1	1	1
5	1	1
7	1	1
\.


--
-- Data for Name: gatherings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gatherings (id, merchant_id, title, description, link, gathering_dt) FROM stdin;
1	1	TestGathering1Update	We are here today to test gathering 1 updates.	http://gatheringProvider.com/gathering1	2020-12-01 10:00:00-06
\.


--
-- Data for Name: merchant_about; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.merchant_about (id, merchant_id, headline, about, logo_wide_url, logo_narrow_url) FROM stdin;
1	1	This is a Test Headline	\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pharetra ligula metus, a fermentum massa pulvinar at. Sed eget imperdiet neque. Cras lacinia eleifend mi a porttitor. Suspendisse in dignissim odio. Morbi ipsum purus, consectetur eu metus lobortis, cursus imperdiet dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc tristique magna et ex sollicitudin posuere. Proin at faucibus ex. Mauris congue mauris a elit rhoncus, in finibus justo tempor. Integer varius eget urna sit amet dignissim. Nam ac diam ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;\n\nPraesent pulvinar fringilla dictum. Cras consectetur nec augue a ultricies. Praesent at nunc nec ante congue dignissim ac eget dolor. Curabitur lectus nunc, blandit convallis libero eget, bibendum bibendum ex. Duis ullamcorper in nisi sed faucibus. Donec tincidunt metus at nibh eleifend scelerisque. Etiam ligula dolor, semper eget sollicitudin vel, molestie blandit lectus. Proin posuere sit amet nisi at ultricies. Ut tristique nulla sit amet neque ultricies, vel porttitor felis suscipit.\n\nMorbi consectetur, arcu at mattis interdum, neque tortor mollis ipsum, vitae pulvinar sapien neque vitae enim. Ut pulvinar tristique ligula, nec condimentum nisi tempus viverra. Duis eget sagittis nisl. Curabitur rutrum suscipit massa. Ut accumsan fermentum lacus a finibus. Donec eget ante eu leo interdum efficitur iaculis sed orci. Praesent sagittis lacus eu mi porttitor molestie. Integer aliquet lectus ut risus eleifend finibus. Vivamus luctus pellentesque nisl fringilla congue. Sed scelerisque consectetur nibh, at elementum libero faucibus quis. 	https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940	https://images.pexels.com/photos/2180780/pexels-photo-2180780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
\.


--
-- Data for Name: merchant_bios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.merchant_bios (id, merchant_id, name, bio, image_url, alt_text) FROM stdin;
\.


--
-- Data for Name: merchant_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.merchant_images (id, merchant_id, url, alt_text) FROM stdin;
\.


--
-- Data for Name: merchants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.merchants (id, email, password, display_name) FROM stdin;
1	TestMerchant1@test.com	$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.	TestMerchant1
2	TestMerchant2@test.com	$2b$12$4mtPV91gffMnDYr3jsAQ7e6w0XYRu8HNU7LfEqwE3wyZWmuqfwxAC	TestMerchant2
5	TestMerchant3@test.com	$2b$12$39yDOKFUtTH5QgBJTxNVYe2vYzFOcrinEA4SX2idAo.0ACRFHZwFy	TestMerchant3
\.


--
-- Data for Name: merchants_featured; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.merchants_featured (id, merchant_id, feature_set) FROM stdin;
1	2	Top Creators
\.


--
-- Data for Name: order_coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_coupons (id, order_id, product_id, coupon_id, coupon_code, pct_discount) FROM stdin;
1	1	1	1	MEMORIALDAY	0.2
2	2	1	1	MEMORIALDAY	0.2
3	3	1	1	MEMORIALDAY	0.2
4	4	1	1	MEMORIALDAY	0.2
5	5	1	1	MEMORIALDAY	0.2
6	6	1	1	MEMORIALDAY	0.2
7	7	1	1	MEMORIALDAY	0.2
8	8	1	1	MEMORIALDAY	0.2
9	10	1	1	MEMORIALDAY	0.2
10	11	1	1	MEMORIALDAY	0.2
11	12	1	1	MEMORIALDAY	0.2
12	17	1	1	MEMORIALDAY	0.2
13	20	1	1	MEMORIALDAY	0.2
14	21	1	1	MEMORIALDAY	0.2
15	25	1	1	MEMORIALDAY	0.2
16	26	1	3	FRNDSANDFMLY	0.25
17	27	1	1	MEMORIALDAY	0.2
19	29	1	1	MEMORIALDAY	0.2
20	30	1	1	MEMORIALDAY	0.2
21	31	1	3	FRNDSANDFMLY	0.25
22	32	1	1	MEMORIALDAY	0.2
25	35	1	1	MEMORIALDAY	0.2
26	36	1	1	MEMORIALDAY	0.2
27	37	1	1	MEMORIALDAY	0.2
28	38	1	5	BLACKFRIDAY	0.3
29	43	1	5	BLACKFRIDAY	0.3
\.


--
-- Data for Name: order_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_products (id, order_id, product_id, product_name, quantity, base_price, promotion_price, coupon_discount, final_price, modifier_id, modifier_name) FROM stdin;
1	1	1	TestProduct1_Merch1name	2	2999	1199	0.2	1918	3	Large
2	1	2	TestProduct2_Merch1name	1	3999	\N	\N	3999	\N	\N
3	2	1	TestProduct1_Merch1name	2	2999	1199	0.2	1918	3	Large
4	2	2	TestProduct2_Merch1name	1	3999	\N	\N	3999	\N	\N
5	3	1	TestProduct1_Merch1name	2	2999	1199	0.2	1918	3	Large
6	3	2	TestProduct2_Merch1name	1	3999	\N	\N	3999	\N	\N
7	4	1	TestProduct1_Merch1name	2	2999	1199	0.2	1918	3	Large
8	4	2	TestProduct2_Merch1name	1	3999	\N	\N	3999	\N	\N
9	5	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
10	5	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
11	6	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
12	6	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
13	7	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
14	7	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
15	8	1	TestProduct1_Merch1name	1	2999	1599	0.2	1279	1	Small
16	8	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
17	10	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	1	Small
18	10	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
19	10	3	TestProduct3_Merch1name	1	4999	\N	\N	4999	\N	\N
20	11	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
21	11	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
22	12	1	TestProduct1_Merch1name	1	2999	1599	0.2	1279	1	Small
23	12	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
24	12	3	TestProduct3_Merch1name	2	4999	\N	\N	9998	\N	\N
25	15	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
26	15	3	TestProduct3_Merch1name	1	4999	\N	\N	4999	\N	\N
27	16	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
28	16	3	TestProduct3_Merch1name	1	4999	\N	\N	4999	\N	\N
29	17	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
30	17	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
31	18	1	TestProduct1_Merch1name	2	2999	1599	\N	3198	3	Large
32	18	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
33	19	1	TestProduct1_Merch1name	2	2999	1599	\N	3198	4	Xtra-Large
34	19	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
35	20	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
36	20	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
37	21	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
38	21	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
39	22	1	TestProduct1_Merch1name	1	2999	1599	\N	1599	1	Small
40	22	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
41	23	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
42	23	3	TestProduct3_Merch1name	1	4999	\N	\N	4999	\N	\N
43	25	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
44	25	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
45	26	1	TestProduct1_Merch1name	1	2999	1599	0.25	1199	1	Small
46	26	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
47	27	1	TestProduct1_Merch1name	2	2999	1599	\N	3198	3	Large
48	27	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
49	29	1	TestProduct1_Merch1name	2	2999	1599	\N	2558	3	Large
50	29	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
51	30	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
52	30	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
53	31	1	TestProduct1_Merch1name	1	2999	1599	0.25	1199	1	Small
54	31	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
55	31	3	TestProduct3_Merch1name	1	4999	\N	\N	4999	\N	\N
56	32	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
57	32	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
60	35	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
61	35	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
62	36	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
63	36	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
64	36	3	TestProduct3_Merch1name	4	4999	\N	\N	19996	\N	\N
65	37	1	TestProduct1_Merch1name	2	2999	1599	0.2	2558	3	Large
66	37	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
67	37	3	TestProduct3_Merch1name	4	4999	\N	\N	19996	\N	\N
68	38	1	TestProduct1_Merch1name	1	2999	1399	0.3	979	7	Large
69	38	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
70	38	3	TestProduct3_Merch1name	1	4999	\N	\N	4999	\N	\N
71	39	2	TestProduct2_name	2	3199	\N	\N	6398	\N	\N
72	39	5	TestProduct2_Merch1name	1	3999	\N	\N	3999	\N	\N
73	40	2	TestProduct2_name	2	3199	\N	\N	6398	\N	\N
74	40	5	TestProduct2_Merch1name	1	3999	\N	\N	3999	\N	\N
75	41	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
76	41	5	TestProduct2_Merch1name	2	3999	\N	\N	7998	\N	\N
77	42	2	TestProduct2_name	2	3199	\N	\N	6398	\N	\N
78	42	5	TestProduct2_Merch1name	1	3999	\N	\N	3999	\N	\N
79	43	1	TestProduct1_Merch1name	1	2999	1399	0.3	979	8	Xtra-Large
80	43	2	TestProduct2_name	1	3199	\N	\N	3199	\N	\N
81	43	5	TestProduct2_Merch1name	1	3999	\N	\N	3999	\N	\N
\.


--
-- Data for Name: order_promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_promotions (id, order_id, product_id, promotion_id, promotion_price) FROM stdin;
1	1	1	1	1199
2	2	1	1	1199
3	3	1	1	1199
4	4	1	1	1199
5	5	1	1	1599
6	6	1	1	1599
7	7	1	1	1599
8	8	1	1	1599
9	9	1	1	1599
10	10	1	1	1599
11	11	1	1	1599
12	12	1	1	1599
13	17	1	1	1599
14	18	1	1	1599
15	19	1	1	1599
16	20	1	1	1599
17	21	1	1	1599
18	22	1	1	1599
19	25	1	1	1599
20	26	1	1	1599
21	27	1	1	1599
23	29	1	1	1599
24	30	1	1	1599
25	31	1	1	1599
26	32	1	1	1599
29	35	1	1	1599
30	36	1	1	1599
31	37	1	1	1599
32	38	1	7	1399
33	43	1	7	1399
\.


--
-- Data for Name: order_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_status (id, order_id, status, status_dt, notes) FROM stdin;
1	1	created	2020-11-21 15:22:19.821-06	\N
2	2	created	2020-11-21 15:23:58.289-06	\N
3	3	created	2020-11-21 15:33:51.193-06	\N
4	4	created	2020-11-21 15:34:54.909-06	\N
5	5	created	2020-11-24 14:52:46.693-06	\N
6	6	created	2020-11-27 11:33:30.938-06	\N
7	7	created	2020-11-28 13:07:01.68-06	\N
8	8	created	2020-11-28 19:51:10.939-06	\N
9	10	created	2020-11-28 20:21:25.157-06	\N
10	11	created	2020-11-28 20:34:03.904-06	\N
11	12	created	2020-11-28 20:51:55.053-06	\N
12	15	created	2020-11-28 21:08:18.942-06	\N
13	16	created	2020-11-28 21:25:37.014-06	\N
14	17	created	2020-11-30 15:26:39.082-06	\N
15	18	created	2020-11-30 15:26:44.725-06	\N
16	19	created	2020-11-30 15:26:57.283-06	\N
17	20	created	2020-11-30 15:27:09.343-06	\N
18	21	created	2020-11-30 15:28:56.583-06	\N
19	22	created	2020-11-30 15:33:20.285-06	\N
20	23	created	2020-11-30 15:35:05.458-06	\N
21	25	created	2020-11-30 15:51:23.803-06	\N
22	26	created	2020-11-30 15:53:01.277-06	\N
23	27	created	2020-11-30 16:02:28.948-06	\N
24	29	created	2020-11-30 16:04:02.777-06	\N
25	30	created	2020-11-30 16:04:59.166-06	\N
26	31	created	2020-11-30 16:06:11.285-06	\N
27	32	created	2020-11-30 22:33:31.273-06	\N
28	35	created	2020-12-02 22:09:43.807-06	\N
29	36	created	2020-12-02 22:11:33.496-06	\N
30	37	created	2020-12-02 23:29:41.273-06	\N
31	38	created	2020-12-03 21:46:11.128-06	\N
32	39	created	2020-12-09 13:44:32.67-06	\N
33	40	created	2020-12-09 13:45:26.153-06	\N
34	41	created	2020-12-09 13:50:52.663-06	\N
35	42	created	2020-12-09 13:55:30.111-06	\N
36	43	created	2020-12-09 13:56:29.41-06	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, order_total, remote_payment_id, remote_paymaent_dt, remote_order_id, remote_receipt_id, remote_receipt_url) FROM stdin;
1	1	5917	\N	\N	\N	\N	\N
2	1	5917	\N	\N	\N	\N	\N
3	1	5917	\N	\N	\N	\N	\N
4	1	5917	\N	\N	\N	\N	\N
5	1	5757	\N	\N	\N	\N	\N
6	1	5757	\N	\N	\N	\N	\N
7	1	5757	\N	\N	\N	\N	\N
8	1	4478	\N	\N	\N	\N	\N
9	1	\N	\N	\N	\N	\N	\N
10	1	10756	\N	\N	\N	\N	\N
11	1	5757	\N	\N	\N	\N	\N
12	1	14476	\N	\N	\N	\N	\N
15	1	8198	\N	\N	\N	\N	\N
16	1	8198	\N	\N	\N	\N	\N
17	1	5757	\N	\N	\N	\N	\N
18	1	6397	\N	\N	\N	\N	\N
19	1	6397	\N	\N	\N	\N	\N
20	1	5757	\N	\N	\N	\N	\N
21	1	5757	\N	\N	\N	\N	\N
22	1	4798	\N	\N	\N	\N	\N
23	1	8198	\N	\N	\N	\N	\N
25	1	5757	\N	\N	\N	\N	\N
26	1	4398	\N	\N	\N	\N	\N
27	1	6397	\N	\N	\N	\N	\N
29	1	5757	\N	\N	\N	\N	\N
30	1	5757	\N	\N	\N	\N	\N
31	1	9397	\N	\N	\N	\N	\N
32	1	5757	\N	\N	\N	\N	\N
35	1	5757	\N	\N	\N	\N	\N
36	1	25753	\N	\N	\N	\N	\N
37	1	25753	\N	\N	\N	\N	\N
38	1	9177	\N	\N	\N	\N	\N
39	1	10397	\N	\N	\N	\N	\N
40	1	10397	\N	\N	\N	\N	\N
41	1	11197	\N	\N	\N	\N	\N
42	1	10397	\N	\N	\N	\N	\N
43	1	8177	\N	\N	\N	\N	\N
\.


--
-- Data for Name: product_coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_coupons (id, product_id, code, pct_discount, active) FROM stdin;
1	1	MEMORIALDAY	0.2	t
2	1	BLACKFRIDAY	0.3	f
3	1	FRNDSANDFMLY	0.25	f
4	1	MEMORIALDAY	0.2	t
5	1	BLACKFRIDAY	0.3	f
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, url, alt_text, weight) FROM stdin;
7	1	https://spy.com/wp-content/uploads/2019/07/untitled-1.png	Invicta watch with a blue face	1
8	1	https://spy.com/wp-content/uploads/2019/07/mvmt-arc-automatic-watch-best-mens-watches-2020.jpg?resize=525,525	MVMT Arc Watch	2
9	1	https://spy.com/wp-content/uploads/2019/07/untitled-1-1.png	Bulova watch with a copper face	3
10	1	https://spy.com/wp-content/uploads/2020/05/hamilton-jazzmaster-open-heart-automatic-men_s-watch-h32565135.jpg?resize=525,525	Bulova watch with a copper face	4
11	1	https://spy.com/wp-content/uploads/2019/07/mvmt-black-tan-classic-watch-men.jpg?resize=525,525	MVMT watch with a black face and leather band	5
12	1	https://spy.com/wp-content/uploads/2020/05/tosss.jpg?resize=525,525	Toss watch with a black face chrome steel band	6
\.


--
-- Data for Name: product_meta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_meta (id, product_id, title, description) FROM stdin;
1	1	shirt	clothing type - shirt
2	1	mens	target gender audience
3	1	grey	dominant color
8	2	shirt	clothing type
\.


--
-- Data for Name: product_modifiers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_modifiers (id, product_id, name, description) FROM stdin;
1	1	Small	Size Parameter
2	1	Medium	Size Parameter
3	1	Large	Size Parameter
4	1	Xtra-Large	Size Parameter
5	1	Small	Size Parameter
6	1	Medium	Size Parameter
7	1	Large	Size Parameter
8	1	Xtra-Large	Size Parameter
\.


--
-- Data for Name: product_promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_promotions (id, product_id, promotion_price, active) FROM stdin;
3	2	1199	f
2	1	1199	f
4	1	1199	f
5	1	1199	f
6	1	1399	f
1	1	1599	f
7	1	1399	t
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_reviews (id, product_id, user_id, rating, title, body, review_dt) FROM stdin;
1	1	1	5	Decent Quality	I liked the product	2020-12-01 17:01:59.231-06
2	1	1	5	Decent Quality	I liked the product	2020-12-01 19:21:26.035-06
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, merchant_id, name, description, base_price, avg_rating, qty_ratings, qty_views, qty_purchases, qty_returns) FROM stdin;
4	1	TestProduct1_Merch1name	Test Product 1 Description	2999	5.00000000000000000000	1	0	0	0
3	1	TestProduct3_Merch1name	Test Product 3 Description	4999	0	0	1	0	0
7	2	Merchant2_Product1	This is test product 1 for merchant 2	1899	5	1	40	5	0
8	2	Merchant2_Product3	This is test product 3 for merchant 2	5999	5	4	131	16	0
5	1	TestProduct2_Merch1name	Test Product 2 Description	3999	0	0	16108	55	0
1	1	TestProduct1_Merch1name	Test Product 1 Description	2999	5.0000000000000000	1	13722	10	0
2	1	TestProduct2_name	Test Product 2 Description	3199	0	0	32	145	0
\.


--
-- Data for Name: products_featured; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_featured (id, product_id, merchant_id, feature_set, site_wide) FROM stdin;
1	1	1	favorites	f
2	2	1	favorites	f
3	5	\N	top picks	t
4	2	\N	top picks	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, first_name, last_name) FROM stdin;
2	TestUser2@test.com	$2b$12$u6fG/X80HVV2j6DbIKteBuateUbhqT1RjsiddcBB.zt1vYyMFJHHa	Test	User2
1	TestUser1@test.com	$2b$12$eyiHPWNt0/GuEHRJcKsjee/jZR3QmpFuYuiub40P1Q8Hbutna.B2m	Test	User1Update
7	TestUser5@test.com	$2b$12$Ov1fX0u6bnR7zEuMq/UNVuPd3X/hFumfb2FNwYKtgkRZDMs3Swnsa	Test	User5
\.


--
-- Name: gathering_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gathering_images_id_seq', 1, false);


--
-- Name: gathering_merchants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gathering_merchants_id_seq', 7, true);


--
-- Name: gatherings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gatherings_id_seq', 1, true);


--
-- Name: merchant_about_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.merchant_about_id_seq', 1, true);


--
-- Name: merchant_bios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.merchant_bios_id_seq', 1, false);


--
-- Name: merchant_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.merchant_images_id_seq', 1, false);


--
-- Name: merchants_featured_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.merchants_featured_id_seq', 1, true);


--
-- Name: merchants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.merchants_id_seq', 5, true);


--
-- Name: order_coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_coupons_id_seq', 29, true);


--
-- Name: order_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_products_id_seq', 81, true);


--
-- Name: order_promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_promotions_id_seq', 33, true);


--
-- Name: order_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_status_id_seq', 36, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 43, true);


--
-- Name: product_coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_coupons_id_seq', 6, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 12, true);


--
-- Name: product_meta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_meta_id_seq', 8, true);


--
-- Name: product_modifiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_modifiers_id_seq', 8, true);


--
-- Name: product_promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_promotions_id_seq', 7, true);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_reviews_id_seq', 2, true);


--
-- Name: products_featured_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_featured_id_seq', 4, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: gathering_images gathering_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gathering_images
    ADD CONSTRAINT gathering_images_pkey PRIMARY KEY (id);


--
-- Name: gathering_merchants gathering_merchants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gathering_merchants
    ADD CONSTRAINT gathering_merchants_pkey PRIMARY KEY (id);


--
-- Name: gatherings gatherings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gatherings
    ADD CONSTRAINT gatherings_pkey PRIMARY KEY (id);


--
-- Name: merchant_about merchant_about_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_about
    ADD CONSTRAINT merchant_about_pkey PRIMARY KEY (id);


--
-- Name: merchant_bios merchant_bios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_bios
    ADD CONSTRAINT merchant_bios_pkey PRIMARY KEY (id);


--
-- Name: merchant_images merchant_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_images
    ADD CONSTRAINT merchant_images_pkey PRIMARY KEY (id);


--
-- Name: merchants_featured merchants_featured_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchants_featured
    ADD CONSTRAINT merchants_featured_pkey PRIMARY KEY (id);


--
-- Name: merchants merchants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_pkey PRIMARY KEY (id);


--
-- Name: order_coupons order_coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_coupons
    ADD CONSTRAINT order_coupons_pkey PRIMARY KEY (id);


--
-- Name: order_products order_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_pkey PRIMARY KEY (id);


--
-- Name: order_promotions order_promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotions
    ADD CONSTRAINT order_promotions_pkey PRIMARY KEY (id);


--
-- Name: order_status order_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_coupons product_coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_coupons
    ADD CONSTRAINT product_coupons_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_meta product_meta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_meta
    ADD CONSTRAINT product_meta_pkey PRIMARY KEY (id);


--
-- Name: product_modifiers product_modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_modifiers
    ADD CONSTRAINT product_modifiers_pkey PRIMARY KEY (id);


--
-- Name: product_promotions product_promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_promotions
    ADD CONSTRAINT product_promotions_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: products_featured products_featured_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_featured
    ADD CONSTRAINT products_featured_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: gathering_images gathering_images_gathering_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gathering_images
    ADD CONSTRAINT gathering_images_gathering_id_fkey FOREIGN KEY (gathering_id) REFERENCES public.gatherings(id) ON DELETE CASCADE;


--
-- Name: gathering_merchants gathering_merchants_gathering_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gathering_merchants
    ADD CONSTRAINT gathering_merchants_gathering_id_fkey FOREIGN KEY (gathering_id) REFERENCES public.gatherings(id) ON DELETE CASCADE;


--
-- Name: gathering_merchants gathering_merchants_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gathering_merchants
    ADD CONSTRAINT gathering_merchants_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE;


--
-- Name: gatherings gatherings_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gatherings
    ADD CONSTRAINT gatherings_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE;


--
-- Name: merchant_about merchant_about_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_about
    ADD CONSTRAINT merchant_about_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE;


--
-- Name: merchant_bios merchant_bios_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_bios
    ADD CONSTRAINT merchant_bios_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE;


--
-- Name: merchant_images merchant_images_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant_images
    ADD CONSTRAINT merchant_images_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE;


--
-- Name: merchants_featured merchants_featured_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchants_featured
    ADD CONSTRAINT merchants_featured_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE;


--
-- Name: order_coupons order_coupons_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_coupons
    ADD CONSTRAINT order_coupons_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.product_coupons(id) ON DELETE SET NULL;


--
-- Name: order_coupons order_coupons_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_coupons
    ADD CONSTRAINT order_coupons_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_coupons order_coupons_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_coupons
    ADD CONSTRAINT order_coupons_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: order_products order_products_modifier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_modifier_id_fkey FOREIGN KEY (modifier_id) REFERENCES public.product_modifiers(id) ON DELETE SET NULL;


--
-- Name: order_products order_products_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_products order_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: order_promotions order_promotions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotions
    ADD CONSTRAINT order_promotions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_promotions order_promotions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotions
    ADD CONSTRAINT order_promotions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: order_promotions order_promotions_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotions
    ADD CONSTRAINT order_promotions_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.product_promotions(id) ON DELETE SET NULL;


--
-- Name: order_status order_status_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_coupons product_coupons_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_coupons
    ADD CONSTRAINT product_coupons_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_meta product_meta_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_meta
    ADD CONSTRAINT product_meta_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_modifiers product_modifiers_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_modifiers
    ADD CONSTRAINT product_modifiers_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_promotions product_promotions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_promotions
    ADD CONSTRAINT product_promotions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products_featured products_featured_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_featured
    ADD CONSTRAINT products_featured_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE;


--
-- Name: products_featured products_featured_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_featured
    ADD CONSTRAINT products_featured_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

