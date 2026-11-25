import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";

export const PROFILE_ROLE =
  "Web Developer | Integration IOT & Automation | Fullstack Developer";

export const CONTACT_LINKS = [
  {
    name: "GitHub",
    label: "GitHub Profile",
    detail: "@bagusswahasdwikaa",
    url: "https://github.com/bagusswahasdwikaa/",
    icon: Github,
  },
  {
    name: "Email",
    label: "Email",
    detail: "sukmabaguswahasdwika10@gmail.com",
    url: "mailto:sukmabaguswahasdwika10@gmail.com",
    icon: Mail,
  },
  {
    name: "WhatsApp",
    label: "WhatsApp",
    detail: "0821-3216-4561",
    url: "https://wa.me/6282132164561",
    icon: MessageCircle,
  },
  {
    name: "LinkedIn",
    label: "LinkedIn Profile",
    detail: "Let's connect",
    url: "https://www.linkedin.com/in/sukma-bagus-wahasdwika-617492328/",
    icon: Linkedin,
  },
];

export const GITHUB_PROFILE_URL = CONTACT_LINKS.find(
  ({ name }) => name === "GitHub",
).url;
