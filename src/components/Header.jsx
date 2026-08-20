import { HeaderBrand } from "./BrandIdentity";
import { navigationItems, socialLinks } from "../data/site";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";

const socialIcons = {
  github: BsGithub,
  instagram: BsInstagram,
  linkedin: BsLinkedin,
  x: RiTwitterXFill
};

export function MenuToggle({ menuOpen, onToggle, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      className="menu-toggle"
      type="button"
      aria-expanded={menuOpen}
      aria-controls="menu-principal"
      onClick={onToggle}
    >
      <span className="sr-only">{menuOpen ? "Fechar menu" : "Abrir menu"}</span>
      <span />
      <span />
      <span />
    </button>
  );
}

export function Header({ activeSection, headerRef, menuOpen, onNavigate }) {
  return (
    <header className="site-header" data-header ref={headerRef}>
      <HeaderBrand />

      <nav
        className={`site-nav${menuOpen ? " is-open" : ""}`}
        id="menu-principal"
        aria-label="Navegação principal"
      >
        {navigationItems.map((item) => (
          <a
            key={item.id}
            className={activeSection === item.id ? "is-active" : undefined}
            href={`#${item.id}`}
            onClick={onNavigate}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-socials" role="group" aria-label="Redes sociais">
        {socialLinks.map((link) => {
          const Icon = socialIcons[link.icon];

          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
            >
              <Icon aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </header>
  );
}
