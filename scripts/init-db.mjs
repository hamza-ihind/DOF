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

const INITIAL_MEMBERS = [
  {
    id: 1,
    name: "Youssef El Amrani",
    role: "President & Field Director",
    photoUrl: "/images/member_1.jpg",
    bio: "Passionate community leader based in Biougra, guiding strategy and overall operations across Chtouka Aït Baha.",
    location: "Biougra, Morocco",
    tier: 1
  },
  {
    id: 6,
    name: "Dr. Laila Alami",
    role: "Vice President",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Co-founding director focused on external partnerships, village outreach planning, and humanitarian affairs.",
    location: "Biougra, Morocco",
    tier: 1
  },
  {
    id: 2,
    name: "Amina Bensaid",
    role: "Educational Supplies Director",
    photoUrl: "/images/member_2.jpg",
    bio: "Oversees school refurbishment standards, wall painting logistics, and educational kit preparation.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    id: 3,
    name: "Omar Chraibi",
    role: "Spring of Life Water Lead",
    photoUrl: "/images/member_3.jpg",
    bio: "Civil engineering specialist coordinating site surveys, expert consultations, and deep well drilling operations.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    id: 4,
    name: "Khadija Ouazzani",
    role: "Food Drive Logistics Manager",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Leads pre-visit family size census data collection to tailor flour, food staples, and hygiene packages.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    id: 5,
    name: "Hassan Tazi",
    role: "Renovation Technical Supervisor",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "Expert tradesperson leading wall sanding, ceiling and floor repairs, and indoor mural work.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    id: 7,
    name: "Karim Mansouri",
    role: "Field Logistics & Transport",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "Coordinates heavy supply transport and terrain navigation across mountain roads.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    id: 8,
    name: "Zineb Berrada",
    role: "Youth Activities & Art Lead",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Organizes interactive art workshops and educational games during school makeover visits.",
    location: "Biougra, Morocco",
    tier: 3
  }
];

