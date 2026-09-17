import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import Layout, { Arrow } from "./Layout";
import type { FeaturedProject } from "../data/featured";

export default function FeaturedCaseStudy({ project, next }: { project: FeaturedProject; next: FeaturedProject }) {
  return <Layout title={`${project.title} — Bushra Tabassum`} description={project.description}>
    <article className="project-detail shell">
      <Link href="/#work" className="text-link"><ArrowLeft size={16} /> Selected work</Link>
      <div className="detail-heading"><p className="eyebrow case-type">{project.studio} / {project.category}</p><h1>{project.title}</h1><p>{project.intro}</p></div>
      <div className="detail-meta"><div><span>CONTEXT</span><p>{project.location}</p></div><div><span>TYPE</span><p>Academic design proposal</p></div><div><span>CONTRIBUTION</span><p>{project.role}</p></div></div>
      <figure className="case-cover"><img src={project.image} alt={project.alt} fetchPriority="high" /><figcaption>Original project visualisation · Taylor’s University</figcaption></figure>
      <div className="case-copy"><div><p className="eyebrow">The idea</p><h2>{project.intro}</h2><div className="case-tags">{project.focus.map(focus => <span key={focus}>{focus}</span>)}</div></div><div><p>{project.description}</p><h3>Design thinking</h3><p>{project.concept}</p><h3>Spatial response</h3><p>{project.response}</p></div></div>
      <section className="case-boards" aria-label="Project presentation boards"><div className="board-heading"><div><p className="eyebrow">From concept to detail</p><h2>Inside the project.</h2></div><a className="contact-button" href={project.pdf} download>Download presentation <Download size={18} /></a></div><div className="board-grid">{project.boards.map(board => <figure key={board.image}><a href={board.image} target="_blank" rel="noreferrer" aria-label={`Open full-size board: ${board.caption}`}><img src={board.image} alt={board.caption} loading="lazy" /></a><figcaption>{board.caption}</figcaption></figure>)}</div></section>
      <div className="case-credit"><p>{project.credits}</p><a className="text-link" href={project.source} target="_blank" rel="noreferrer">Original portfolio <Arrow /></a></div>
      <Link className="next-project" href={`/projects/${next.slug}`}><div><p className="eyebrow">Next project / {next.number}</p><h2>{next.title}</h2></div><Arrow /></Link>
    </article>
  </Layout>;
}
