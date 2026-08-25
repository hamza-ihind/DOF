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

const membersData = [
  {
    name: "YOUSSEF BENTABJAOUTE",
    role: "President",
    photoUrl: "/images/members/youssef_bentabjaoute.jpg",
    bio: "Guider l'association avec dévouement pour apporter des solutions concrètes et durables à nos villages.",
    location: "Biougra, Morocco",
    tier: 1
  },
  {
    name: "LAILA BENYAHYA",
    role: "Secretary General",
    photoUrl: "/images/members/leila_benyahya.png",
    bio: "Coordonner nos engagements associatifs et assurer une gouvernance transparente au service de tous.",
    location: "Biougra, Morocco",
    tier: 1
  },
  {
    name: "IMANE ZAHMAR",
    role: "Vice-trésorière",
    photoUrl: "/images/members/imane_zahmar.png",
    bio: "Gérer chaque ressource avec rigueur pour maximiser l'impact direct de nos actions caritatives.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "AIMAD BARIK",
    role: "Project Director",
    photoUrl: "/images/members/aimad_barik.png",
    bio: "Piloter nos chantiers de rénovation et de forage avec exigence et professionnalisme.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "ENNADERY MOHAMED",
    role: "Repairs Manager",
    photoUrl: "/images/members/mohamed_ennadiry.png",
    bio: "Réparer, bâtir et transformer chaque salle de classe pour offrir un cadre d'étude digne aux enfants.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "OUSSAMA SAIDI",
    role: "Sports Activities Coordinator",
    photoUrl: "/images/members/oussama_saidi.png",
    bio: "Le sport est un vecteur d'épanouissement, d'esprit d'équipe et de joie pour notre jeunesse.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "AÏCHA MOUAK",
    role: "Art & Painting Coordinator",
    photoUrl: "/images/members/aicha_fakkak.png",
    bio: "Mettre des couleurs et de la créativité dans le quotidien des écoliers pour éveiller leurs rêves.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "YASSINE MAYOUNE",
    role: "Auditor",
    photoUrl: "/images/member_1.jpg",
    bio: "Veiller à l'intégrité et à l'efficacité de nos opérations pour honorer la confiance de la communauté.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    name: "TARIQ JALLOUNI",
    role: "Active Member",
    photoUrl: "/images/members/tariq_jallouni.png",
    bio: "Toujours prêt à agir sur le terrain pour répondre aux besoins vitaux des familles rurales.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "KENZA BOULMANI",
    role: "Active Member",
    photoUrl: "/images/members/kenza_boulmani.png",
    bio: "Donner de son temps et de son énergie pour semer l'espoir et encourager les initiatives solidaires.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "DOUNIA FAKAK",
    role: "Active Member",
    photoUrl: "/images/members/Dounia_fakkak.png",
    bio: "La solidarité active est la plus belle manière d'exprimer notre attachement à notre région.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "HICHAM BENTABJAOUTE",
    role: "Active Member",
    photoUrl: "/images/members/hicham_bentabjaoute.png",
    bio: "Travailler main dans la main pour concrétiser des projets porteurs d'espoir pour nos villages.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "HAJAR AMZIL",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Chaque道 sourire d'enfant est une victoire qui nous pousse à aller toujours plus loin.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "YOUNESSE RABIA",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "L'engagement communautaire est un devoir citoyen et une immense fierté partagée.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "ANAS TAOUFIQ",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Unir nos compétences techniques pour améliorer durablement les infrastructures scolaires.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "BADIAA AZOUGHARE",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Apporter du réconfort et une aide matérielle ciblée aux familles qui en ont le plus besoin.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "FADMA ZAFATI",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "La bienveillance et le partage sont au cœur de chacune de nos missions de terrain.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "YASSINE AMLIL",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Agir avec détermination pour préserver la dignité humaine dans les zones montagneuses.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "MARYAM ZOUAIHAR",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "L'éducation est la clé de voûte de l'émancipation de notre jeunesse.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "NADIA EL MESSAOUDI",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Soutenir les mères et les enfants grâce à des actions de solidarité régulières et chaleureuses.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "OUMAIMA BOUFI",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Participer activement à la distribution de vivres et au bien-être de notre communauté.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "AYA EL HAFI",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Faire rayonner la solidarité et l'entraide au sein de notre chère région de Chtouka Aït Baha.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "HIBA JOUH",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Accompagner les écoliers avec tendresse et leur offrir les outils nécessaires pour réussir.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "YOUNESS OUAOULMEST",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "La force du collectif permet de surmonter tous les obstacles logistiques sur le terrain.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "MARWA OULEDALLA",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Créer des moments de joie et de convivialité lors de nos visites dans les douars.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "EL FARIS IKRAM",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Mobiliser les énergies positives pour apporter un soutien concret et bienveillant.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "HAMZA IHIND",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Mettre les outils numériques et la communication au service de l'action humanitaire locale.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "SAAIDA AIT EL HOUSSINE",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Le dévouement au service de notre communauté est une vocation de chaque instant.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "SOUAD ELMAMOUN",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Offrir un avenir plus serein aux enfants grâce à des écoles rénovées et sécurisées.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "HAJAR ABOU EL OUAFA",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "L'entraide et la générosité sont les piliers fondamentaux de notre engagement bénévole.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "HAJAR OUAKRIM",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Partager l'espoir et cultiver l'empathie à travers chacune de nos interventions de proximité.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "ELGHAZOUANI NOUR ELHOUDA",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Chaque initiative compte pour éclairer le chemin des élèves dans les villages isolés.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "HAFSA ES-SABBAR",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Agir avec le cœur pour que chaque enfant puisse apprendre dans la dignité.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "MOHAMED OUKHAYI",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Participer aux travaux de terrain et veiller à la bonne réalisation technique de chaque étape.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "MOHAMED REDA",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "La persévérance et le travail d'équipe sont le secret de nos réussites collectives.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "ILHAM BOUAOUD",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Être présente aux côtés des familles pour leur apporter chaleur humaine et soutien matériel.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "KHAZIZ ZAHRA",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Bâtir des liens solides de solidarité pour renforcer la résilience de nos communautés.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "SOFIA BOUSRAF",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "L'épanouissement des jeunes est la plus belle promesse pour le futur de notre région.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "FATIHA BOUSRAF",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Travailler avec humilité et ferveur pour le développement social et éducatif local.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "MARIAM GOULAHSEN",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Chaque action de solidarité nourrit l'espoir d'un monde plus fraternel.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "NOUAMANE EL KHARRAJE",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Mettre son dynamisme au service des projets de forage et de rénovation de l'association.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "FATIMA OULEDALLA",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Agir ensemble pour semer le bonheur dans le cœur des enfants et des familles.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "FADMA AIT EL HOUSSINE",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "La solidarité est une valeur vivante qui s'exprime par des gestes concrets du quotidien.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "GHITA AIT EL HOUSSINE",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "Contribuer avec enthousiasme à chaque événement associatif pour un impact maximal.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    name: "ASMA OUAKRIM",
    role: "Active Member",
    photoUrl: "/images/member_1.jpg",
    bio: "L'engagement associatif transforme les vies et tisse des liens humains inoubliables.",
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

async function runUpdate() {
  console.log('Updating members in database...');
  for (const m of membersData) {
    const existing = await sql`SELECT id FROM members WHERE name = ${m.name}`;
    if (existing.length > 0) {
      await sql`
        UPDATE members
        SET role = ${m.role},
            photo_url = ${m.photoUrl},
            bio = ${m.bio},
            location = ${m.location},
            tier = ${m.tier}
        WHERE id = ${existing[0].id}
      `;
      console.log(`Updated member: ${m.name} -> ${m.role} (${m.photoUrl})`);
    } else {
      await sql`
        INSERT INTO members (name, role, photo_url, bio, location, tier)
        VALUES (${m.name}, ${m.role}, ${m.photoUrl}, ${m.bio}, ${m.location}, ${m.tier})
      `;
      console.log(`Inserted member: ${m.name} -> ${m.role}`);
    }
  }
  console.log('Finished updating members successfully!');
}

runUpdate().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});
