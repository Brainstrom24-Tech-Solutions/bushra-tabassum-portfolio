import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, Minus, Plus, X } from "lucide-react";
import type { GalleryImage } from "../data/featured";

export default function ProjectGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousZoom = useRef(1);
  const isOpen = active !== null;
  const categories = [
    "All",
    ...Array.from(new Set(images.map((image) => image.category))),
  ];
  const visible = images.filter(
    (image) => filter === "All" || image.category === filter,
  );
  const current = active === null ? null : images[active];

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    modal?.showModal();
    closeButton.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = overflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    setZoom(1);
    if (stage.current) {
      stage.current.scrollTop = 0;
      stage.current.scrollLeft = 0;
    }
  }, [active]);

  useEffect(() => {
    const viewport = stage.current;
    if (viewport && zoom !== previousZoom.current) {
      const ratio = zoom / previousZoom.current;
      viewport.scrollLeft =
        (viewport.scrollLeft + viewport.clientWidth / 2) * ratio -
        viewport.clientWidth / 2;
      viewport.scrollTop =
        (viewport.scrollTop + viewport.clientHeight / 2) * ratio -
        viewport.clientHeight / 2;
    }
    previousZoom.current = zoom;
  }, [zoom]);

  function move(step: number) {
    setActive((index) =>
      index === null ? null : (index + step + images.length) % images.length,
    );
  }

  return (
    <>
      {images.length > 1 && (
        <div className="gallery-toolbar">
          <div className="gallery-filters" aria-label="Filter project images">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <p aria-live="polite">
            {visible.length} {visible.length === 1 ? "image" : "images"}
          </p>
        </div>
      )}
      <div className="project-gallery">
        {visible.map((item) => (
          <figure key={item.image}>
            <button
              type="button"
              className={`gallery-image ${item.category === "Interiors" ? "gallery-photo" : ""}`}
              aria-label={`Enlarge ${item.caption}`}
              onClick={(event) => {
                opener.current = event.currentTarget;
                setActive(images.indexOf(item));
              }}
            >
              <img
                src={item.thumbnail}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
              />
              <span className="gallery-enlarge">
                <Maximize2 size={17} /> View detail
              </span>
            </button>
            <figcaption>
              <span>{String(images.indexOf(item) + 1).padStart(2, "0")}</span>
              <div>
                {item.caption}
                <small>{item.category}</small>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label={`${title} image viewer`}
        data-lenis-prevent
        onCancel={() => setActive(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {current && (
          <div className="lightbox-layout">
            <div className="lightbox-header">
              <span>{title}</span>
              <div className="lightbox-zoom">
                <button
                  type="button"
                  aria-label="Zoom out"
                  disabled={zoom <= 1}
                  onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
                >
                  <Minus size={18} />
                </button>
                <button
                  type="button"
                  className="zoom-reset"
                  onClick={() => setZoom(1)}
                  aria-label="Reset zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  aria-label="Zoom in"
                  disabled={zoom >= 3}
                  onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                ref={closeButton}
                type="button"
                className="lightbox-close"
                aria-label="Close image viewer"
                onClick={() => setActive(null)}
              >
                <X size={24} />
              </button>
            </div>
            <div
              ref={stage}
              className={`lightbox-stage ${zoom > 1 ? "is-zoomed" : ""}`}
              tabIndex={0}
              aria-label="Image detail; scroll to explore when zoomed"
              data-lenis-prevent
            >
              <div
                className="lightbox-canvas"
                style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
              >
                <img
                  src={current.image}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                />
              </div>
            </div>
            <div className="lightbox-footer">
              <div aria-live="polite">
                <p>{current.caption}</p>
                <small>
                  {(active ?? 0) + 1} / {images.length} ·{" "}
                  {zoom > 1
                    ? "Scroll to explore the drawing"
                    : "Use + to zoom into details"}
                </small>
              </div>
              {images.length > 1 && (
                <div className="lightbox-navigation">
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => move(-1)}
                  >
                    <ArrowLeft size={21} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => move(1)}
                  >
                    <ArrowRight size={21} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