const INITIAL_EVENTS = [
  {
    id: 1,
    slug: "school-refurbishment-douar-ait-yassin",
    title: "School Refurbishment & Supplies Mission at Douar Aït Yassin",
    category: "School Refurbishment",
    date: "2026-07-15",
    location: "Douar Aït Yassin, Biougra Region",
    imageUrl: "/images/school_renovation.jpg",
    excerpt: "Volunteers sanded walls, repaired damaged ceilings, painted vibrant educational murals, and provided 120 backpacks loaded with notebooks, pens, and art materials.",
    content: "Our team visited Douar Aït Yassin to completely transform the elementary school environment.",
    impactSummary: "120 Students Equipped • 4 Classrooms Fully Restored",
    contributingMemberIds: [1, 2, 5, 8],
    timelineDays: [
      {
        dayNumber: 1,
        title: "Day 1: Site Prep, Wall Sanding & Ceiling Repairs",
        date: "2026-07-15",
        description: "The team arrived early in Douar Aït Yassin. Volunteers cleared classrooms, sanded cracked walls down to smooth plaster, repaired leaking ceiling panels, and prepared surfaces for fresh coats of paint.",
        images: [
          "/images/school_renovation.jpg",
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        dayNumber: 2,
        title: "Day 2: Repainting & Educational Mural Art",
        date: "2026-07-16",
        description: "Coats of bright protective paint were applied across all classrooms. Art leads painted educational alphabets, maps, and motivational murals on primary walls.",
        images: [
          "/images/school_renovation.jpg",
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        dayNumber: 3,
        title: "Day 3: School Kit Distribution & Classroom Setup",
        date: "2026-07-17",
        description: "Desks were reassembled. Each student received a new backpack stuffed with notebooks, pens, geometry sets, and art kits.",
        images: [
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
          "/images/school_renovation.jpg"
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "food-and-essential-package-distribution-ait-baha",
    title: "Essential Food Package & Soap Distribution Drive",
    category: "Food Package Distribution",
    date: "2026-06-28",
    location: "Highland Villages near Biougra",
    imageUrl: "/images/food_distribution.jpg",
    excerpt: "Delivered customized packages containing high-grade flour, cooking oil, tea, sugar, and hygiene soaps to 85 families based on prior village census data.",
    content: "Prior to our visit, Defenders of Future conducted a thorough household survey to determine exact family sizes and nutritional needs.",
    impactSummary: "85 Families Supported • 420+ Individuals Nourished",
    contributingMemberIds: [1, 4, 7],
    timelineDays: [
      {
        dayNumber: 1,
        title: "Day 1: Family Census & Procurement",
        date: "2026-06-28",
        description: "Gathered family size data to calculate necessary flour and soap ratios.",
        images: [
          "/images/food_distribution.jpg",
          "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        dayNumber: 2,
        title: "Day 2: Sorting, Packing & Direct Delivery",
        date: "2026-06-29",
        description: "Volunteers packaged 85 large relief bundles and delivered sacks directly to family doorsteps.",
        images: [
          "/images/food_distribution.jpg",
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ]
  },
  {
    id: 3,
    slug: "spring-of-life-well-drilling-initiative",
    title: "Spring of Life: Well Drilling bringing Water to Village Inhabitants",
    category: "Spring of Life Well Drilling",
    date: "2026-05-10",
    location: "Village Tizi, Biougra District",
    imageUrl: "/images/well_drilling.jpg",
    excerpt: "Under the banner 'Spring of Life', our association consulted hydrology experts, selected the optimal location, and drilled a 110-meter deep water well.",
    content: "Clean water brings new life to rural communities.",
    impactSummary: "110-Meter Well Drilled • Daily Clean Water for 350+ Villagers",
    contributingMemberIds: [1, 3, 6],
    timelineDays: [
      {
        dayNumber: 1,
        title: "Day 1: Geotechnical Survey & Drilling Setup",
        date: "2026-05-10",
        description: "Hydrology testing completed and heavy drilling rig positioned.",
        images: [
          "/images/well_drilling.jpg",
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        dayNumber: 2,
        title: "Day 2: Deep Drilling & Aquifer Access",
        date: "2026-05-11",
        description: "Drilling reached 110 meters into clean water reserves.",
        images: [
          "/images/well_drilling.jpg"
        ]
      }
    ]
  }
];

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

  console.log('✅ Database tables ensured.');

  // 5. Seed Members if empty
  const existingMembers = await sql`SELECT COUNT(*) as count FROM members`;
  if (parseInt(existingMembers[0].count, 10) === 0) {
    console.log('🌱 Seeding initial members...');
    for (const m of INITIAL_MEMBERS) {
      await sql`
        INSERT INTO members (id, name, role, photo_url, bio, location, tier)
        VALUES (${m.id}, ${m.name}, ${m.role}, ${m.photoUrl}, ${m.bio}, ${m.location}, ${m.tier})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          photo_url = EXCLUDED.photo_url,
          bio = EXCLUDED.bio,
          location = EXCLUDED.location,
          tier = EXCLUDED.tier
      `;
    }
    await sql`SELECT setval(pg_get_serial_sequence('members', 'id'), COALESCE(MAX(id), 1)) FROM members`;
    console.log(`✅ ${INITIAL_MEMBERS.length} members inserted.`);
  } else {
    console.log(`ℹ️ Members table already has ${existingMembers[0].count} records.`);
  }

  // 6. Seed Events if empty
  const existingEvents = await sql`SELECT COUNT(*) as count FROM events`;
  if (parseInt(existingEvents[0].count, 10) === 0) {
    console.log('🌱 Seeding initial events...');
    for (const e of INITIAL_EVENTS) {
      await sql`
        INSERT INTO events (id, slug, title, category, date, location, image_url, excerpt, content, impact_summary, timeline_days)
        VALUES (${e.id}, ${e.slug}, ${e.title}, ${e.category}, ${e.date}, ${e.location}, ${e.imageUrl}, ${e.excerpt}, ${e.content}, ${e.impactSummary}, ${JSON.stringify(e.timelineDays)})
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          date = EXCLUDED.date,
          location = EXCLUDED.location,
          image_url = EXCLUDED.image_url,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          impact_summary = EXCLUDED.impact_summary,
          timeline_days = EXCLUDED.timeline_days
      `;

      for (const memberId of e.contributingMemberIds) {
        await sql`
          INSERT INTO event_members (event_id, member_id)
          VALUES (${e.id}, ${memberId})
          ON CONFLICT (event_id, member_id) DO NOTHING
        `;
      }
    }
    await sql`SELECT setval(pg_get_serial_sequence('events', 'id'), COALESCE(MAX(id), 1)) FROM events`;
    console.log(`✅ ${INITIAL_EVENTS.length} events inserted.`);
  } else {
    console.log(`ℹ️ Events table already has ${existingEvents[0].count} records.`);
  }

  console.log('🎉 Database initialization complete!');
}

initDatabase().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
