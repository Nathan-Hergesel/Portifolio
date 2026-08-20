export function Footer() {
  return (
    <footer className="site-footer">
      <a className="brand footer-brand" href="#inicio">
        <span className="brand-mark">NH</span>
        <span className="brand-copy">
          Nathan Hergesel
          <small>Desenvolvimento &amp; Design</small>
        </span>
      </a>
      <p>Itapetininga, SP · Brasil</p>
      <p>© {new Date().getFullYear()} Nathan Hergesel</p>
      <a href="#inicio">Voltar ao topo ↑</a>
    </footer>
  );
}
