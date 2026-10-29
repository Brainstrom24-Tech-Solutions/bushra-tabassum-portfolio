import Head from "next/head";
import { getPageSeo, pageStructuredData, SITE_NAME, type ProjectSchema } from "../lib/seo";

type SeoProps = {
  path?: string;
  title?: string;
  description?: string;
  noindex?: boolean;
  projectSchema?: ProjectSchema;
};

export default function Seo({ path = "/", title, description, noindex = false, projectSchema }: SeoProps) {
  const seo = getPageSeo(path);
  const pageTitle = title || seo.title;
  const pageDescription = description || seo.description;
  const robots = noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-video-preview:-1, max-snippet:-1";
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} key="description" />
      <meta name="author" content="Gazi Bushra Tabassum" key="author" />
      <meta name="robots" content={robots} key="robots" />
      {!noindex && <link rel="canonical" href={seo.canonical} key="canonical" />}
      <meta property="og:title" content={pageTitle} key="og:title" />
      <meta property="og:description" content={pageDescription} key="og:description" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:locale" content="en_US" key="og:locale" />
      {!noindex && <meta property="og:url" content={seo.canonical} key="og:url" />}
      <meta property="og:image" content={seo.image} key="og:image" />
      <meta property="og:image:width" content="1200" key="og:image:width" />
      <meta property="og:image:height" content="630" key="og:image:height" />
      <meta property="og:image:type" content="image/png" key="og:image:type" />
      <meta property="og:image:alt" content={seo.imageAlt} key="og:image:alt" />
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={pageTitle} key="twitter:title" />
      <meta name="twitter:description" content={pageDescription} key="twitter:description" />
      <meta name="twitter:image" content={seo.image} key="twitter:image" />
      <meta name="twitter:image:alt" content={seo.imageAlt} key="twitter:image:alt" />
      {!noindex && <script
        id="portfolio-schema"
        key="portfolio-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData(path, projectSchema)).replace(/</g, "\\u003c") }}
      />}
    </Head>
  );
}
