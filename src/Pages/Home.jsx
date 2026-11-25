import { useEffect, useState, memo } from "react"
import { Helmet } from "react-helmet-async"
import { ExternalLink, Mail, Sparkles } from "lucide-react"
import PropTypes from "prop-types"
import { CONTACT_LINKS, PROFILE_ROLE } from "../config/profile"

const ROLES = [
  "Web Developer",
  "Integration IoT & Automation",
  "Fullstack Developer",
];

const StatusBadge = memo(function StatusBadge() {
  return (
    <div className="inline-block lg:mx-0">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
        <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
            <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
            Ready to Innovate
          </span>
        </div>
      </div>
    </div>
  );
});

const MainTitle = memo(function MainTitle() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const activeRole = ROLES[roleIndex];

  useEffect(() => {
    let timeout;

    if (!isErasing && visibleLength < activeRole.length) {
      timeout = window.setTimeout(
        () => setVisibleLength((length) => length + 1),
        28,
      );
    } else if (!isErasing && visibleLength === activeRole.length) {
      timeout = window.setTimeout(() => setIsErasing(true), 1700);
    } else if (isErasing && visibleLength > 0) {
      timeout = window.setTimeout(
        () => setVisibleLength((length) => length - 1),
        14,
      );
    } else {
      timeout = window.setTimeout(() => {
        setRoleIndex((index) => (index + 1) % ROLES.length);
        setIsErasing(false);
      }, 180);
    }

    return () => window.clearTimeout(timeout);
  }, [activeRole.length, isErasing, visibleLength]);

  return (
    <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
      <h1
        className="min-h-[3.3em] max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-5xl"
        aria-label={ROLES.join(", ")}
      >
        <span aria-hidden="true" className="text-[var(--text)]">
          {activeRole.slice(0, visibleLength)}
        </span>
        {/* Perbaikan: sebelumnya dibandingkan dengan PROFILE_ROLE.length, bukan panjang role yang sedang aktif */}
        {visibleLength < activeRole.length && (
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-[0.85em] w-[2px] translate-y-[0.08em] bg-[var(--accent)]"
          />
        )}
      </h1>
    </div>
  );
});

const TechStack = memo(function TechStack({ tech }) {
  return (
    <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
      {tech}
    </div>
  );
});
TechStack.propTypes = { tech: PropTypes.string.isRequired };

const CTAButton = memo(function CTAButton({ href, text, icon: Icon }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-11 w-[160px] items-center justify-center gap-2 rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-medium !text-white transition-colors duration-200 hover:bg-[var(--accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <span className="!text-white">{text}</span>
      <Icon className="h-4 w-4 !text-white" aria-hidden="true" />
    </a>
  );
});
CTAButton.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

/*
 * Potret berbingkai arch (atas melengkung, bawah rounded) yang menampilkan
 * FOTO UTUH tanpa crop.
 *
 * Kenapa tidak lagi memakai aspect-square + object-cover:
 * foto asli berformat portrait (720x1280) dan wajah/badan ada di bagian
 * bawah. Bingkai persegi/bulat memaksa gambar dipotong sehingga hanya langit
 * yang terlihat.
 *
 * Sekarang lebar ditentukan bingkai, tinggi mengikuti rasio asli gambar
 * (h-auto). Gambar berada di alur dokumen normal (bukan absolute), jadi
 * tinggi kolom ikut menyesuaikan dan tidak ada yang menimpa konten lain.
 * Efek hover memakai CSS (group-hover), tanpa state React.
 */
const Portrait = memo(function Portrait() {
  return (
    <div
      className="group relative w-52 sm:w-60 lg:w-72 xl:w-80"
      data-aos="fade-left"
      data-aos-delay="600"
    >
      {/* Glow di belakang bingkai */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-t-[999px] rounded-b-[2rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40 motion-reduce:transition-none"
      />

      {/* Ring gradien + foto utuh */}
      <div className="relative rounded-t-[999px] rounded-b-[2rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] p-1 shadow-2xl transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <div className="overflow-hidden rounded-t-[999px] rounded-b-[calc(2rem-0.25rem)] bg-[#0b0b14]">
          <img
            src="/profile-sukma.png"
            alt="Sukma Bagus Wahasdwika"
            width="720"
            height="1280"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
});

const TECH_STACK = ["Next.js", "Laravel", "Spring Boot", "Angular", "PostgreSQL", "Flutter"];

const Home = () => {
  return (
    <>
      <Helmet>
        <title>{`Sukma Bagus Wahasdwika — ${PROFILE_ROLE}`}</title>
        <meta name="description" content={`Website resmi dan portofolio Sukma Bagus Wahasdwika, ${PROFILE_ROLE}.`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://github.com/bagusswahasdwikaa" />
        <meta property="og:title" content={`Sukma Bagus Wahasdwika — ${PROFILE_ROLE}`} />
        <meta property="og:description" content={`Website resmi dan portofolio Sukma Bagus Wahasdwika, ${PROFILE_ROLE}.`} />
        <meta property="og:url" content="https://github.com/bagusswahasdwikaa" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sukma Bagus Wahasdwika",
            "jobTitle": "${PROFILE_ROLE}",
            "url": "https://github.com/bagusswahasdwikaa",
            "sameAs": ${JSON.stringify(
              CONTACT_LINKS.filter(({ name }) => name === "GitHub" || name === "LinkedIn")
                .map(({ url }) => url)
            )}
          }
        `}</script>
      </Helmet>

      <section className="editorial-hero min-h-screen overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
        <div className="relative z-10">
          <div className="container mx-auto min-h-screen">
            {/* py + gap: memberi ruang napas di mobile agar foto tidak menempel ke section berikutnya */}
            <div className="editorial-hero-grid flex min-h-screen flex-col justify-center gap-12 py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-0">
              {/* Left Column */}
              <div
                className="order-1 w-full space-y-6 text-left sm:space-y-8 lg:w-1/2"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="space-y-4 sm:space-y-6">
                  <StatusBadge />
                  <MainTitle />

                  {/* Description */}
                  <p
                    className="max-w-xl text-base font-light leading-relaxed text-gray-400 md:text-lg"
                    data-aos="fade-up"
                    data-aos-delay="1000"
                  >
                    Lulusan Sarjana Terapan Teknik Informatika Politeknik Negeri Malang. Berpengalaman dalam pengembangan Web & Mobile modern serta perancangan arsitektur sistem berkinerja tinggi.
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap justify-start gap-3" data-aos="fade-up" data-aos-delay="1200">
                    {TECH_STACK.map((tech) => (
                      <TechStack key={tech} tech={tech} />
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex w-full flex-row justify-start gap-3" data-aos="fade-up" data-aos-delay="1400">
                    <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                    <CTAButton href="#Contact" text="Contact" icon={Mail} />
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-wrap justify-start gap-2" data-aos="fade-up" data-aos-delay="1600">
                    {CONTACT_LINKS.map(({ icon: Icon, url, label }) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--muted)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Portrait (bingkai arch, foto utuh tanpa crop, tanpa offset/rotate yang meluber) */}
              <div className="order-2 flex w-full items-center justify-center lg:w-1/2">
                <Portrait />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(Home);