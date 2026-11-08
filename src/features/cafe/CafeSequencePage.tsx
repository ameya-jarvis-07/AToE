import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Cafe, StateRecord } from "../../data/seed";
import { Footer, Header } from "../../components/layout/SiteChrome";
import { ScrollFrameHero } from "../../components/ScrollFrameHero";
export default function CafeSequencePage({
  cafe,
  state,
}: {
  cafe: Cafe;
  state: StateRecord | undefined;
}) {
  const video = cafe.media.gallery.find((image) =>
    /\.(webm|mp4|ogg)(?:$|[?#])/i.test(image.path),
  );
  if (!video) return null;
  const gallery = cafe.media.gallery.filter((image) => image !== video);

  return (
    <>
      <Header />
      <main className="jacobs-page">
        <ScrollFrameHero
          videoPath={video.path}
          fallbackVideoPath={video.fallbackPath}
          posterPath={cafe.media.coverImagePath ?? undefined}
          className="jacobs-scroll-scene"
        >
          <Link to={`/india/${state?.slug}`} className="jacobs-back-link">
            <ArrowLeft size={16} /> BACK TO {state?.name.toUpperCase()}
          </Link>
          <div className="jacobs-hero-copy">
            <span className="tiny-label">
              {state?.name.toUpperCase()} · CAFÉ PROFILE
            </span>
            <h1>
              {cafe.name}<span>.</span>
            </h1>
            <span className="detail-city">{cafe.city}</span>
          </div>
        </ScrollFrameHero>
        <section className="jacobs-about">
          <div className="jacobs-gallery">
            {gallery.map((image, index) => (
              <img
                key={image.path}
                src={image.path}
                alt={image.alt ?? `${cafe.name} ${index === 0 ? "interior" : "detail"}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ))}
          </div>
          <div className="jacobs-copy">
            <span className="tiny-label">
              {state?.name.toUpperCase()} · CAFÉ PROFILE
            </span>
            <h2>
              {cafe.name}<span>.</span>
            </h2>
            <span className="detail-city">{cafe.city}</span>
            <p>{cafe.description}</p>
            <div className="tags">
              {cafe.ambienceTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="detail-rule" />
            <p className="source-note">
              Editorial profile from the supplied collection. Location and
              business details will be added when verified.
            </p>
            <Link to={`/india/${state?.slug}`} className="text-link">
              MORE FROM {state?.name.toUpperCase()} <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
