const LOGO_PATH = "/assets/brand/nathan-hergesel-logo.webp";

export function BrandCopy({ compact = false }) {
  return (
    <span className={`brand-copy${compact ? " header-brand-copy" : ""}`} aria-hidden={compact || undefined}>
      <span>Nathan</span>
      <span>Hergesel</span>
      <small>
        Desenvolvedor
        <br />e Designer
      </small>
    </span>
  );
}

export function HeaderBrand() {
  return (
    <a className="header-brand-reveal" href="#inicio" aria-label="Nathan Hergesel, voltar ao início">
      <span className="header-brand-logo" aria-hidden="true">
        <img src={LOGO_PATH} alt="" width="384" height="401" />
      </span>
      <BrandCopy compact />
    </a>
  );
}

export function HeroBrand() {
  return (
    <div className="brand hero-brand">
      <span className="brand-logo-frame" aria-hidden="true">
        <img src={LOGO_PATH} alt="" width="384" height="401" />
      </span>
      <BrandCopy />
    </div>
  );
}
