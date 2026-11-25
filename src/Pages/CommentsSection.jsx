import Komentar from "../components/Commentar";

const CommentsSection = () => (
  <section
    className="mx-auto w-full max-w-6xl scroll-mt-8 px-[5%] py-12 sm:px-8"
    aria-label="Community comments"
  >
    <Komentar />
  </section>
);

export default CommentsSection;
