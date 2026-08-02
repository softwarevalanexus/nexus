
-- ============ RESELLER DOMAIN ============
CREATE TABLE public.resellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  tier text NOT NULL DEFAULT 'Silver',
  region text NOT NULL,
  country text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Active',
  mrr_cents bigint NOT NULL DEFAULT 0,
  growth_pct numeric NOT NULL DEFAULT 0,
  contact_email text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  onboarded_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reseller_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  company text NOT NULL,
  region text NOT NULL,
  tier_requested text NOT NULL DEFAULT 'Silver',
  status text NOT NULL DEFAULT 'Review',
  reviewer_notes text NOT NULL DEFAULT '',
  submitted_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reseller_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES public.resellers(id) ON DELETE CASCADE,
  period text NOT NULL,
  amount_cents bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  paid_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reseller_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES public.resellers(id) ON DELETE CASCADE,
  subject text NOT NULL,
  priority text NOT NULL DEFAULT 'Normal',
  status text NOT NULL DEFAULT 'Open',
  opened_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reseller_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES public.resellers(id) ON DELETE CASCADE,
  rule text NOT NULL,
  state text NOT NULL DEFAULT 'Pass',
  notes text NOT NULL DEFAULT '',
  checked_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ FRANCHISE DOMAIN ============
