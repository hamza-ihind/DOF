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

const photoMembers = [
  {
    name: "YOUSSEF BENTABJAOUTE",
    role: "President",
    roleEn: "President",
    roleFr: "Président",
    photoUrl: "/images/members/youssef_bentabjaoute.jpg",
    bio: "Guiding our association with dedication to bring tangible and lasting solutions to our villages.",
    bioEn: "Guiding our association with dedication to bring tangible and lasting solutions to our villages.",
    bioFr: "Guider l'association avec dévouement pour apporter des solutions concrètes et durables à nos villages.",
    location: "Biougra, Morocco",
    tier: 1
  },
  {
    name: "LAILA BENYAHYA",
    role: "Secretary General",
    roleEn: "Secretary General",
    roleFr: "Secrétaire Générale",
    photoUrl: "/images/members/leila_benyahya.png",
    bio: "Coordinating our missions and ensuring transparent governance in service of all.",
    bioEn: "Coordinating our missions and ensuring transparent governance in service of all.",
    bioFr: "Coordonner nos engagements associatifs et assurer une gouvernance transparente au service de tous.",
    location: "Biougra, Morocco",
    tier: 1
  },
  {
    name: "IMANE ZAHMAR",
    role: "Vice-Treasurer",
    roleEn: "Vice-Treasurer",
    roleFr: "Vice-trésorière",
    photoUrl: "/images/members/imane_zahmar.png",
    bio: "Managing every resource with rigor to maximize the direct impact of our charitable actions.",
    bioEn: "Managing every resource with rigor to maximize the direct impact of our charitable actions.",
    bioFr: "Gérer chaque ressource avec rigueur pour maximiser l'impact direct de nos actions caritatives.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "AIMAD BARIK",
    role: "Project Director",
    roleEn: "Project Director",
    roleFr: "Directeur de Projet",
    photoUrl: "/images/members/aimad_barik.png",
    bio: "Leading our school renovation and deep well drilling projects with precision and care.",
    bioEn: "Leading our school renovation and deep well drilling projects with precision and care.",
    bioFr: "Piloter nos chantiers de rénovation et de forage avec exigence et professionnalisme.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "ENNADERY MOHAMED",
    role: "Repairs Manager",
    roleEn: "Repairs Manager",
    roleFr: "Responsable des Travaux & Réparations",
    photoUrl: "/images/members/mohamed_ennadiry.png",
    bio: "Repairing, building, and transforming every classroom to provide children with a dignified learning space.",
    bioEn: "Repairing, building, and transforming every classroom to provide children with a dignified learning space.",
    bioFr: "Réparer, bâtir et transformer chaque salle de classe pour offrir un cadre d'étude digne aux enfants.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "OUSSAMA SAIDI",
    role: "Sports Activities Coordinator",
    roleEn: "Sports Activities Coordinator",
    roleFr: "Coordinateur des Activités Sportives",
    photoUrl: "/images/members/oussama_saidi.png",
    bio: "Sports inspire fulfillment, strong team spirit, and joy for the youth of our community.",
    bioEn: "Sports inspire fulfillment, strong team spirit, and joy for the youth of our community.",
    bioFr: "Le sport est un vecteur d'épanouissement, d'esprit d'équipe et de joie pour notre jeunesse.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "AÏCHA MOUAK",
    role: "Art & Painting Coordinator",
    roleEn: "Art & Painting Coordinator",
    roleFr: "Coordinatrice Art & Peinture",
    photoUrl: "/images/members/aicha_fakkak.png",
    bio: "Bringing vibrant colors and creativity into schools to awaken the children's dreams.",
    bioEn: "Bringing vibrant colors and creativity into schools to awaken the children's dreams.",
    bioFr: "Mettre des couleurs et de la créativité dans le quotidien des écoliers pour éveiller leurs rêves.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "HICHAM BENTABJAOUTE",
    role: "Active Member",
    roleEn: "Active Member",
    roleFr: "Membre Actif",
    photoUrl: "/images/members/hicham_bentabjaoute.png",
    bio: "Working hand in hand on the ground to deliver impactful community initiatives.",
    bioEn: "Working hand in hand on the ground to deliver impactful community initiatives.",
    bioFr: "Travailler main dans la main pour concrétiser des projets porteurs d'espoir pour nos villages.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "DOUNIA FAKAK",
    role: "Active Member",
    roleEn: "Active Member",
    roleFr: "Membre Actif",
    photoUrl: "/images/members/Dounia_fakkak.png",
    bio: "Active solidarity is the most meaningful way to support and uplift our local region.",
    bioEn: "Active solidarity is the most meaningful way to support and uplift our local region.",
    bioFr: "La solidarité active est la plus belle manière d'exprimer notre attachement à notre région.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "TARIQ JALLOUNI",
    role: "Active Member",
    roleEn: "Active Member",
    roleFr: "Membre Actif",
    photoUrl: "/images/members/tariq_jallouni.png",
    bio: "Always ready in the field to address vital needs and support rural families.",
    bioEn: "Always ready in the field to address vital needs and support rural families.",
    bioFr: "Toujours prêt à agir sur le terrain pour répondre aux besoins vitaux des familles rurales.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "KENZA BOULMANI",
    role: "Active Member",
    roleEn: "Active Member",
    roleFr: "Membre Actif",
    photoUrl: "/images/members/kenza_boulmani.png",
    bio: "Dedication and positive energy are key to spreading hope and encouraging solidarity.",
    bioEn: "Dedication and positive energy are key to spreading hope and encouraging solidarity.",
    bioFr: "Donner de son temps et de son énergie pour semer l'espoir et encourager les initiatives solidaires.",
    location: "Biougra, Morocco",
    tier: 3
  }
];

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes('placeholder')) {
  console.error('Error: DATABASE_URL is not configured');
  process.exit(1);
}

