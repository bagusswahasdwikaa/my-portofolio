import SocialLinks from "../components/SocialLinks";

const ContactPage = () => (
  <section
    className="contact-section scroll-mt-8 px-[5%] py-16 sm:px-[5%] lg:px-[10%]"
    id="Contact"
  >
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Get in touch
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Contact
        </h2>
      </header>

      <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-5 shadow-[var(--shadow-card)] sm:p-8">
        <SocialLinks />
      </div>
    </div>
  </section>
);

export default ContactPage;