CREATE TABLE public.franchises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  region text NOT NULL,
  city text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  locations int NOT NULL DEFAULT 1,
  mrr_cents bigint NOT NULL DEFAULT 0,
  royalty_pct numeric NOT NULL DEFAULT 8,
  status text NOT NULL DEFAULT 'Active',
  owner_name text NOT NULL DEFAULT '',
  owner_email text NOT NULL DEFAULT '',
  opened_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.franchise_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  applicant text NOT NULL,
  territory text NOT NULL,
  investment_cents bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Review',
  submitted_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.franchise_royalties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id uuid REFERENCES public.franchises(id) ON DELETE CASCADE,
  period text NOT NULL,
  gross_cents bigint NOT NULL DEFAULT 0,
  royalty_cents bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Due',
  due_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.franchise_territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text NOT NULL,
  country text NOT NULL DEFAULT '',
  exclusivity text NOT NULL DEFAULT 'Exclusive',
  franchise_id uuid REFERENCES public.franchises(id) ON DELETE SET NULL,
  population bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.franchise_escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id uuid REFERENCES public.franchises(id) ON DELETE CASCADE,
  issue text NOT NULL,
  severity text NOT NULL DEFAULT 'Medium',
  status text NOT NULL DEFAULT 'Open',
  opened_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.franchise_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id uuid REFERENCES public.franchises(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Associate',
  status text NOT NULL DEFAULT 'Active',
  joined_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ GRANTS + RLS ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'resellers','reseller_applications','reseller_payouts','reseller_tickets','reseller_compliance',
    'franchises','franchise_applications','franchise_royalties','franchise_territories',
    'franchise_escalations','franchise_staff'
  ]) LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "%s_read" ON public.%I FOR SELECT USING (true)', t, t);
    EXECUTE format('CREATE POLICY "%s_write" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t, t);
    EXECUTE format('CREATE TRIGGER set_%s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t, t);
  END LOOP;
END $$;

-- ============ SEED ============
INSERT INTO public.resellers (code, name, tier, region, country, status, mrr_cents, growth_pct, contact_email, contact_phone, onboarded_at) VALUES
('RES-101','Vertex Systems','Gold','APAC','India','Active',420000,18.4,'channel@vertexsystems.in','+91 22 4009 1120','2024-03-11'),
('RES-102','Northwind Digital','Silver','EMEA','Germany','Active',185000,7.2,'partners@northwind.de','+49 30 5510 2288','2024-06-02'),
('RES-103','Cascade Cloud','Platinum','NA','United States','Active',760000,24.1,'alliances@cascadecloud.com','+1 415 220 8890','2023-11-20'),
('RES-104','Andes Software','Silver','LATAM','Brazil','Onboarding',94000,3.8,'canal@andessoftware.br','+55 11 3040 7712','2025-01-15'),
('RES-105','Sahara Tech Group','Gold','MEA','UAE','Active',310000,12.6,'partner@saharatech.ae','+971 4 552 3390','2024-08-27'),
('RES-106','Baltic Nexus','Bronze','EMEA','Poland','Suspended',42000,-6.1,'hello@balticnexus.pl','+48 22 116 4408','2024-02-09');

INSERT INTO public.reseller_applications (code, company, region, tier_requested, status, reviewer_notes, submitted_at) VALUES
('APP-R01','Helix Partners','NA','Gold','Review','Financials received, pending legal check.','2026-07-18'),
('APP-R02','Kyoto Integrations','APAC','Silver','Review','Awaiting territory conflict clearance.','2026-07-22'),
('APP-R03','Atlas Bureau','EMEA','Bronze','Approved','Approved for pilot quarter.','2026-06-30'),
('APP-R04','Rio Channel Co','LATAM','Silver','Rejected','Insufficient technical staffing.','2026-06-11');

INSERT INTO public.reseller_payouts (reseller_id, period, amount_cents, status, paid_at)
SELECT id, '2026-06', (mrr_cents * 0.18)::bigint, 'Paid', '2026-07-05' FROM public.resellers WHERE status = 'Active';
INSERT INTO public.reseller_payouts (reseller_id, period, amount_cents, status, paid_at)
SELECT id, '2026-07', (mrr_cents * 0.18)::bigint, 'Pending', NULL FROM public.resellers WHERE status = 'Active';

INSERT INTO public.reseller_tickets (reseller_id, subject, priority, status, opened_at)
SELECT id, 'Deal registration conflict on enterprise bid', 'High', 'Open', '2026-07-28' FROM public.resellers WHERE code = 'RES-101';
INSERT INTO public.reseller_tickets (reseller_id, subject, priority, status, opened_at)
SELECT id, 'Portal SSO login failure for 3 seats', 'Normal', 'In Progress', '2026-07-25' FROM public.resellers WHERE code = 'RES-103';
INSERT INTO public.reseller_tickets (reseller_id, subject, priority, status, opened_at)
SELECT id, 'Commission statement mismatch for June', 'High', 'Open', '2026-07-30' FROM public.resellers WHERE code = 'RES-105';
INSERT INTO public.reseller_tickets (reseller_id, subject, priority, status, opened_at)
SELECT id, 'Onboarding certification extension request', 'Low', 'Resolved', '2026-07-09' FROM public.resellers WHERE code = 'RES-104';

INSERT INTO public.reseller_compliance (reseller_id, rule, state, notes, checked_at)
SELECT id, 'Signed channel agreement on file', 'Pass', 'Countersigned copy archived.', '2026-07-01' FROM public.resellers;
INSERT INTO public.reseller_compliance (reseller_id, rule, state, notes, checked_at)
SELECT id, 'Certified engineers >= 2', CASE WHEN tier IN ('Bronze','Silver') THEN 'At Risk' ELSE 'Pass' END,
       'Quarterly certification audit.', '2026-07-15' FROM public.resellers;
INSERT INTO public.reseller_compliance (reseller_id, rule, state, notes, checked_at)
SELECT id, 'Brand usage guidelines followed', CASE WHEN status = 'Suspended' THEN 'Fail' ELSE 'Pass' END,
       'Website and collateral review.', '2026-07-20' FROM public.resellers;

INSERT INTO public.franchises (code, name, region, city, country, locations, mrr_cents, royalty_pct, status, owner_name, owner_email, opened_at) VALUES
('FR-201','Software Vala Mumbai','APAC','Mumbai','India',4,880000,9,'Active','Rohit Desai','rohit@svmumbai.in','2024-04-01'),
('FR-202','Software Vala Berlin','EMEA','Berlin','Germany',2,540000,8,'Active','Lena Krüger','lena@svberlin.de','2024-09-16'),
('FR-203','Software Vala Austin','NA','Austin','United States',3,690000,8.5,'Active','Marcus Hale','marcus@svaustin.com','2023-10-05'),
('FR-204','Software Vala São Paulo','LATAM','São Paulo','Brazil',1,210000,7.5,'Onboarding','Ana Ribeiro','ana@svsaopaulo.br','2026-05-12'),
('FR-205','Software Vala Dubai','MEA','Dubai','UAE',2,470000,9,'Active','Yusuf Al-Farsi','yusuf@svdubai.ae','2024-12-02'),
('FR-206','Software Vala Pune','APAC','Pune','India',1,120000,7,'Probation','Nikhil Joshi','nikhil@svpune.in','2025-08-19');

INSERT INTO public.franchise_applications (code, applicant, territory, investment_cents, status, submitted_at) VALUES
('APP-F01','Sundara Ventures','Chennai, India',7500000,'Review','2026-07-14'),
('APP-F02','Nordic Growth AB','Stockholm, Sweden',9200000,'Review','2026-07-21'),
('APP-F03','Cape Digital Trust','Cape Town, South Africa',6100000,'Approved','2026-06-27'),
('APP-F04','Lakeside Holdings','Toronto, Canada',8800000,'Withdrawn','2026-05-30');

INSERT INTO public.franchise_royalties (franchise_id, period, gross_cents, royalty_cents, status, due_date)
SELECT id, '2026-06', mrr_cents, (mrr_cents * royalty_pct / 100)::bigint, 'Paid', '2026-07-10' FROM public.franchises WHERE status <> 'Onboarding';
INSERT INTO public.franchise_royalties (franchise_id, period, gross_cents, royalty_cents, status, due_date)
SELECT id, '2026-07', mrr_cents, (mrr_cents * royalty_pct / 100)::bigint, 'Due', '2026-08-10' FROM public.franchises WHERE status <> 'Onboarding';

INSERT INTO public.franchise_territories (name, region, country, exclusivity, franchise_id, population, status)
SELECT 'Greater ' || city, region, country, 'Exclusive', id, 12000000, 'Assigned' FROM public.franchises;
INSERT INTO public.franchise_territories (name, region, country, exclusivity, population, status) VALUES
('Chennai Metro','APAC','India','Exclusive',11500000,'Open'),
('Stockholm County','EMEA','Sweden','Exclusive',2400000,'Reserved'),
('Cape Town Metro','MEA','South Africa','Non-exclusive',4700000,'Open');

INSERT INTO public.franchise_escalations (franchise_id, issue, severity, status, opened_at)
SELECT id, 'Royalty reconciliation dispute for Q2', 'High', 'Open', '2026-07-26' FROM public.franchises WHERE code = 'FR-206';
INSERT INTO public.franchise_escalations (franchise_id, issue, severity, status, opened_at)
SELECT id, 'Brand compliance gap at second location', 'Medium', 'In Progress', '2026-07-19' FROM public.franchises WHERE code = 'FR-202';
INSERT INTO public.franchise_escalations (franchise_id, issue, severity, status, opened_at)
SELECT id, 'Customer SLA breach escalated by enterprise account', 'Critical', 'Open', '2026-07-31' FROM public.franchises WHERE code = 'FR-203';

INSERT INTO public.franchise_staff (franchise_id, name, role, status, joined_at)
SELECT id, owner_name, 'Franchise Owner', 'Active', opened_at FROM public.franchises;
INSERT INTO public.franchise_staff (franchise_id, name, role, status, joined_at)
SELECT id, 'Operations Lead — ' || city, 'Operations Lead', 'Active', opened_at + 30 FROM public.franchises;
INSERT INTO public.franchise_staff (franchise_id, name, role, status, joined_at)
SELECT id, 'Support Specialist — ' || city, 'Support Specialist', 'Active', opened_at + 60 FROM public.franchises;
