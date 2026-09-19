import assetSizes from "./gallery-assets.json";

const academicProjects = [
  {
    slug: "the-esplanade", number: "01", title: "The Esplanade", category: "Culture & community", studio: "Studio VI", location: "Malacca, Malaysia", role: "Individual design · group site analysis",
    image: "/images/projects/esplanade-cover.webp", alt: "The Esplanade academic proposal: brick and glass community centre with a planted central atrium",
    intro: "A place to gather. A culture to carry forward.",
    description: "A community-centre proposal beside the Malacca River, bringing local food, craft and shared experiences into one public place. The making of kuih becomes a starting point for connecting people with the city’s living heritage.",
    concept: "The layered character of kuih informs a rhythmic composition of spaces. Workshops, markets and cultural activities invite local residents, artists, vendors and visitors to meet throughout the building.",
    response: "An open atrium connects the levels, while a riverside theatre and upper viewing deck extend the programme towards the city. The proposal brings together a library, history hall, gallery and creative workshops.",
    focus: ["Cultural heritage", "Public space", "Layered massing", "Community workshops"],
    credits: "Academic design proposal by Gazi Bushra Tabassum at Taylor’s University. Preliminary site analysis was undertaken as group work.",
    source: "https://bushratabassumm11.wixsite.com/mysite-2/copy-of-studio-v-1", pdf: "/documents/esplanade-presentation.pdf",
    boards: [{ image: "/images/projects/esplanade-board-1.webp", caption: "01 / Concept, site plan and architectural form" }, { image: "/images/projects/esplanade-board-6.webp", caption: "02 / Interior experiences, environmental ideas and construction details" }],
  },
  {
    slug: "echoes-of-the-wind", number: "02", title: "Echoes of the Wind", category: "Inclusive & sensory design", studio: "Studio IV", location: "Taylor’s University", role: "Group design project",
    image: "/images/projects/echoes-cover.webp", alt: "Curving bamboo and timber pavilion from the group project Echoes of the Wind",
    intro: "Architecture experienced through sound.",
    description: "A sensory pavilion exploring how sound, touch and shared musical activity can shape an architectural experience for visually impaired visitors and the wider community.",
    concept: "Wind moves through suspended bamboo elements, while instrumental surfaces invite visitors to take part. Sound becomes both an experience of the building and a reason to interact with others.",
    response: "Curved circulation brings together xylophone elements and an angklung experience. Bamboo, timber and rope create a material language that supports the pavilion’s musical character.",
    focus: ["Inclusive experience", "Sound & materiality", "Bamboo & timber", "Shared interaction"],
    credits: "Group academic project by Lai Nai Shern Paul, Choo Jia Qi and Gazi Bushra Tabassum, Taylor’s University. Presented with the original team attribution.",
    source: "https://bushratabassumm11.wixsite.com/mysite-2/copy-of-architecture-and-environment", pdf: "/documents/echoes-presentation.pdf",
    boards: [{ image: "/images/projects/echoes-board-1.webp", caption: "01 / Original group presentation: concept, plans, sections and experiences" }],
  },
];
export type GalleryImage = {
  image: string;
  thumbnail: string;
  caption: string;
  alt: string;
  category: string;
  width: number;
  height: number;
};

function artwork(name: keyof typeof assetSizes, caption: string, category: string, alt = caption): GalleryImage {
  return { image: `/images/projects/${name}.webp`, thumbnail: `/images/projects/${name}-thumb.webp`, caption, category, alt, ...assetSizes[name] };
}

export type FeaturedProject = Omit<(typeof academicProjects)[number], "pdf" | "boards"> & {
  projectType: string;
  coverCaption: string;
  area?: string;
  pdf?: string;
  gallery: GalleryImage[];
};

const esplanadeGallery = [
  artwork("esplanade-process", "From layered massing to architectural form", "Concept"),
  artwork("esplanade-site", "Site plan · the Malacca River edge", "Concept"),
  artwork("esplanade-concept", "Kuih, culture and the community programme", "Concept"),
  artwork("esplanade-ground", "Ground floor · market, accommodation and outdoor theatre", "Plans"),
  artwork("esplanade-level-1", "Level 1 · kuih workshop and cafeteria", "Plans"),
  artwork("esplanade-level-2", "Level 2 · art gallery and crafting workshop", "Plans"),
  artwork("esplanade-level-3", "Level 3 · library and hall of history", "Plans"),
  artwork("esplanade-level-4", "Level 4 · art studio, garden and viewing deck", "Plans"),
  artwork("esplanade-basement", "Basement · building services", "Plans"),
  artwork("esplanade-elevations", "Back, right and left elevations", "Sections & detail"),
  artwork("esplanade-sections", "Sections A–A′ and B–B′ · spaces along the river", "Sections & detail"),
  artwork("esplanade-experiences", "Twelve perspectives on everyday life inside", "Experience"),
  artwork("esplanade-construction", "Construction details and environmental strategies", "Sections & detail"),
  artwork("esplanade-axon", "Exploded axonometric · a connected programme", "Sections & detail"),
];

