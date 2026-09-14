export interface Member {
  id: number;
  name: string;
  role: string;
  roleEn?: string;
  roleFr?: string;
  photoUrl: string;
  bio: string;
  bioEn?: string;
  bioFr?: string;
  location: string;
}

export interface EventDay {
  dayNumber: number;
  title: string;
  date: string;
  description: string;
  images: string[];
}

export interface EventItem {
  id: number;
  slug: string;
  title: string;
  category: 'School Refurbishment' | 'Food Package Distribution' | 'Spring of Life Well Drilling';
  date: string;
  location: string;
  imageUrl: string;
  excerpt: string;
  content: string;
  impactSummary: string;
  contributingMemberIds: number[];
  timelineDays: EventDay[];
}

export interface Transaction {
  id: number;
  memberId?: number | null;
  memberName: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt?: string;
}

export interface NewsletterItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  category?: string;
  date: string;
  createdAt?: string;
}

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 1,
    name: 'YOUSSEF BENTABJAOUTE',
    role: 'President',
    roleEn: 'President',
    roleFr: 'Président',
    photoUrl: '/images/members/youssef_bentabjaoute.jpg',
    bio: 'Guiding our association with dedication to bring tangible and lasting solutions to our villages.',
    bioEn: 'Guiding our association with dedication to bring tangible and lasting solutions to our villages.',
    bioFr: "Guider l'association avec dévouement pour apporter des solutions concrètes et durables à nos villages.",
    location: 'Biougra, Morocco'
  },
  {
    id: 2,
    name: 'LAILA BENYAHYA',
    role: 'Secretary General',
    roleEn: 'Secretary General',
    roleFr: 'Secrétaire Générale',
    photoUrl: '/images/members/leila_benyahya.png',
    bio: 'Coordinating our missions and ensuring transparent governance in service of all.',
    bioEn: 'Coordinating our missions and ensuring transparent governance in service of all.',
    bioFr: 'Coordonner nos engagements associatifs et assurer une gouvernance transparente au service de tous.',
    location: 'Biougra, Morocco'
  },
  {
    id: 3,
    name: 'IMANE ZAHMAR',
    role: 'Vice-Treasurer',
    roleEn: 'Vice-Treasurer',
    roleFr: 'Vice-trésorière',
    photoUrl: '/images/members/imane_zahmar.png',
    bio: 'Managing every resource with rigor to maximize the direct impact of our charitable actions.',
    bioEn: 'Managing every resource with rigor to maximize the direct impact of our charitable actions.',
    bioFr: "Gérer chaque ressource avec rigueur pour maximiser l'impact direct de nos actions caritatives.",
    location: 'Biougra, Morocco'
  },
  {
    id: 4,
    name: 'AIMAD BARIK',
    role: 'Project Director',
    roleEn: 'Project Director',
    roleFr: 'Directeur de Projet',
    photoUrl: '/images/members/aimad_barik.png',
    bio: 'Leading our school renovation and deep well drilling projects with precision and care.',
    bioEn: 'Leading our school renovation and deep well drilling projects with precision and care.',
    bioFr: 'Piloter nos chantiers de rénovation et de forage avec exigence et professionnalisme.',
    location: 'Biougra, Morocco'
  },
  {
    id: 5,
    name: 'ENNADERY MOHAMED',
    role: 'Repairs Manager',
    roleEn: 'Repairs Manager',
    roleFr: 'Responsable des Travaux & Réparations',
    photoUrl: '/images/members/mohamed_ennadiry.png',
    bio: 'Repairing, building, and transforming every classroom to provide children with a dignified learning space.',
    bioEn: 'Repairing, building, and transforming every classroom to provide children with a dignified learning space.',
    bioFr: "Réparer, bâtir et transformer chaque salle de classe pour offrir un cadre d'étude digne aux enfants.",
    location: 'Biougra, Morocco'
  },
  {
    id: 6,
    name: 'OUSSAMA SAIDI',
    role: 'Sports Activities Coordinator',
    roleEn: 'Sports Activities Coordinator',
    roleFr: 'Coordinateur des Activités Sportives',
    photoUrl: '/images/members/oussama_saidi.png',
    bio: 'Sports inspire fulfillment, strong team spirit, and joy for the youth of our community.',
    bioEn: 'Sports inspire fulfillment, strong team spirit, and joy for the youth of our community.',
    bioFr: "Le sport est un vecteur d'épanouissement, d'esprit d'équipe et de joie pour notre jeunesse.",
    location: 'Biougra, Morocco'
  },
  {
    id: 7,
    name: 'AÏCHA MOUAK',
    role: 'Art & Painting Coordinator',
    roleEn: 'Art & Painting Coordinator',
    roleFr: 'Coordinatrice Art & Peinture',
    photoUrl: '/images/members/aicha_fakkak.png',
    bio: 'Bringing vibrant colors and creativity into schools to awaken the children dreams.',
    bioEn: 'Bringing vibrant colors and creativity into schools to awaken the children dreams.',
    bioFr: 'Mettre des couleurs et de la créativité dans le quotidien des écoliers pour éveiller leurs rêves.',
    location: 'Biougra, Morocco'
  },
  {
    id: 8,
    name: 'HICHAM BENTABJAOUTE',
    role: 'Active Member',
    roleEn: 'Active Member',
    roleFr: 'Membre Actif',
    photoUrl: '/images/members/hicham_bentabjaoute.png',
    bio: 'Working hand in hand on the ground to deliver impactful community initiatives.',
    bioEn: 'Working hand in hand on the ground to deliver impactful community initiatives.',
    bioFr: "Travailler main dans la main pour concrétiser des projets porteurs d'espoir pour nos villages.",
    location: 'Biougra, Morocco'
  },
  {
    id: 9,
    name: 'DOUNIA FAKAK',
    role: 'Active Member',
    roleEn: 'Active Member',
    roleFr: 'Membre Actif',
    photoUrl: '/images/members/Dounia_fakkak.png',
    bio: 'Active solidarity is the most meaningful way to support and uplift our local region.',
    bioEn: 'Active solidarity is the most meaningful way to support and uplift our local region.',
    bioFr: "La solidarité active est la plus belle manière d'exprimer notre attachement à notre région.",
    location: 'Biougra, Morocco'
  },
  {
    id: 10,
    name: 'TARIQ JALLOUNI',
    role: 'Active Member',
    roleEn: 'Active Member',
    roleFr: 'Membre Actif',
    photoUrl: '/images/members/tariq_jallouni.png',
    bio: 'Always ready in the field to address vital needs and support rural families.',
    bioEn: 'Always ready in the field to address vital needs and support rural families.',
    bioFr: 'Toujours prêt à agir sur le terrain pour répondre aux besoins vitaux des familles rurales.',
    location: 'Biougra, Morocco'
  },
  {
    id: 11,
    name: 'KENZA BOULMANI',
    role: 'Active Member',
    roleEn: 'Active Member',
    roleFr: 'Membre Actif',
    photoUrl: '/images/members/kenza_boulmani.png',
    bio: 'Dedication and positive energy are key to spreading hope and encouraging solidarity.',
    bioEn: 'Dedication and positive energy are key to spreading hope and encouraging solidarity.',
    bioFr: "Donner de son temps et de son énergie pour semer l'espoir et encourager les initiatives solidaires.",
    location: 'Biougra, Morocco'
  }
];

export const INITIAL_EVENTS: EventItem[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_NEWSLETTERS: NewsletterItem[] = [
  {
    id: 1,
    title: 'School Refurbishment & Solar Installations in Chtouka Aït Baha',
    description: 'Watch the full video documentation of our team restoring classroom walls, bringing art, and distributing school bags to children.',
    imageUrl: '/images/school_renovation.jpg',
    linkUrl: 'https://www.youtube.com',
    category: 'YouTube Video',
    date: '2026-08-15'
  }
];

export const MOCK_CAROUSEL_ITEMS: any[] = [];
