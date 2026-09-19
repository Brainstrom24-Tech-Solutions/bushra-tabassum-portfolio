import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import Layout, { Arrow } from "./Layout";
import type { FeaturedProject } from "../data/featured";
import ProjectGallery from "./ProjectGallery";

export default function FeaturedCaseStudy({ project, next }: { project: FeaturedProject; next: FeaturedProject }) {
  const isConcept = project.slug === "wat-air-purifier";
  return <Layout title={`${project.title} — Bushra Tabassum`} description={project.description}>
    <article className={`project-detail shell ${isConcept ? "concept-detail" : ""}`}>
      <Link href="/#work" className="text-link"><ArrowLeft size={16} /> Selected work</Link>
      <div className="detail-heading"><p className="eyebrow case-type">{project.studio} / {project.category}</p><h1>{project.title}</h1><p>{project.intro}</p></div>
      <div className={`detail-meta ${project.area ? "detail-meta-four" : ""}`}><div><span>LOCATION</span><p>{project.location}</p></div><div><span>PROJECT TYPE</span><p>{project.projectType}</p></div><div><span>CONTRIBUTION</span><p>{project.role}</p></div>{project.area && <div><span>AREA</span><p>{project.area}</p></div>}</div>
      <figure className="case-cover"><img src={project.image} alt={project.alt} fetchPriority="high" /><figcaption>{project.coverCaption}</figcaption></figure>
      <div className="case-copy"><div><p className="eyebrow">The idea</p><h2>{project.intro}</h2><div className="case-tags">{project.focus.map(focus => <span key={focus}>{focus}</span>)}</div></div><div><p>{project.description}</p><h3>Design thinking</h3><p>{project.concept}</p><h3>{isConcept ? "The exploration" : "Spatial response"}</h3><p>{project.response}</p></div></div>
      <section className="case-boards" aria-label="Project drawings and visualisations"><div className="board-heading"><div><p className="eyebrow">From concept to detail</p><h2>Inside the project.</h2><p className="gallery-intro">Select an image to explore the details.</p></div>{project.pdf && <a className="contact-button" href={project.pdf} download>Download presentation <Download size={18} /></a>}</div><ProjectGallery key={project.slug} images={project.gallery} title={project.title} /></section>
      <div className="case-credit"><p>{project.credits}</p><a className="text-link" href={project.source} target="_blank" rel="noreferrer">Original portfolio <Arrow /></a></div>
      <Link className="next-project" href={`/projects/${next.slug}`}><div><p className="eyebrow">Next project / {next.number}</p><h2>{next.title}</h2></div><Arrow /></Link>
    </article>
  </Layout>;
}
