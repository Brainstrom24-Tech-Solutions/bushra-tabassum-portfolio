import { useEffect } from "react";
import Router from "next/router";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // The Pages Router singleton stays stable when the URL hash changes.
    const router = Router;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
    });
    let resizeFrame = 0;

    // Own same-page anchors before Next.js or the browser jumps to the target.
    // Do not stop propagation: mobile-menu close handlers must still run.
    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      )
        return;

      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search ||
        !url.hash
      )
        return;

      let id: string;
      try {
        id = decodeURIComponent(url.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      void router.push(`${url.pathname}${url.search}${url.hash}`, undefined, {
        shallow: true,
        scroll: false,
      });
      lenis.scrollTo(target, {
        // Lenis includes the document's responsive scroll-padding-top.
        offset: 0,
        onComplete: () => {
          // Keep keyboard navigation aligned with the destination section.
          if (!target.hasAttribute("tabindex")) {
            target.setAttribute("tabindex", "-1");
            target.addEventListener(
              "blur",
              () => target.removeAttribute("tabindex"),
              { once: true },
            );
          }
          target.focus({ preventScroll: true });
        },
      });
    };

    const stopMomentum = () =>
      lenis.scrollTo(lenis.actualScroll, { immediate: true });
    const syncRoute = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        lenis.resize();
        stopMomentum();
      });
    };

    document.addEventListener("click", onAnchorClick, true);
    router.events.on("routeChangeStart", stopMomentum);
    router.events.on("routeChangeComplete", syncRoute);
    router.events.on("routeChangeError", syncRoute);

    return () => {
      document.removeEventListener("click", onAnchorClick, true);
      router.events.off("routeChangeStart", stopMomentum);
      router.events.off("routeChangeComplete", syncRoute);
      router.events.off("routeChangeError", syncRoute);
      cancelAnimationFrame(resizeFrame);
      lenis.destroy();
    };
  }, []);

  return null;
}