const sql = neon(dbUrl);

async function sync() {
  console.log('1. Ensuring columns exist in members table...');
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS role_fr VARCHAR(255)`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS role_en VARCHAR(255)`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS bio_fr TEXT`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS bio_en TEXT`;

  console.log('2. Removing all members not in the photo list...');
  const keepNames = photoMembers.map(m => m.name);
  await sql`DELETE FROM members WHERE name != ALL(${keepNames})`;

  console.log('3. Updating/inserting photo members...');
  for (const m of photoMembers) {
    const existing = await sql`SELECT id FROM members WHERE name = ${m.name}`;
    if (existing.length > 0) {
      await sql`
        UPDATE members
        SET role = ${m.role},
            role_en = ${m.roleEn},
            role_fr = ${m.roleFr},
            photo_url = ${m.photoUrl},
            bio = ${m.bio},
            bio_en = ${m.bioEn},
            bio_fr = ${m.bioFr},
            location = ${m.location},
            tier = ${m.tier}
        WHERE id = ${existing[0].id}
      `;
      console.log(`Updated: ${m.name} (${m.roleEn} / ${m.roleFr})`);
    } else {
      await sql`
        INSERT INTO members (name, role, role_en, role_fr, photo_url, bio, bio_en, bio_fr, location, tier)
        VALUES (${m.name}, ${m.role}, ${m.roleEn}, ${m.roleFr}, ${m.photoUrl}, ${m.bio}, ${m.bioEn}, ${m.bioFr}, ${m.location}, ${m.tier})
      `;
      console.log(`Inserted: ${m.name} (${m.roleEn} / ${m.roleFr})`);
    }
  }

  const allInDb = await sql`SELECT id, name, role, role_en, role_fr, photo_url FROM members ORDER BY tier ASC, id ASC`;
  console.log(`\n✅ Database currently has ${allInDb.length} members:`);
  allInDb.forEach(r => console.log(`- [Tier] ${r.name}: ${r.role} | Photo: ${r.photo_url}`));
}

sync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
