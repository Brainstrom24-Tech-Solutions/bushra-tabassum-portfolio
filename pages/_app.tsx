import type { AppProps } from "next/app";
import SmoothScroll from "../components/SmoothScroll";
import "lenis/dist/lenis.css";
import "../styles/globals.css";
import "../styles/portrait.css";
import "../styles/scroll.css";
import "../styles/gallery.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SmoothScroll />
      <Component {...pageProps} />
    </>
  );
}
