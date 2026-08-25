import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Parse .env manually if process.env.DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    const targetPath = fs.existsSync(envPath) ? envPath : envLocalPath;
    if (fs.existsSync(targetPath)) {
      const envContent = fs.readFileSync(targetPath, 'utf8');
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
    console.warn('Failed to parse .env file:', e);
  }
}

const names = [
  "HAJAR AMZIL",
  "YOUNESSE RABIA",
  "ANAS TAOUFIQ",
  "IMANE ZAHMAR",
  "ENNADERY MOHAMED",
  "BADIAA AZOUGHARE",
  "OUSSAMA SAIDI",
  "AÏCHA MOUAK",
  "FADMA ZAFATI",
  "YASSINE AMLIL",
  "MARYAM ZOUAIHAR",
  "YOUSSEF BENTABJAOUTE",
  "NADIA EL MESSAOUDI",
  "OUMAIMA BOUFI",
  "AYA EL HAFI",
  "HIBA JOUH",
  "LAILA BENYAHYA",
  "YOUNESS OUAOULMEST",
  "MARWA OULEDALLA",
  "TARIQ JALLOUNI",
  "EL FARIS IKRAM",
  "HAMZA IHIND",
  "SAAIDA AIT EL HOUSSINE",
  "SOUAD ELMAMOUN",
  "HAJAR ABOU EL OUAFA",
  "HICHAM BENTABJAOUTE",
  "DOUNIA FAKAK",
  "HAJAR OUAKRIM",
  "ELGHAZOUANI NOUR ELHOUDA",
  "HAFSA ES-SABBAR",
  "MOHAMED OUKHAYI",
  "MOHAMED REDA",
  "ILHAM BOUAOUD",
  "AIMAD BARIK",
  "KENZA BOULMANI",
  "KHAZIZ ZAHRA",
  "SOFIA BOUSRAF",
  "FATIHA BOUSRAF",
  "MARIAM GOULAHSEN",
  "NOUAMANE EL KHARRAJE",
  "FATIMA OULEDALLA",
  "FADMA AIT EL HOUSSINE",
  "GHITA AIT EL HOUSSINE",
  "ASMA OUAKRIM",
  "YASSINE MAYOUNE"
];

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes('placeholder')) {
  console.error('Error: DATABASE_URL is not configured');
  process.exit(1);
}

const sql = neon(dbUrl);

async function seed() {
  console.log('Ensuring table exists...');
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

  // Get existing members to avoid duplicate names if already present
  const existing = await sql`SELECT name FROM members`;
  const existingNames = new Set(existing.map(m => m.name));

  let insertedCount = 0;
  for (const name of names) {
    if (!existingNames.has(name)) {
      await sql`
        INSERT INTO members (name, role, photo_url, bio, location, tier)
        VALUES (
          ${name},
          'Membre',
          '/images/member_1.jpg',
          'Membre de l''association Defenders of Future.',
          'Biougra, Morocco',
          3
        )
      `;
      insertedCount++;
    }
  }
  console.log(`Successfully seeded ${insertedCount} new members into Neon DB! Total existing before seed: ${existing.length}`);
}

seed().catch(err => {
  console.error('Error seeding members:', err);
  process.exit(1);
});
