import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Layout, { Arrow } from "../../components/Layout";
import { projects } from "../../data/profile";
import { featuredProjects, type FeaturedProject } from "../../data/featured";
import FeaturedCaseStudy from "../../components/FeaturedCaseStudy";
type Project = (typeof projects)[number];
type ProjectPageProps = { featured: true; project: FeaturedProject; next: FeaturedProject } | { featured: false; project: Project; next: Project };
export default function ProjectPage(props: ProjectPageProps) {
  if (props.featured) return <FeaturedCaseStudy project={props.project} next={props.next} />;
  return <ArchiveProjectPage project={props.project} next={props.next} />;
}
function ArchiveProjectPage({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  return (
    <Layout
      title={`${project.title} — Bushra Tabassum`}
      description={project.description}
    >
      <article className="project-detail shell">
        <Link href="/#work" className="text-link">
          <ArrowLeft size={16} /> Back to selected studies
        </Link>
        <div className="detail-heading">
          <p className="eyebrow">
            STUDY {project.number} / {project.category.toUpperCase()}
          </p>
          <h1>{project.title}</h1>
          <p>{project.fullTitle}</p>
        </div>
        <div className="detail-meta">
          <div>
            <span>INSTITUTION</span>
            <p>Taylor’s University</p>
          </div>
          <div>
            <span>PERIOD</span>
            <p>{project.date}</p>
          </div>
          <div>
            <span>TYPE</span>
            <p>Academic exploration</p>
          </div>
        </div>
        <figure className="detail-image">
          <img src={project.image} alt={project.alt} />
          <figcaption>
            Architectural reference image — illustrative, not documentation of
            this project.
          </figcaption>
        </figure>
        <div className="detail-story">
          <p className="eyebrow">THE EXPLORATION</p>
          <div>
            <h2>{project.theme}</h2>
            <p>{project.description}</p>
            <div className="detail-focus">
              <div>
                <h3>Areas of exploration</h3>
                {project.focus.map((f) => (
                  <p key={f}>{f}</p>
                ))}
              </div>
              {project.tools.length > 0 && (
                <div>
                  <h3>Associated tools</h3>
                  {project.tools.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              )}
            </div>
            <p className="detail-note">
              Original project drawings and presentation boards are not included
              in this edition.
            </p>
          </div>
        </div>
        <Link className="next-project" href={`/projects/${next.slug}`}>
          <div>
            <p className="eyebrow">NEXT STUDY / {next.number}</p>
            <h2>{next.title}</h2>
          </div>
          <Arrow />
        </Link>
      </article>
    </Layout>
  );
}
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [...featuredProjects, ...projects].map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const featuredIndex = featuredProjects.findIndex((p) => p.slug === params?.slug);
  if (featuredIndex >= 0) return { props: { featured: true, project: featuredProjects[featuredIndex], next: featuredProjects[(featuredIndex + 1) % featuredProjects.length] } };
  const index = projects.findIndex((p) => p.slug === params?.slug);
  if (index < 0) return { notFound: true };
  return {
    props: {
      featured: false,
      project: projects[index],
      next: projects[(index + 1) % projects.length],
    },
  };
};
