-- Neon PostgreSQL Database Schema for Defenders of Future (Biougra, Morocco)

-- 1. Members Table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    bio TEXT,
    location VARCHAR(255) DEFAULT 'Biougra, Morocco',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Events / Activities Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'School Refurbishment', 'Food Package Distribution', 'Spring of Life Well Drilling'
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    impact_summary VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Event Members Junction Table (Contributing members to specific events)
CREATE TABLE IF NOT EXISTS event_members (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, member_id)
);

-- 4. Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE members ADD COLUMN IF NOT EXISTS role_en VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS role_fr VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS bio_en TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bio_fr TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS timeline_days JSONB DEFAULT '[]'::jsonb;
CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(254) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','rejected')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, role TEXT NOT NULL CHECK (role IN ('admin','member')),
 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL,
 CHECK ((role = 'admin' AND user_id IS NULL) OR (role = 'member' AND user_id IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at TIMESTAMPTZ NOT NULL);
CREATE TABLE IF NOT EXISTS transactions (
 id SERIAL PRIMARY KEY, member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
 member_name VARCHAR(255) NOT NULL, amount NUMERIC(10,2) NOT NULL CHECK (amount > 0), date DATE NOT NULL,
 notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id);
CREATE TABLE IF NOT EXISTS newsletters (
 id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, summary VARCHAR(1000) NOT NULL, content TEXT NOT NULL,
 published BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), published_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
 id SERIAL PRIMARY KEY, email VARCHAR(254) UNIQUE NOT NULL, confirmed BOOLEAN NOT NULL DEFAULT FALSE,
 token_hash TEXT NOT NULL, token_expires_at TIMESTAMPTZ NOT NULL, unsubscribe_hash TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS newsletter_deliveries (
 newsletter_id INTEGER REFERENCES newsletters(id) ON DELETE CASCADE,
 subscriber_id INTEGER REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
 sent_at TIMESTAMPTZ, PRIMARY KEY (newsletter_id, subscriber_id)
);

-- Upgrade installations with the former newsletter-card schema.
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS summary VARCHAR(1000) NOT NULL DEFAULT '';
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '';
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NOT NULL DEFAULT '';
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS link_url VARCHAR(500) NOT NULL DEFAULT '';
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE newsletters ALTER COLUMN description SET DEFAULT '';
ALTER TABLE newsletters ALTER COLUMN image_url SET DEFAULT '';
ALTER TABLE newsletters ALTER COLUMN link_url SET DEFAULT '';
ALTER TABLE newsletters ALTER COLUMN date SET DEFAULT CURRENT_DATE;
UPDATE newsletters SET summary = LEFT(description,1000), content = description WHERE summary = '' AND content = '' AND description <> '';
