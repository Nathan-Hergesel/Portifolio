# hergesel.dev

Portfólio profissional de Nathan Hergesel, desenvolvido com Next.js App Router, React e Tailwind CSS e publicado em [nathanhergesel.me](https://nathanhergesel.me).

## Desenvolvimento

```powershell
npm install
npm run dev
```

O Next.js informa o endereço local no terminal, normalmente `http://localhost:3000`.

## Produção

```powershell
npm run build
```

O build pré-renderizado é gerado em `out/`. O GitHub Actions executa esse processo e publica o artefato automaticamente no GitHub Pages.

## Estrutura

- `app/`: rotas, layout, metadados, robots e sitemap do App Router
- `src/components/`: componentes da interface
- `src/hooks/`: scroll, navegação, reveal e preferências de movimento
- `src/data/`: conteúdo reutilizável
- `src/styles.css`: Tailwind CSS, sistema visual, responsividade e motion
- `public/assets/`: logo, retrato, projetos e ícones
- `public/`: CNAME, favicons e manifesto
- `docs/`: informações profissionais e direção de produto/design

O projeto usa exportação estática para continuar no GitHub Pages. Ao migrar o deploy para a Vercel, basta remover `output: "export"` para habilitar recursos de servidor, como Route Handlers e dados dinâmicos.
