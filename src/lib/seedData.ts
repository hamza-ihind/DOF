export interface Member {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
  location: string;
  tier: 1 | 2 | 3;
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

// Clean placeholder avatar URLs for members
const AVATAR_PLACEHOLDER_1 = "/images/member_1.jpg";
const AVATAR_PLACEHOLDER_2 = "/images/member_2.jpg";
const AVATAR_PLACEHOLDER_3 = "/images/member_3.jpg";
const AVATAR_PLACEHOLDER_FEMALE = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80";
const AVATAR_PLACEHOLDER_MALE = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";

export const INITIAL_MEMBERS: Member[] = [
  // Level 1: Executive Board
  {
    id: 1,
    name: "Youssef El Amrani",
    role: "President & Field Director",
    photoUrl: AVATAR_PLACEHOLDER_1,
    bio: "Passionate community leader based in Biougra, guiding strategy and overall operations across Chtouka Aït Baha.",
    location: "Biougra, Morocco",
    tier: 1
  },
  {
    id: 6,
    name: "Dr. Laila Alami",
    role: "Vice President",
    photoUrl: AVATAR_PLACEHOLDER_FEMALE,
    bio: "Co-founding director focused on external partnerships, village outreach planning, and humanitarian affairs.",
    location: "Biougra, Morocco",
    tier: 1
  },
  // Level 2: Project Directors & Department Leads
  {
    id: 2,
    name: "Amina Bensaid",
    role: "Educational Supplies Director",
    photoUrl: AVATAR_PLACEHOLDER_2,
    bio: "Oversees school refurbishment standards, wall painting logistics, and educational kit preparation.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    id: 3,
    name: "Omar Chraibi",
    role: "Spring of Life Water Lead",
    photoUrl: AVATAR_PLACEHOLDER_3,
    bio: "Civil engineering specialist coordinating site surveys, expert consultations, and deep well drilling operations.",
    location: "Biougra, Morocco",
    tier: 2
  },
  {
    id: 4,
    name: "Khadija Ouazzani",
    role: "Food Drive Logistics Manager",
    photoUrl: AVATAR_PLACEHOLDER_FEMALE,
    bio: "Leads pre-visit family size census data collection to tailor flour, food staples, and hygiene packages.",
    location: "Biougra, Morocco",
    tier: 2
  },
  // Level 3: Field Team & Volunteers
  {
    id: 5,
    name: "Hassan Tazi",
    role: "Renovation Technical Supervisor",
    photoUrl: AVATAR_PLACEHOLDER_MALE,
    bio: "Expert tradesperson leading wall sanding, ceiling and floor repairs, and indoor mural work.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    id: 7,
    name: "Karim Mansouri",
    role: "Field Logistics & Transport",
    photoUrl: AVATAR_PLACEHOLDER_MALE,
    bio: "Coordinates heavy supply transport and terrain navigation across mountain roads.",
    location: "Biougra, Morocco",
    tier: 3
  },
  {
    id: 8,
    name: "Zineb Berrada",
    role: "Youth Activities & Art Lead",
    photoUrl: AVATAR_PLACEHOLDER_FEMALE,
    bio: "Organizes interactive art workshops and educational games during school makeover visits.",
    location: "Biougra, Morocco",
    tier: 3
  }
];

export const INITIAL_EVENTS: EventItem[] = [
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

export const MOCK_CAROUSEL_ITEMS = [
  {
    id: 1,
    title: "Classroom Restoration & Sanding",
    tag: "School Refurbishment",
    location: "Biougra Hinterlands",
    image: "/images/school_renovation.jpg",
    desc: "Sanding worn walls, repairing ceilings and floors, and decorating with lively colors."
  },
  {
    id: 2,
    title: "Tailored Food & Soap Supplies",
    tag: "Food Distribution",
    location: "Rural Biougra Communities",
    image: "/images/food_distribution.jpg",
    desc: "Delivering customized flour bags, staple groceries, and essential hygiene care."
  },
  {
    id: 3,
    title: "'Spring of Life' Deep Water Well",
    tag: "Well Drilling",
    location: "Tizi Village",
    image: "/images/well_drilling.jpg",
    desc: "Boring deep water wells to bring clean, fresh water directly to village inhabitants."
  }
];
