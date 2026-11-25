import { GITHUB_PROFILE_URL, PROFILE_ROLE } from "../config/profile";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © {currentYear}{" "}
          <a href={GITHUB_PROFILE_URL} className="hover:underline" target="_blank" rel="noopener noreferrer">
            Baguswahasdwika™
          </a>
          . All Rights Reserved.
        </span>
        <span className="block pb-2 text-xs text-gray-500">{PROFILE_ROLE}</span>
      </center>
    </footer>
  );
};

export default Footer;