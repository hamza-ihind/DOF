import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually if process.env.DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value.trim();
        }
      });
    }
  } catch (e) {
    console.warn('Failed to parse .env.local file:', e);
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes('placeholder')) {
  console.error('Error: DATABASE_URL is not configured in environment or .env.local');
  process.exit(1);
}

const sql = neon(dbUrl);

export async function initDatabase() {
  console.log('🚀 Initializing Neon PostgreSQL database schema...');

  // 1. Members Table
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      photo_url VARCHAR(500) NOT NULL,
      bio TEXT,
      location VARCHAR(255) DEFAULT 'Biougra, Morocco',
      tier INTEGER DEFAULT 3,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 2. Events Table
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      location VARCHAR(255) NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      impact_summary VARCHAR(255),
      timeline_days JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 3. Event Members Junction Table
  await sql`
    CREATE TABLE IF NOT EXISTS event_members (
      event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
      member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
      PRIMARY KEY (event_id, member_id)
    )
  `;

  // 4. Contact Form Messages Table
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255),
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  console.log('✅ All database tables created and ready for operations!');
}

initDatabase().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
