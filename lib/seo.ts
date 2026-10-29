import config from "../data/seo.json";
import { linkedin } from "../data/profile";

export const SITE_URL = config.siteUrl.replace(/\/$/, "");
export const SITE_NAME = config.siteName;
export const HOME_SEO = config.home;
export type ProjectSeoSlug = keyof typeof config.projects;
export type ProjectSchema = { image: string; credits: string };

export function canonicalUrl(path = "/") {
  const cleanPath = path.split(/[?#]/)[0].replace(/^\/+|\/+$/g, "");
  return `${SITE_URL}/${cleanPath ? `${cleanPath}/` : ""}`;
}

export function getPageSeo(path = "/") {
  const match = path.match(/^\/projects\/([^/?#]+)\/?$/);
  const slug = match?.[1];
  const project = slug && Object.prototype.hasOwnProperty.call(config.projects, slug)
    ? config.projects[slug as ProjectSeoSlug]
    : undefined;
  return {
    ...(project || HOME_SEO),
    slug: project ? slug : undefined,
    canonical: canonicalUrl(path),
    image: `${SITE_URL}/images/og/${project ? slug : "home"}.png`,
    imageAlt: project
      ? `${project.name} — Bushra Tabassum architecture portfolio`
      : "Bushra Tabassum — Architecture, Design & Leadership",
  };
}

export function pageStructuredData(path = "/", originalWork?: ProjectSchema) {
  const seo = getPageSeo(path);
  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  // Employment titles and degree dates are omitted while the CV differences are unresolved.
  const person = {
    "@type": "Person",
    "@id": personId,
    name: "Gazi Bushra Tabassum",
    alternateName: "Bushra Tabassum",
    url: canonicalUrl(),
    image: `${SITE_URL}/images/bushra-tabassum.png`,
    description: "Architecture, design and business leadership, with professional experience in Bangladesh and Malaysia.",
    sameAs: [linkedin],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Taylor's University" },
      { "@type": "CollegeOrUniversity", name: "University of Cyberjaya" },
    ],
  };
  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: canonicalUrl(),
    name: `${SITE_NAME} — Architecture Portfolio`,
    inLanguage: "en",
    publisher: { "@id": personId },
  };
  const webpage = {
    "@type": "WebPage",
    "@id": `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: { "@id": seo.slug ? `${seo.canonical}#work` : personId },
  };

  if (!seo.slug) {
    return {
      "@context": "https://schema.org",
      "@graph": [person, website, webpage, {
        "@type": "ItemList",
        name: "Selected architecture portfolio projects",
        itemListElement: Object.entries(config.projects).filter(([, project]) => "featured" in project && project.featured).map(([slug, project], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.name,
          url: canonicalUrl(`/projects/${slug}/`),
        })),
      }],
    };
  }

  const project = config.projects[seo.slug as ProjectSeoSlug];
  return {
    "@context": "https://schema.org",
    "@graph": [person, website, webpage, {
      "@type": "CreativeWork",
      "@id": `${seo.canonical}#work`,
      url: seo.canonical,
      name: project.name,
      description: project.description,
      genre: project.category,
      contributor: { "@id": personId },
      isPartOf: { "@id": websiteId },
      mainEntityOfPage: { "@id": `${seo.canonical}#webpage` },
      // Reference photography on earlier studies is not presented as original project work.
      ...(originalWork ? { image: `${SITE_URL}${originalWork.image}`, creditText: originalWork.credits } : {}),
    }, {
      "@type": "BreadcrumbList",
      "@id": `${seo.canonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl() },
        { "@type": "ListItem", position: 2, name: project.name, item: seo.canonical },
      ],
    }],
  };
}
