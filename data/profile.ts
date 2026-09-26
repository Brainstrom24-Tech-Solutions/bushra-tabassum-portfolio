export const linkedin =
  "https://www.linkedin.com/in/bushra-tabassum-b7bb041b6/";
export const contact = {
  email: "bushratabas.summ11@gmail.com",
  phones: [
    {
      country: "Bangladesh",
      label: "+880 1741 300461",
      href: "tel:+8801741300461",
    },
    {
      country: "Malaysia",
      label: "+60 11 1666 7319",
      href: "tel:+601116667319",
    },
  ],
  address: ["Star Center, Level 2", "Gulshan 1, Dhaka 1212", "Bangladesh"],
};
export const projects = [
  {
    slug: "principles-and-materiality",
    number: "01",
    title: "Principles & materiality",
    fullTitle:
      "Diagramming & Designing with Architectural Principles + Materiality",
    category: "Design exploration",
    date: "Apr — Jul 2020",
    image: "/images/materiality.jpg",
    alt: "Architectural reference showing sculptural form and material texture",
    theme: "The relationship between form, composition and material.",
    description:
      "An academic project at Taylor’s University exploring architectural principles and materiality through diagramming and design.",
    tools: ["Autodesk 3ds Max"],
    focus: ["Architectural principles", "Diagramming", "Materiality"],
  },
  {
    slug: "design-strategy",
    number: "02",
    title: "From strategy to space",
    fullTitle: "Design Strategy & Final Outcome",
    category: "Design development",
    date: "Academic project",
    image: "/images/hero.jpg",
    alt: "Architectural reference of a building with strong geometric composition",
    theme: "Tracing the idea through to its architectural expression.",
    description:
      "An academic project associated with Taylor’s University, bringing design strategy and its final outcome into one study.",
    tools: ["Autodesk 3ds Max"],
    focus: ["Design strategy", "Spatial composition", "Final outcome"],
  },
  {
    slug: "precedent-studies",
    number: "03",
    title: "Reading the built form",
    fullTitle: "Precedent Studies & Spatial Translation",
    category: "Architectural research",
    date: "Academic project",
    image: "/images/detail.jpg",
    alt: "Architectural reference showing the relationship between light and built form",
    theme: "Looking closely. Understanding space.",
    description:
      "An academic study associated with Taylor’s University, centred on architectural precedents and spatial translation.",
    tools: [],
    focus: [
      "Precedent studies",
      "Spatial translation",
      "Architectural research",
    ],
  },
  {
    slug: "site-analysis",
    number: "04",
    title: "A sense of place",
    fullTitle: "Site Analysis",
    category: "Context & analysis",
    date: "Academic project",
    image: "/images/hero.jpg",
    alt: "Reference architecture in its surrounding context",
    theme: "Every architectural idea begins with its context.",
    description:
      "An academic site analysis project associated with Taylor’s University. Autodesk 3ds Max is listed among the project’s associated skills.",
    tools: ["Autodesk 3ds Max"],
    focus: ["Site analysis", "Context", "Visual communication"],
  },
];
type Experience = {
  role: string;
  company: string;
  dates: string;
  location?: string;
  description?: string;
};

export const experience: Experience[] = [
  {
    role: "Director",
    company: "Anondo Housing Society",
    dates: "Jan 2024 — Present",
    location: "Dhaka, Bangladesh · Hybrid",
    description:
      "Oversight of sales, marketing and development teams, alongside project coordination, on-site supervision and client communication.",
  },
  {
    role: "Director",
    company: "Anondo Cityscapers Ltd",
    dates: "January 2024 — Present",
    location: "Dhaka, Bangladesh",
    description:
      "Supervising the management of the sales, marketing and development department. Tracking and negotiating the legal and financial growth of the firm.",
  },
  {
    role: "Director",
    company: "Anondo Bhubon",
    dates: "January 2024 — Present",
    location: "Dhaka, Bangladesh",
    description:
      "Overseeing the management of the sales, marketing and development department. Tracking and negotiating the legal and financial growth of the firm.",
  },
  {
    role: "Director",
    company: "Anondo Rosemont Estate",
    dates: "January 2024 — Present",
    location: "Dhaka, Bangladesh",
    description:
      "Overseeing the management of the sales, marketing and development department. Tracking and negotiating the legal and financial growth of the firm.",
  },
  {
    role: "Director",
    company: "Anondo Baari",
    dates: "January 2024 — Present",
    location: "Dhaka, Bangladesh",
    description:
      "Overseeing the management of the sales, marketing and development department. Tracking and negotiating the legal and financial growth of the firm.",
  },
  {
    role: "Director",
    company: "Anondo Universal Services Ltd.",
    dates: "January 2024 — Present",
    location: "Dhaka, Bangladesh",
    description:
      "Overseeing the management of the sales, marketing and development department. Tracking and negotiating the legal and financial growth of the firm.",
  },
  {
    role: "Director",
    company: "Pranto ARDI",
    dates: "January 2024 — Present",
    location: "Dhaka, Bangladesh",
    description:
      "Overseeing the management of the sales, marketing and development department. Tracking and negotiating the legal and financial growth of the firm.",
  },
  {
    role: "Director",
    company: "Bridge Pharmaceuticals Ltd.",
    dates: "January 2024 — Present",
    location: "Dhaka, Bangladesh",
    description:
      "Overseeing the management of the sales, marketing and development department. Tracking and negotiating the legal and financial growth of the firm.",
  },
  {
    role: "Assistant Architect",
    company: "MH Architects",
    dates: "Sep 2023 — Feb 2024",
    location: "Dhaka, Bangladesh · On-site",
    description:
      "Site visits and analysis, design development, 3D modelling and rendering for architectural projects.",
  },
  {
    role: "Architectural Intern",
    company: "Arkitekno Vista sdn bhd",
    dates: "Jan — Mar 2023",
    location: "Shah Alam, Malaysia · On-site",
    description:
      "Site visits, data collection, detailed drawings, construction documents, sample designs and support with 3D models and renderings.",
  },
];
export const skillGroups = [
  {
    name: "Architecture & visualisation",
    detail: "From a first line to a spatial idea.",
    skills: [
      "AutoCAD",
      "AutoCAD Architecture",
      "Revit",
      "SketchUp",
      "ARCHICAD",
      "Autodesk 3ds Max",
      "Enscape",
      "V-Ray",
    ],
  },
  {
    name: "Design & communication",
    detail: "Giving ideas clarity and expression.",
    skills: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Procreate App",
      "Microsoft PowerPoint",
    ],
  },
  {
    name: "Business & leadership",
    detail: "Connecting design with delivery.",
    skills: [
      "Requirements Analysis",
      "Sales Management",
      "Analytical Skills",
      "Financial Analysis",
      "Account Management",
      "Accounting",
      "Business Analysis",
      "Advertising",
      "Microsoft Excel",
    ],
  },
];
