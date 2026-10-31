import ProjectGallery from "./ProjectGallery";
import { photographs } from "../data/photography";

export default function Photography() {
  return (
    <section id="photography" className="photography-section section-space" aria-labelledby="photography-heading">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / Photography</p>
            <h2 id="photography-heading">Through <em>my lens.</em></h2>
          </div>
          <p className="section-aside">
            Looking up. Looking closer.
            <br />
            Architecture in light, texture and quiet detail.
          </p>
        </div>
        <ProjectGallery images={photographs} title="Through my lens" variant="photography" />
        <p className="photography-note">Two places. Two moments. A different perspective.</p>
      </div>
    </section>
  );
}
