import { HeroBrand } from "./BrandIdentity";
import { HeroToolCloud } from "./HeroToolCloud";
import { RotatingHeadline } from "./RotatingHeadline";
import { BsArrowUpRight } from "react-icons/bs";

const projectCards = [
  {
    className: "stack-card-left",
    image: "/assets/images/projects/mercearia-facil.webp",
    width: 1254,
    height: 1254,
    title: "Mercearia Fácil",
    description: "Aplicativo de gestão"
  },
  {
    className: "stack-card-right",
    image: "/assets/images/projects/obraflow.webp",
    width: 1122,
    height: 1408,
    title: "ObraFlow",
    description: "Sistema de gestão"
  },
  {
    className: "stack-card-front",
    image: "/assets/images/projects/vjs-sistemas.webp",
    width: 1600,
    height: 762,
    title: "VJS Sistemas",
    description: "Site comercial",
    href: "https://vjssistemas.com.br/"
  }
];

function ProjectStack() {
  return (
    <div className="hero-project-stack">
      <span className="stack-heading">Últimos trabalhos</span>
      {projectCards.map((card) => {
        const Card = card.href ? "a" : "span";

        return (
          <Card
            className={`stack-card ${card.className}`}
            href={card.href}
            target={card.href ? "_blank" : undefined}
            rel={card.href ? "noreferrer" : undefined}
            aria-label={card.href ? `Abrir ${card.title}` : undefined}
            aria-hidden={card.href ? undefined : "true"}
            key={card.title}
          >
            <img
              src={card.image}
              alt=""
              width={card.width}
              height={card.height}
              loading="lazy"
              decoding="async"
            />
            <span>
              <strong>{card.title}</strong>
              <small>{card.description}</small>
              <BsArrowUpRight aria-hidden="true" />
            </span>
          </Card>
        );
      })}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 18 18 6M9 6h9v9" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const heroActions = [
  {
    href: "#projetos",
    title: "Ver projetos",
    description: "Cases e resultados",
    iconClassName: "",
    icon: <ArrowIcon />
  },
  {
    href: "#servicos",
    title: "Conhecer serviços",
    description: "O que posso fazer por você",
    iconClassName: "action-icon-blue",
    icon: <GridIcon />
  },
  {
    href: "#contato",
    title: "Iniciar projeto",
    description: "Vamos conversar",
    iconClassName: "action-icon-dark",
    icon: <PlusIcon />
  }
];

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-portrait">
        <div className="hero-brand-plane" aria-hidden="true" />
        <HeroBrand />
        <HeroToolCloud />
        <img
          src="/assets/images/nathan-hergesel.webp"
          alt="Nathan Hergesel, desenvolvedor e designer, de braços cruzados"
          width="587"
          height="955"
          fetchPriority="high"
        />
      </div>

      <div className="hero-content">
        <ProjectStack />

        <h1 id="hero-title">
          <RotatingHeadline />
          <span>para tirar</span>
          <span>ideias do</span>
          <span>papel</span>
        </h1>

        <p className="hero-intro">
          Soluções digitais alinhadas ao seu negócio, com criatividade aplicada e acompanhamento do{" "}
          <strong>briefing ao suporte.</strong>
        </p>

        <nav className="hero-actions" aria-label="Ações principais">
          {heroActions.map((action) => (
            <a className="hero-action" href={action.href} key={action.title}>
              <span className={`action-icon ${action.iconClassName}`} aria-hidden="true">
                {action.icon}
              </span>
              <span>
                <strong>{action.title}</strong>
                <small>{action.description}</small>
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
