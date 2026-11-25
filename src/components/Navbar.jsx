import { useEffect, useState } from "react";
import { Briefcase, Home as HomeIcon, Mail, User } from "lucide-react";

const navItems = [
    { href: "#Home", label: "Home", icon: HomeIcon },
    { href: "#About", label: "About", icon: User },
    { href: "#Portofolio", label: "Work", icon: Briefcase },
    { href: "#Contact", label: "Contact", icon: Mail },
];

const Navbar = () => {
    const [activeSection, setActiveSection] = useState("Home");

    useEffect(() => {
        const observedSections = new Set();

        const updateActiveSection = () => {
            const sections = Array.from(observedSections);
            if (!sections.length) return;

            const focusLine = window.innerHeight * 0.43;
            const currentSection = sections.find((section) => {
                const bounds = section.getBoundingClientRect();
                return bounds.top <= focusLine && bounds.bottom > focusLine;
            }) || sections.reduce((nearest, section) => {
                const bounds = section.getBoundingClientRect();
                const distance = Math.min(
                    Math.abs(bounds.top - focusLine),
                    Math.abs(bounds.bottom - focusLine)
                );
                return distance < nearest.distance
                    ? { section, distance }
                    : nearest;
            }, { section: null, distance: Infinity }).section;

            if (currentSection) setActiveSection(currentSection.id);
        };

        const observer = new IntersectionObserver(
            updateActiveSection,
            { rootMargin: "-38% 0px -52% 0px", threshold: 0 }
        );
        const observeAvailableSections = () => {
            navItems.forEach(({ href }) => {
                const section = document.querySelector(href);
                if (section && !observedSections.has(section)) {
                    observedSections.add(section);
                    observer.observe(section);
                }
            });
            updateActiveSection();
        };
        const mutations = new MutationObserver(observeAvailableSections);

        observeAvailableSections();
        mutations.observe(document.body, { childList: true, subtree: true });
        return () => {
            mutations.disconnect();
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            setActiveSection(section.id);
            section.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                block: "start",
            });
        }
    };

    return (
        <nav className="portfolio-navigation" aria-label="Section navigation">
            <a
                href="#Home"
                onClick={(e) => scrollToSection(e, "#Home")}
                className="nav-monogram"
                aria-label="Back to home"
            >
                SB
            </a>
            <div className="nav-links">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.href.substring(1);
                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`nav-link ${isActive ? "active" : ""}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <Icon aria-hidden="true" />
                            <span>{item.label}</span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;