const echoesGallery = [
  artwork("echoes-plan", "A circular plan shaped around sound", "Plans"),
  artwork("echoes-design-process", "Design process · ventilation, circulation and sound", "Concept"),
  artwork("echoes-elevations", "Two elevations and Section A–A′", "Sections & detail"),
  artwork("echoes-material-detail", "Section B–B′ · bamboo, timber and structural connections", "Sections & detail"),
  artwork("echoes-axon", "Exploded axonometric · roof, instruments and platform", "Sections & detail"),
  artwork("echoes-interaction", "The angklung and xylophone experiences", "Experience"),
  artwork("echoes-full-board", "Original presentation board · full team attribution", "Presentation"),
];

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "maharaja-restaurant", number: "01", title: "Maharaja Restaurant",
    category: "Hospitality & interiors", studio: "Client project", location: "Genting Highlands, Pahang, Malaysia",
    role: "Lead architect", area: "2,200 sq ft", projectType: "Professional interior design",
    image: "/images/projects/maharaja-cover.webp",
    alt: "Maharaja Restaurant interior render with a brick buffet wall, timber tables, cream chairs and warm pendant lighting",
    coverCaption: "Design visualisation · Maharaja Restaurant",
    intro: "Warmth, texture and a place at the table.",
    description: "An interior-design project for a 2,200 sq ft restaurant in Genting Highlands, Malaysia. The design brings together dining, a central kitchen and a buffet counter within a warm, light-filled setting.",
    concept: "A palette of brick, timber tones and soft upholstery gives the dining room its character. Pendant lights mark the tables, while vertical screens and planting bring rhythm and softness to the interior.",
    response: "The floor plan arranges seating around the kitchen and service areas, with a continuous buffet edge and tables along the glazed frontage. Three interior views and a sectional perspective show how the layout, lighting and finishes come together.",
    focus: ["Hospitality interiors", "Space planning", "Material palette", "Lighting & atmosphere"],
    credits: "Interior-design project by Gazi Bushra Tabassum, credited as Lead Architect in the supplied portfolio. Images are design visualisations.",
    source: "https://www.canva.com/design/DAGb5vEQFPY/zhZQHgoJOXaEljDy3mVMog/edit",
    gallery: [
      artwork("maharaja-cover", "The buffet and dining room", "Interiors"),
      artwork("maharaja-window", "Daylight along the window-side tables", "Interiors"),
      artwork("maharaja-dining", "A view through the dining space", "Interiors"),
      artwork("maharaja-plan", "Floor plan · dining, kitchen and service areas", "Drawings"),
      artwork("maharaja-section", "Sectional perspective · material and spatial relationships", "Drawings"),
    ],
  },
  ...academicProjects.map((project, index) => ({
    ...project,
    number: String(index + 2).padStart(2, "0"),
    projectType: "Academic design proposal",
    coverCaption: "Original project visualisation · Taylor’s University",
    gallery: project.slug === "the-esplanade" ? esplanadeGallery : echoesGallery,
  })),
];

export const sustainabilityProject: FeaturedProject = {
  slug: "wat-air-purifier", number: "01", title: "WAT-AIR Purifier",
  category: "Sustainability & concept exploration", studio: "Sustainable Living · 2021",
  location: "Metro Manila · conceptual context", role: "Individual academic concept",
  projectType: "Speculative design study",
  image: "/images/projects/wat-air-board.webp",
  alt: "WAT-AIR Purifier academic board illustrating a speculative air filtration and rainwater collection system above Metro Manila",
  coverCaption: "Original academic concept board · Taylor’s University, August 2021 semester",
  intro: "Imagining cleaner air. Rethinking urban water.",
  description: "An academic Sustainable Living study exploring an imagined response to air pollution and urban water challenges in Metro Manila. The proposal brings air filtration and rainwater collection into a single elevated system.",
  concept: "The diagram explores a membrane enclosure, staged water filtration and a distribution trunk. It asks how environmental infrastructure might occupy the city differently.",
  response: "Presented as a speculative concept, the board communicates the proposed components and their relationships. It is a design exploration, not a built installation or a technically validated purification system.",
  focus: ["Sustainable city ideas", "Air & water", "Environmental systems", "Speculative design"],
  credits: "Sustainable Living, Assignment 2: Sustainable City Ideas. Academic concept by Gazi Bushra Tabassum, Taylor’s University, August 2021 semester. Original presentation artwork is preserved.",
  source: "https://www.canva.com/design/DAGb5vEQFPY/zhZQHgoJOXaEljDy3mVMog/edit",
  gallery: [artwork("wat-air-board", "Sustainable City Ideas · original concept board", "Concept")],
};

export const caseStudies = [...featuredProjects, sustainabilityProject];
