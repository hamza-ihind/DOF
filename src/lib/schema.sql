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
