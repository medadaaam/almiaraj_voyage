import { useEffect, useState } from "react";

export function useScrollSpy() {
  const [activeSection, setActiveSection] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const getSections = () => document.querySelectorAll(".scroll-section");
    const getNavLinks = () => document.querySelectorAll(".nav-link");

    const handleScroll = () => {
      // Sticky header
      setIsSticky(window.scrollY > 100);

      // Active section spy
      const sections = getSections();
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute("id") || "";
        }
      });

      setActiveSection(current);

      // Update active class on nav links
      const navLinks = getNavLinks();
      navLinks.forEach((link) => {
        link.classList.remove("active");
        const href = link.getAttribute("href");
        if (href === `#${current}`) {
          link.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { activeSection, isSticky };
}
